/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import dgram from 'node:dgram';
import { PayloadSerializer } from '../communication/payload-serializer.js';
import { HybridLogicalClock } from '../../../../libs/core-utils/src/hlc.js';
import { PersistentStorage } from '../storage/nvs.js';

export class RobustUplink {
  constructor(hardwareId, gatewayHost, gatewayPort = 1884) {
    this.hardwareId = hardwareId;
    this.gatewayHost = gatewayHost;
    this.gatewayPort = gatewayPort;
    this.client = dgram.createSocket('udp4');
    
    this.clock = new HybridLogicalClock(hardwareId);
    this.storage = new PersistentStorage(process.cwd());
    this.queue = [];
  }

  async init() {
    this.queue = await this.storage.loadQueue();
    console.log(`📡 [Edge-Uplink] UDP Client Ready. Target: ${this.gatewayHost}:${this.gatewayPort}`);
  }

  async enqueueEvent(telemetry, location) {
    const event = {
      hardware_id: this.hardwareId,
      hlc_timestamp: this.clock.now(),
      telemetry,
      location,
      timestamp: Date.now(),
      vehicle_class: 'M1' // Default for prototype
    };
    this.queue.push(event);
    await this.storage.saveQueue(this.queue);
    this.processQueue();
  }

  async processQueue() {
    if (this.queue.length === 0) return;
    
    const event = this.queue[0];
    const binary = PayloadSerializer.serialize(event);

    this.client.send(binary, this.gatewayPort, this.gatewayHost, async (err) => {
      if (err) {
        console.error('🚨 [Edge-Uplink] UDP Send Failure:', err.message);
        // Exponential backoff or retry logic would go here
        return;
      }
      
      console.log(`🚀 [Edge-Uplink] MQTT-SN SOS Packet Sent (${binary.length} bytes)`);
      this.queue.shift();
      await this.storage.saveQueue(this.queue);
      setImmediate(() => this.processQueue());
    });
  }
}
