/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * File: apps/web-client-roadsos/public/sw.js
 */

import { getPendingSOS, clearSOS } from '../src/shared/utils/offline-db.js';

const CACHE_NAME = 'roadsos-static-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-sos-events') {
    event.waitUntil(syncSOS());
  }
});

/**
 * PUSH OFFLINE SOS EVENTS TO GATEWAY
 */
async function syncSOS() {
  const pending = await getPendingSOS();
  
  for (const sos of pending) {
    try {
      const response = await fetch('/api/v1/ingestion/crash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sos)
      });

      if (response.ok) {
        await clearSOS(sos.id);
        console.log(`[SW-Sync] Successfully synchronized Incident ID: ${sos.id}`);
      }
    } catch (error) {
      console.error("[SW-Sync] Synchronization failed for entry:", sos.id);
    }
  }
}
