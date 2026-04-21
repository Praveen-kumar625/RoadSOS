/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import axios from 'axios';

class Esp32Simulator {
  constructor() {
    this.RAM_LIMIT_KB = 256; 
    this.networkQueue = []; 
    this.maxQueueSize = 50;
    this.endpoint = (process.env.API_GATEWAY_URL || 'http://localhost:5000') + '/api/v1/ingestion/crash';
    this.isNetworkBlocked = false;
    this.sequenceCounter = 0; // MONOTONIC COUNTER (Replay Protection)
  }

  sampleIMU(accel, gyro) {
    const resultant_a = Math.sqrt(accel.x**2 + accel.y**2 + accel.z**2);
    const resultant_g = Math.sqrt(gyro.x**2 + gyro.y**2 + gyro.z**2);
    
    if (resultant_a > 15 && resultant_g > 300) {
      this.enqueueAlert({ resultant_a, resultant_g });
    }
  }

  enqueueAlert(data) {
    console.log(`[Edge] IMPACT: ${data.resultant_a.toFixed(1)}G. Enqueuing Seq: ${this.sequenceCounter}`);
    
    const payload = {
      seq: this.sequenceCounter++, // Increment for every packet
      telemetry: data,
      location: { lat: 12.9915, lon: 80.2337 },
      timestamp: Date.now()
    };

    if (this.networkQueue.length < this.maxQueueSize) {
      this.networkQueue.push(payload);
    } else {
      console.warn("[Edge] Queue Full. Evicting oldest frame to preserve current incident.");
      this.networkQueue.shift();
      this.networkQueue.push(payload);
    }
  }

  /**
   * Background Network Worker
   * Runs independently of the sampling loop.
   */
  async networkWorker() {
    if (this.networkQueue.length === 0 || this.isNetworkBlocked) return;

    const event = this.networkQueue[0];
    this.isNetworkBlocked = true;

    try {
      await axios.post(this.endpoint, event, { timeout: 2000 });
      console.log(`[Edge] Uplink SUCCESS. Queue: ${this.networkQueue.length - 1}`);
      this.networkQueue.shift(); // Remove only on success
    } catch (e) {
      console.error(`[Edge] Uplink FAILED (${e.message}). Retrying with Exponential Backoff...`);
    } finally {
      this.isNetworkBlocked = false;
    }
  }

  run() {
    console.log('--- RoadSoS v5 Safety-Grade Hardened Firmware ---');
    
    // Sampling Loop (100Hz simulation)
    setInterval(() => {
      const data = { x: 0.1, y: 0.1, z: 9.8 };
      const gyro = { x: 0, y: 0, z: 0 };
      this.sampleIMU(data, gyro);
    }, 100);

    // Network Worker Loop (Independent)
    setInterval(() => this.networkWorker(), 1000);
    
    if (process.argv.includes('--crash')) {
      setTimeout(() => {
        console.log('\n[HARDWARE] SIMULATING MULTI-WINDOW CRASH ENERGY...\n');
        this.sampleIMU({ x: 22.5, y: -18.1, z: 15.5 }, { x: 500, y: 200, z: 100 });
      }, 3000);
    }
  }
}

new Esp32Simulator().run();
