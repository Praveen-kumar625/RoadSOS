/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { RobustUplink } from './communication/uplink.js';

class RoadSoSFirmware {
  constructor() {
    this.uplink = new RobustUplink(
      'ROAD-X-001', 
      process.env.GATEWAY_UDP_HOST || 'localhost',
      parseInt(process.env.GATEWAY_UDP_PORT || '1884', 10)
    );
  }

  async bootstrap() {
    console.log('--- 🛡️ RoadSoS Firmware (Production: MQTT-SN) ---');
    await this.uplink.init();
    setInterval(() => this.sampleSensors(), 100);
  }

  sampleSensors() {
    const accel = { x: 0.1, y: 0.1, z: 9.8 };
    const resultant_a = Math.sqrt(accel.x**2 + accel.y**2 + accel.z**2);
    if (resultant_a > 15) {
      this.uplink.enqueueEvent({ resultant_a, type: 'IMPACT' }, { lat: 12.9915, lon: 80.2337 });
    }
  }
}

new RoadSoSFirmware().bootstrap();
