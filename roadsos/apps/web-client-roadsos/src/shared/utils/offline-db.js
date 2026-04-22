/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { openDB } from 'idb';

const DB_NAME = 'RoadSoS_Offline_Core';
const STORE_NAME = 'pending_sos';

/**
 * INITIALIZE INDEXED_DB FOR OFFLINE PERSISTENCE
 */
export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

/**
 * QUEUE SOS REQUEST WHEN OFFLINE
 */
export const queueOfflineSOS = async (sosData) => {
  const db = await initDB();
  const entry = {
    ...sosData,
    timestamp: Date.now(),
    status: 'QUEUED_OFFLINE'
  };
  
  await db.add(STORE_NAME, entry);
  console.log("[Offline-DB] SOS stored locally. Background sync pending.");

  // TRIGGER BACKGROUND SYNC IF SERVICE WORKER SUPPORTED
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-sos-events');
    } catch (e) {
      console.warn("[Offline-DB] Background Sync Registration Failed, will retry on next load.");
    }
  }
};

/**
 * RETRIEVE ALL PENDING SOS EVENTS
 */
export const getPendingSOS = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

/**
 * CLEAR PROCESSED ENTRIES
 */
export const clearSOS = async (id) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};
