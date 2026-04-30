/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * Protocol: Ralph Loop (Greenfield Optimized)
 */

import Redis from 'ioredis';
import { ENV } from '../config/env.secure.js';

/**
 * PRODUCTION REDIS STATE ORCHESTRATOR
 * Features:
 * 1. Distributed Locking & Idempotency
 * 2. Real-time Pub/Sub for React/Next.js updates
 * 3. Atomic State Persistence
 */
export class CacheV2Service {
  constructor() {
    this.client = new Redis(ENV.REDIS_URL);
    this.pub = new Redis(ENV.REDIS_URL);
    this.sub = new Redis(ENV.REDIS_URL);
  }

  /**
   * Guard against duplicate SOS flushes from IoT devices.
   * Uses SET NX (Not Exists) with a 24h TTL.
   */
  async checkIdempotency(hardwareId, eventHash) {
    const key = `v2:idempotency:${hardwareId}:${eventHash}`;
    const result = await this.client.set(key, '1', 'NX', 'EX', 86400);
    return result === 'OK'; // OK means it's the first time we see this
  }

  /**
   * Updates incident state and broadcasts to all active dashboard subscribers.
   */
  async commitStateUpdate(incidentId, state) {
    const key = `v2:incident:${incidentId}:state`;
    
    // Multi-op: Atomic update and publish
    const pipeline = this.client.pipeline();
    pipeline.set(key, JSON.stringify(state), 'EX', 3600); // 1h cache
    pipeline.publish('v2_dispatch_updates', JSON.stringify({ incidentId, state }));
    
    await pipeline.exec();
  }

  async getIncident(incidentId) {
    const data = await this.client.get(`v2:incident:${incidentId}:state`);
    return data ? JSON.parse(data) : null;
  }
}

export const cacheV2 = new CacheV2Service();
