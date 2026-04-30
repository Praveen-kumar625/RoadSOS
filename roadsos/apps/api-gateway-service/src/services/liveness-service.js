/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import Redis from 'ioredis';
import { ENV } from '../config/env.js';
import { getSpatialCell } from '../../../../libs/core-utils/src/spatial.js';

/**
 * PRODUCTION LIVENESS ENGINE (UBER H3 + REDIS)
 * Tracks real-time responder availability across the city.
 */
export class LivenessService {
  constructor() {
    this.client = new Redis(ENV.REDIS_URL);
    this.TTL_SECONDS = 300; // 5 min heartbeat TTL
    this.CELL_PREFIX = 'v2:liveness:cell';
  }

  /**
   * PROCESS RESPONDER HEARTBEAT
   * Maps responder to an H3 cell for O(1) liveness lookups.
   */
  async handleHeartbeat(responderId, lat, lon) {
    const cellId = getSpatialCell(lat, lon);
    const key = `${this.CELL_PREFIX}:${cellId}`;
    
    // Store in a Redis Set for the cell, with a global TTL
    const pipeline = this.client.pipeline();
    pipeline.sadd(key, responderId);
    pipeline.expire(key, this.TTL_SECONDS);
    
    // Also track responder's current location/status
    pipeline.set(`v2:responder:${responderId}:pos`, JSON.stringify({ lat, lon, cellId, ts: Date.now() }), 'EX', this.TTL_SECONDS);
    
    await pipeline.exec();
    console.log(`📡 [Liveness] Heartbeat from ${responderId} in cell ${cellId}`);
  }

  /**
   * VERIFY LIVENESS (H3 Cell Expansion)
   * Checks if a responder is active in its last known cell.
   */
  async isResponderActive(responderId) {
    const exists = await this.client.exists(`v2:responder:${responderId}:pos`);
    return exists === 1;
  }

  /**
   * GET ACTIVE RESPONDERS IN CELLS
   * Batch check liveness for multiple cells.
   */
  async getActiveRespondersInCells(cellIds) {
    const keys = cellIds.map(id => `${this.CELL_PREFIX}:${id}`);
    const activeSets = await this.client.sunion(...keys);
    return activeSets || [];
  }
}

export const livenessService = new LivenessService();
