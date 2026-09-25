import { openDB } from 'idb';

const DB_NAME = 'arogyasetu_edge_db';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Patients store
      if (!db.objectStoreNames.contains('patients')) {
        const patientStore = db.createObjectStore('patients', { keyPath: 'id' });
        patientStore.createIndex('name', 'name', { unique: false });
        patientStore.createIndex('village', 'village', { unique: false });
        patientStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Triage Records store
      if (!db.objectStoreNames.contains('triage_records')) {
        const triageStore = db.createObjectStore('triage_records', { keyPath: 'id' });
        triageStore.createIndex('patientId', 'patientId', { unique: false });
        triageStore.createIndex('riskLevel', 'riskLevel', { unique: false });
        triageStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    },
  });
}

// Save or update a patient
export async function savePatient(patientData) {
  const db = await initDB();
  const patient = {
    id: patientData.id || `PAT_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: patientData.name || 'Anonymous Patient',
    age: parseInt(patientData.age) || 0,
    gender: patientData.gender || 'Female',
    isPregnant: Boolean(patientData.isPregnant),
    village: patientData.village || 'Gram Panchayat',
    phone: patientData.phone || '',
    notes: patientData.notes || '',
    createdAt: patientData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.put('patients', patient);
  return patient;
}

// Fetch all patients
export async function getAllPatients() {
  const db = await initDB();
  const patients = await db.getAll('patients');
  return patients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Fetch a single patient by ID
export async function getPatientById(id) {
  const db = await initDB();
  return await db.get('patients', id);
}

// Save a triage assessment record
export async function saveTriageRecord(recordData) {
  const db = await initDB();
  const record = {
    id: `TRIAGE_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    patientId: recordData.patientId,
    patientName: recordData.patientName || 'Unknown',
    cameraResult: recordData.cameraResult || null, // { anemiaProb, jaundiceProb, severity }
    voiceResult: recordData.voiceResult || null,   // { transcript, symptoms, severity }
    ocrResult: recordData.ocrResult || null,       // { rawText, values, summary }
    riskScore: recordData.riskScore || 0,         // 0 - 100
    riskLevel: recordData.riskLevel || 'GREEN',   // 'GREEN', 'YELLOW', 'RED'
    recommendations: recordData.recommendations || [],
    synced: false,
    timestamp: new Date().toISOString(),
  };

  await db.put('triage_records', record);
  return record;
}

// Fetch triage history for a specific patient
export async function getPatientTriageHistory(patientId) {
  const db = await initDB();
  const allRecords = await db.getAllFromIndex('triage_records', 'patientId', patientId);
  return allRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Delete patient record
export async function deletePatient(id) {
  const db = await initDB();
  await db.delete('patients', id);
}
