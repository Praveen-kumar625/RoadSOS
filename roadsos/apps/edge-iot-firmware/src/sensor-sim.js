/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import axios from 'axios';

class Esp32Simulator {
  constructor() {
    this.offlineBuffer = [];
    this.endpoint = 'http://localhost:5000/api/v1/ingestion/crash';
  }

  generateTelemetry(isCrash) {
    if (isCrash) {
      return { accelerometer: { x: 14.5, y: -22.1, z: 10.5 }, speed_kmh: 0, vibration_hz: 900 };
    }
    return { accelerometer: { x: (Math.random()*0.5), y: (Math.random()*0.5), z: 9.8 }, speed_kmh: 50 + Math.random() * 20, vibration_hz: 50 };
  }

  async send(isCrash) {
    const payload = {
      telemetry: this.generateTelemetry(isCrash),
      location: { lat: 12.9915, lon: 80.2337 },
      timestamp: Date.now()
    };

    console.log("[Edge] Sending " + (isCrash ? "CRASH" : "NOMINAL") + " telemetry...");
    try {
      await axios.post(this.endpoint, payload, { timeout: 2000 });
      if (this.offlineBuffer.length > 0) {
        console.log("[Edge] Network restored. Flushing " + this.offlineBuffer.length + " buffered events.");
        this.offlineBuffer = [];
      }
    } catch (err) {
      console.error("[Edge] Network offline. Buffering data. (Buffer size: " + (this.offlineBuffer.length + 1) + ")");
      this.offlineBuffer.push(payload);
    }
  }

  run() {
    console.log('--- Aegis-Core Edge IoT Initialized ---');
    setInterval(() => this.send(false), 2000);
    
    if (process.argv.includes('--crash')) {
      setTimeout(() => {
        console.log('\n!!! FORCED CRASH DETECTED !!!\n');
        this.send(true);
      }, 5000);
    }
  }
}

new Esp32Simulator().run();
