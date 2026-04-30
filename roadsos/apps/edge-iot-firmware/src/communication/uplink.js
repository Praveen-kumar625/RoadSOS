/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import axios from 'axios';
import { PayloadSerializer } from '../communication/payload-serializer.js';
import { HybridLogicalClock } from '../../../../libs/core-utils/src/hlc.js';
import { PersistentStorage } from '../storage/nvs.js';

export class RobustUplink {
  constructor(hardwareId, gatewayUrl) {
    this.hardwareId = hardwareId;
    this.endpoint = `${gatewayUrl}/api/v1/ingestion/crash`;
    this.clock = new HybridLogicalClock(hardwareId);
    this.storage = new PersistentStorage(process.cwd());
    this.queue = [];
    this.isTransmitting = false;
  }

  async init() {
    this.queue = await this.storage.loadQueue();
  }

  async enqueueEvent(telemetry, location) {
    const event = {
      hardware_id: this.hardwareId,
      hlc_timestamp: this.clock.now(),
      telemetry,
      location,
      timestamp: Date.now()
    };
    this.queue.push(event);
    await this.storage.saveQueue(this.queue);
    this.processQueue();
  }

  async processQueue() {
    if (this.queue.length === 0 || this.isTransmitting) return;
    this.isTransmitting = true;
    const event = this.queue[0];
    try {
      const binary = PayloadSerializer.serialize(event);
      await axios.post(this.endpoint, binary, {
        headers: { 'Content-Type': 'application/x-msgpack' },
        timeout: 5000
      });
      this.queue.shift();
      await this.storage.saveQueue(this.queue);
    } catch (err) {
      setTimeout(() => { this.isTransmitting = false; this.processQueue(); }, 5000);
      return;
    }
    this.isTransmitting = false;
    setImmediate(() => this.processQueue());
  }
}
