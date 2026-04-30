/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * Protocol: Ralph Loop (Greenfield Optimized)
 */

import { promises as fs } from 'fs';
import path from 'path';

/**
 * SIMULATED NON-VOLATILE STORAGE (NVS)
 * In a real ESP32, this would interface with the SPIFFS or LittleFS.
 * Purpose: Ensure no data loss even if the device power cycles during an outage.
 */
export class PersistentStorage {
  constructor(storageDir) {
    this.storagePath = path.join(storageDir, 'nvs_buffer.json');
  }

  async saveQueue(queue) {
    try {
      await fs.writeFile(this.storagePath, JSON.stringify(queue), 'utf8');
    } catch (err) {
      console.error("🚨 [NVS] Write Failure:", err.message);
    }
  }

  async loadQueue() {
    try {
      const data = await fs.readFile(this.storagePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      return []; // Return empty queue if file doesn't exist
    }
  }

  async clear() {
    try {
      await fs.unlink(this.storagePath);
    } catch (err) {}
  }
}
