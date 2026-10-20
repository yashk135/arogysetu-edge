import React, { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, CheckCircle } from 'lucide-react';
import {
  isOnline,
  getPendingCount,
  onQueueChange,
  queueEventEmitter,
  processOfflineQueue,
} from '../services/offlineQueue.js';

/**
 * OfflineSyncBanner Component
 *
 * Sticky status banner at top of viewport for ArogyaSetu Edge PWA.
 * Monitors network state and IndexedDB offline queue.
 *
 * States:
 * 1. Offline (Red/Amber): Shows local storage status, pending count, pulsing dot
 * 2. Syncing (Blue): Shows sync in progress with queue item count & progress indicator
 * 3. Back Online (Green): Success notification, automatically self-dismisses after 3 seconds
 */
export default function OfflineSyncBanner() {
  const [online, setOnline] = useState(isOnline());
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showBackOnline, setShowBackOnline] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [syncStats, setSyncStats] = useState({ total: 0, processed: 0 });

  const wasOfflineRef = useRef(!isOnline());
  const backOnlineTimerRef = useRef(null);

  // Helper to trigger temporary "Back Online" green banner
  const triggerBackOnline = () => {
    setShowBackOnline(true);
    setIsDismissed(false);

    if (backOnlineTimerRef.current) {
      clearTimeout(backOnlineTimerRef.current);
    }

    backOnlineTimerRef.current = setTimeout(() => {
      setShowBackOnline(false);
    }, 3000);
  };

  useEffect(() => {
    let isMounted = true;

    // 1. Initial pending count fetch
    getPendingCount()
      .then((count) => {
        if (isMounted) setPendingCount(count);
      })
      .catch((err) => {
        console.warn('[OfflineSyncBanner] Initial count check notice:', err);
      });

    // 2. Online Event Handler
    const handleOnline = () => {
      if (!isMounted) return;
      setOnline(true);
      setIsDismissed(false);

      getPendingCount().then((count) => {
        if (!isMounted) return;
        setPendingCount(count);

        if (count === 0 && wasOfflineRef.current) {
          triggerBackOnline();
        }
        wasOfflineRef.current = false;
      });
    };

    // 3. Offline Event Handler
    const handleOffline = () => {
      if (!isMounted) return;
      setOnline(false);
      setIsSyncing(false);
      setShowBackOnline(false);
      setIsDismissed(false);
      wasOfflineRef.current = true;

      if (backOnlineTimerRef.current) {
        clearTimeout(backOnlineTimerRef.current);
        backOnlineTimerRef.current = null;
      }

      getPendingCount().then((count) => {
        if (isMounted) setPendingCount(count);
      });
    };

    // 4. Queue Change Subscription
    const unsubscribeQueue = onQueueChange((payload) => {
      if (!isMounted) return;

      // Reset dismiss on new offline additions so user is informed
      if (payload?.action === 'add') {
        setIsDismissed(false);
      }

      if (typeof payload?.pendingCount === 'number') {
        setPendingCount(payload.pendingCount);
      } else {
        getPendingCount().then((count) => {
          if (isMounted) setPendingCount(count);
        });
      }

      // Track item progress during active sync
      if (payload?.action === 'synced' && isSyncing) {
        setSyncStats((prev) => ({
          ...prev,
          processed: Math.min(prev.total, prev.processed + 1),
        }));
      }
    });

    // 5. Sync Lifecycle Listeners
    const unsubscribeSyncStart = queueEventEmitter?.on?.('sync_start', () => {
      if (!isMounted) return;
      setIsSyncing(true);
      setIsDismissed(false);
      setShowBackOnline(false);

      getPendingCount().then((count) => {
        if (isMounted) {
          const totalItems = Math.max(count, 1);
          setSyncStats({ total: totalItems, processed: 0 });
        }
      });
    });

    const unsubscribeSyncEnd = queueEventEmitter?.on?.('sync_end', (summary) => {
      if (!isMounted) return;
      setIsSyncing(false);

      getPendingCount().then((count) => {
        if (!isMounted) return;
        setPendingCount(count);

        // Transition smoothly to "Back Online" state if queue is cleared
        if (count === 0 && (wasOfflineRef.current || summary?.processed > 0)) {
          triggerBackOnline();
          wasOfflineRef.current = false;
        }
      });
    });

    // Register DOM Network Listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      isMounted = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if (typeof unsubscribeQueue === 'function') unsubscribeQueue();
      if (typeof unsubscribeSyncStart === 'function') unsubscribeSyncStart();
      if (typeof unsubscribeSyncEnd === 'function') unsubscribeSyncEnd();

      if (backOnlineTimerRef.current) {
        clearTimeout(backOnlineTimerRef.current);
      }
    };
  }, [isSyncing]);

  // Auto-trigger sync if online and pending items exist without active sync
  useEffect(() => {
    if (online && pendingCount > 0 && !isSyncing) {
      processOfflineQueue().catch((err) => {
        console.warn('[OfflineSyncBanner] Auto process notice:', err);
      });
    }
  }, [online, pendingCount, isSyncing]);

  // Determine current active banner state
  let bannerState = null;
  if (!online) {
    bannerState = 'offline';
  } else if (isSyncing) {
    bannerState = 'syncing';
  } else if (showBackOnline) {
    bannerState = 'back_online';
  } else if (pendingCount > 0) {
    bannerState = 'syncing'; // online with pending items automatically transitions to syncing
  }

  // Banner visibility: visible when offline, pending items, syncing, or back online (and not dismissed)
  const isVisible = Boolean(bannerState) && !isDismissed;

  // Calculate progress percentage for syncing indicator
  const progressPercent =
    syncStats.total > 0
      ? Math.max(15, Math.min(100, Math.round((syncStats.processed / syncStats.total) * 100)))
      : 50;

  const totalQueuedItems = syncStats.total > 0 ? syncStats.total : pendingCount;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out transform ${
        isVisible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
      role="status"
      aria-live="polite"
    >
      {/* 1. Offline Banner State (Red / Amber) */}
      {bannerState === 'offline' && (
        <div className="w-full bg-[#160b08]/95 backdrop-blur-md border-b border-amber-600/40 text-amber-200 px-4 py-2.5 shadow-xl transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            
            {/* Left Message & Pulsing Indicator */}
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Pulsing Amber / Red Dot Animation */}
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              </span>

              <p className="text-xs sm:text-sm font-medium leading-tight text-amber-100">
                📡 You are Offline — Data saved locally. Will auto-sync when signal returns
              </p>
            </div>

            {/* Right: Pending Count Badge & Dismiss Button */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto flex-shrink-0">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                {pendingCount} {pendingCount === 1 ? 'item' : 'items'} waiting to sync
              </span>

              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="p-1 rounded-md text-amber-400/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Dismiss offline banner"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. Syncing Banner State (Blue) */}
      {bannerState === 'syncing' && (
        <div className="w-full bg-[#081329]/95 backdrop-blur-md border-b border-blue-500/40 text-blue-200 px-4 py-2.5 shadow-xl transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            
            {/* Left Syncing Message */}
            <div className="flex items-center gap-2.5 min-w-0">
              <RefreshCw className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
              <p className="text-xs sm:text-sm font-medium leading-tight text-blue-100">
                🔄 Syncing... Processing {totalQueuedItems} queued {totalQueuedItems === 1 ? 'item' : 'items'}
              </p>
            </div>

            {/* Right: Progress Indicator & Dismiss Button */}
            <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-20 sm:w-28 h-1.5 bg-blue-950/80 rounded-full overflow-hidden border border-blue-700/50">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[11px] text-blue-300 font-mono">
                  {syncStats.processed}/{totalQueuedItems}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="p-1 rounded-md text-blue-400/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Dismiss syncing banner"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. Back Online Banner State (Green / Emerald) */}
      {bannerState === 'back_online' && (
        <div className="w-full bg-[#061810]/95 backdrop-blur-md border-b border-emerald-500/40 text-emerald-200 px-4 py-2.5 shadow-xl transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <p className="text-xs sm:text-sm font-medium leading-tight text-emerald-100">
                ✅ Back Online — All data synced successfully!
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowBackOnline(false);
                setIsDismissed(true);
              }}
              className="p-1 rounded-md text-emerald-400/80 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Dismiss notification"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
