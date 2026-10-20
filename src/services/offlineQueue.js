import { openDB } from 'idb';
import { initDB, DB_NAME, DB_VERSION } from './db.js';

export const QUEUE_STORE_NAME = 'offline_queue';

/**
 * Custom Event Emitter for Queue updates.
 * Allows UI components (e.g. status badge, queue modal, header indicator)
 * to listen for offline queue events reactively.
 */
class QueueEventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
      if (this.listeners.get(event).size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`[OfflineQueue] Error in event listener for "${event}":`, err);
        }
      });
    }
  }
}

export const queueEventEmitter = new QueueEventEmitter();

/**
 * Subscribe to general queue changes (add, sync, remove, process).
 * @param {Function} callback Function called on queue changes
 * @returns {Function} Unsubscribe cleanup function
 */
export function subscribeToQueueChanges(callback) {
  return queueEventEmitter.on('change', callback);
}

// Convenient alias for subscriptions
export const onQueueChange = subscribeToQueueChanges;

/**
 * Checks whether the browser is currently online.
 * @returns {boolean}
 */
export function isOnline() {
  if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
    return navigator.onLine;
  }
  return true;
}

/**
 * Opens and ensures the database is initialized with the offline_queue store.
 * Uses initDB() from db.js which contains the v2 upgrade logic,
 * with fallback to direct openDB if needed.
 */
export async function getQueueDB() {
  try {
    const db = await initDB();
    if (db.objectStoreNames.contains(QUEUE_STORE_NAME)) {
      return db;
    }
    console.warn(`[OfflineQueue] Store "${QUEUE_STORE_NAME}" missing from connection, performing direct open`);
  } catch (err) {
    console.warn('[OfflineQueue] initDB() threw error, falling back to direct open:', err);
  }

  return openDB(DB_NAME || 'arogyasetu_edge_db', DB_VERSION || 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(QUEUE_STORE_NAME)) {
        const queueStore = db.createObjectStore(QUEUE_STORE_NAME, { keyPath: 'id' });
        queueStore.createIndex('type', 'type', { unique: false });
        queueStore.createIndex('status', 'status', { unique: false });
        queueStore.createIndex('createdAt', 'createdAt', { unique: false });
        console.log('[OfflineQueue] Created "offline_queue" object store with indexes');
      }
    },
  });
}

/**
 * Adds a new item to the offline queue.
 *
 * Queue Item Structure:
 * {
 *   id: string,
 *   type: 'camera' | 'voice' | 'ocr' | 'triage',
 *   status: 'pending' | 'processing' | 'synced' | 'failed',
 *   payload: any,
 *   patientId: string | null,
 *   patientName: string | null,
 *   createdAt: string (ISO),
 *   syncedAt: string | null (ISO)
 * }
 *
 * @param {Object} item Item to be added
 * @returns {Promise<Object>} The stored queue item
 */
export async function addToOfflineQueue(item = {}) {
  try {
    const db = await getQueueDB();

    const allowedTypes = ['camera', 'voice', 'ocr', 'triage'];
    const type = allowedTypes.includes(item.type) ? item.type : 'triage';

    const queueItem = {
      id: item.id || `QUEUE_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      status: item.status || 'pending',
      payload: item.payload !== undefined ? item.payload : null,
      patientId: item.patientId || null,
      patientName: item.patientName || 'Anonymous Patient',
      createdAt: item.createdAt || new Date().toISOString(),
      syncedAt: item.syncedAt || null,
      error: item.error || null,
      retryCount: item.retryCount || 0,
      metadata: item.metadata || {},
    };

    await db.put(QUEUE_STORE_NAME, queueItem);
    console.log(`[OfflineQueue] Added item [${queueItem.id}] (${queueItem.type}) for patient "${queueItem.patientName}"`);

    const pendingCount = await getPendingCount();
    queueEventEmitter.emit('change', { action: 'add', item: queueItem, pendingCount });
    queueEventEmitter.emit('item_added', queueItem);

    return queueItem;
  } catch (error) {
    console.error('[OfflineQueue] Failed to add item to offline queue:', error);
    throw error;
  }
}

/**
 * Retrieves items from the offline queue, optionally filtered by status.
 * Returns items sorted by createdAt in descending order (newest first).
 *
 * @param {string} [statusFilter] Optional filter: 'pending' | 'processing' | 'synced' | 'failed'
 * @returns {Promise<Array>}
 */
export async function getQueuedItems(statusFilter) {
  try {
    const db = await getQueueDB();
    let items = [];

    if (statusFilter) {
      items = await db.getAllFromIndex(QUEUE_STORE_NAME, 'status', statusFilter);
    } else {
      items = await db.getAll(QUEUE_STORE_NAME);
    }

    return (items || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('[OfflineQueue] Failed to get queued items:', error);
    return [];
  }
}

/**
 * Returns the count of pending items currently waiting in the offline queue.
 * @returns {Promise<number>}
 */
export async function getPendingCount() {
  try {
    const db = await getQueueDB();
    if (typeof db.countFromIndex === 'function') {
      return await db.countFromIndex(QUEUE_STORE_NAME, 'status', 'pending');
    }
    const pendingItems = await db.getAllFromIndex(QUEUE_STORE_NAME, 'status', 'pending');
    return pendingItems.length;
  } catch (error) {
    console.error('[OfflineQueue] Failed to get pending count:', error);
    return 0;
  }
}

/**
 * Marks an item as synced in the offline queue.
 * Updates syncedAt timestamp and resets any error states.
 *
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function markAsSynced(id) {
  try {
    const db = await getQueueDB();
    const item = await db.get(QUEUE_STORE_NAME, id);

    if (!item) {
      console.warn(`[OfflineQueue] Item not found to mark as synced: [${id}]`);
      return null;
    }

    item.status = 'synced';
    item.syncedAt = new Date().toISOString();
    item.error = null;

    await db.put(QUEUE_STORE_NAME, item);
    console.log(`[OfflineQueue] Successfully marked item [${id}] as synced`);

    const pendingCount = await getPendingCount();
    queueEventEmitter.emit('change', { action: 'synced', item, pendingCount });
    queueEventEmitter.emit('item_synced', item);

    return item;
  } catch (error) {
    console.error(`[OfflineQueue] Failed to mark item [${id}] as synced:`, error);
    throw error;
  }
}

/**
 * Removes an item completely from the offline queue.
 *
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function removeFromQueue(id) {
  try {
    const db = await getQueueDB();
    await db.delete(QUEUE_STORE_NAME, id);
    console.log(`[OfflineQueue] Removed item [${id}] from offline queue`);

    const pendingCount = await getPendingCount();
    queueEventEmitter.emit('change', { action: 'remove', id, pendingCount });
    queueEventEmitter.emit('item_removed', { id });

    return true;
  } catch (error) {
    console.error(`[OfflineQueue] Failed to remove item [${id}] from queue:`, error);
    throw error;
  }
}

/**
 * Retrieves a single queue item by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getQueueItemById(id) {
  try {
    const db = await getQueueDB();
    return await db.get(QUEUE_STORE_NAME, id);
  } catch (error) {
    console.error(`[OfflineQueue] Failed to fetch item [${id}]:`, error);
    return null;
  }
}

/**
 * Resets a failed queue item to 'pending' and triggers sync if online.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function retryFailedItem(id) {
  try {
    const db = await getQueueDB();
    const item = await db.get(QUEUE_STORE_NAME, id);
    if (!item) return null;

    item.status = 'pending';
    item.error = null;
    await db.put(QUEUE_STORE_NAME, item);
    console.log(`[OfflineQueue] Reset item [${id}] to pending for retry`);

    const pendingCount = await getPendingCount();
    queueEventEmitter.emit('change', { action: 'retry', item, pendingCount });

    if (isOnline()) {
      processOfflineQueue();
    }
    return item;
  } catch (error) {
    console.error(`[OfflineQueue] Failed to retry item [${id}]:`, error);
    throw error;
  }
}

/**
 * Removes all items with status 'synced' from the queue to free up storage.
 * @returns {Promise<number>} Number of cleared items
 */
export async function clearSyncedItems() {
  try {
    const db = await getQueueDB();
    const syncedItems = await db.getAllFromIndex(QUEUE_STORE_NAME, 'status', 'synced');
    for (const item of syncedItems) {
      await db.delete(QUEUE_STORE_NAME, item.id);
    }
    console.log(`[OfflineQueue] Cleared ${syncedItems.length} synced items from queue`);
    const pendingCount = await getPendingCount();
    queueEventEmitter.emit('change', { action: 'clear_synced', count: syncedItems.length, pendingCount });
    return syncedItems.length;
  } catch (error) {
    console.error('[OfflineQueue] Failed to clear synced items:', error);
    throw error;
  }
}

let isProcessingQueue = false;
let registeredProcessor = null;

/**
 * Registers an optional application-level processor function to be called
 * during automatic background sync when internet connection returns.
 * @param {Function} fn Function accepting a queue item
 */
export function registerQueueProcessor(fn) {
  registeredProcessor = fn;
  console.log('[OfflineQueue] Custom queue processor registered');
}

/**
 * Default internal processor if no custom processor is provided.
 * If the item contains a triage record, it marks the local triage_records entry as synced: true.
 * @param {Object} item Queue item
 */
async function defaultProcessor(item) {
  console.log(`[OfflineQueue] Processing item [${item.id}] of type "${item.type}" with default processor`);

  // If item is triage data, update matching triage_records store entry
  if (item.type === 'triage' && item.payload) {
    try {
      const db = await getQueueDB();
      const triageId = item.payload.id || item.payload.recordId;
      if (triageId && db.objectStoreNames.contains('triage_records')) {
        const record = await db.get('triage_records', triageId);
        if (record) {
          record.synced = true;
          await db.put('triage_records', record);
          console.log(`[OfflineQueue] Associated triage_record [${triageId}] marked synced: true`);
        }
      }
    } catch (err) {
      console.warn('[OfflineQueue] Notice updating triage_record:', err);
    }
  }

  // Brief pause to simulate smooth network transaction
  await new Promise((resolve) => setTimeout(resolve, 200));
  return true;
}

/**
 * Iterates through all pending items in the offline queue,
 * executes processorFn for each item, and marks them as synced on success.
 * In case of failure, marks the item as 'failed' with error details.
 *
 * @param {Function} [processorFn] Optional custom processing function
 * @returns {Promise<{ total: number, processed: number, failed: number, offline?: boolean }>}
 */
export async function processOfflineQueue(processorFn) {
  if (isProcessingQueue) {
    console.log('[OfflineQueue] Queue sync already in progress. Skipping duplicate execution.');
    return { status: 'in-progress', processed: 0, failed: 0 };
  }

  if (!isOnline()) {
    console.log('[OfflineQueue] Device is offline. Postponing queue processing until internet returns.');
    return { total: 0, processed: 0, failed: 0, offline: true };
  }

  isProcessingQueue = true;
  queueEventEmitter.emit('sync_start');

  try {
    const db = await getQueueDB();
    const pendingItems = await db.getAllFromIndex(QUEUE_STORE_NAME, 'status', 'pending');

    if (!pendingItems || pendingItems.length === 0) {
      console.log('[OfflineQueue] No pending items in queue to process.');
      isProcessingQueue = false;
      queueEventEmitter.emit('sync_end', { total: 0, processed: 0, failed: 0 });
      return { total: 0, processed: 0, failed: 0 };
    }

    // Process oldest items first (FIFO)
    pendingItems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    console.log(`[OfflineQueue] Processing ${pendingItems.length} pending items...`);

    let processedCount = 0;
    let failedCount = 0;
    const activeProcessor = processorFn || registeredProcessor || defaultProcessor;

    for (const item of pendingItems) {
      // Guard: check if network was disconnected mid-sync
      if (!isOnline()) {
        console.warn('[OfflineQueue] Network disconnected mid-sync. Pausing queue processing.');
        break;
      }

      try {
        // Mark status as processing
        item.status = 'processing';
        await db.put(QUEUE_STORE_NAME, item);
        queueEventEmitter.emit('change', { action: 'processing', item });

        // Call processor function
        await activeProcessor(item);

        // Mark as synced
        await markAsSynced(item.id);
        processedCount++;
      } catch (err) {
        console.error(`[OfflineQueue] Error processing item [${item.id}]:`, err);
        item.status = 'failed';
        item.error = err?.message || String(err);
        item.retryCount = (item.retryCount || 0) + 1;
        await db.put(QUEUE_STORE_NAME, item);

        queueEventEmitter.emit('change', { action: 'failed', item, error: item.error });
        queueEventEmitter.emit('item_failed', { item, error: item.error });
        failedCount++;
      }
    }

    console.log(`[OfflineQueue] Sync completed. Processed: ${processedCount}, Failed: ${failedCount}`);
    const summary = {
      total: pendingItems.length,
      processed: processedCount,
      failed: failedCount,
    };

    queueEventEmitter.emit('sync_end', summary);
    return summary;
  } catch (error) {
    console.error('[OfflineQueue] Unexpected error during processOfflineQueue:', error);
    throw error;
  } finally {
    isProcessingQueue = false;
  }
}

// Auto-register browser online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    console.log('[OfflineQueue] Internet connection restored (online event). Triggering auto-sync...');
    queueEventEmitter.emit('network_status', { isOnline: true });
    try {
      await processOfflineQueue();
    } catch (err) {
      console.error('[OfflineQueue] Error in auto-sync on online event:', err);
    }
  });

  window.addEventListener('offline', () => {
    console.log('[OfflineQueue] Internet connection lost (offline event). Offline queue active.');
    queueEventEmitter.emit('network_status', { isOnline: false });
  });
}
