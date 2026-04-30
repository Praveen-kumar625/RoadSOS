/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import Redis from 'ioredis';
import { ENV } from '../config/env.js';

/**
 * PRODUCTION PERSISTENCE ENGINE (REDIS STREAMS)
 * Replaces local hot-state.json for city-wide incident durability.
 */
export class PersistenceService {
  constructor() {
    this.client = new Redis(ENV.REDIS_URL);
    this.STREAM_KEY = 'v2:sos:events';
    this.STATE_PREFIX = 'v2:incident';
    
    this.client.on('error', (err) => console.error('❌ [Persistence] Redis Error:', err));
  }

  /**
   * DURABLE EVENT APPEND (XADD)
   * Ensures the SOS telemetry is persisted before HTTP response.
   */
  async appendEvent(payload) {
    const { hardware_id, timestamp, telemetry, location } = payload;
    
    try {
      const eventId = await this.client.xadd(
        this.STREAM_KEY,
        '*', // Auto-generate ID
        'hardware_id', hardware_id,
        'timestamp', timestamp,
        'telemetry', JSON.stringify(telemetry),
        'location', JSON.stringify(location),
        'type', 'CRASH_INGESTED'
      );
      
      console.log(`✅ [Persistence] Event durable in stream: ${eventId}`);
      return eventId;
    } catch (err) {
      console.error('🚨 [Persistence] Stream Append Failure:', err.message);
      throw err; // Fail-fast on ingestion
    }
  }

  /**
   * STATE HYDRATION (XREAD)
   * Reconstructs the city's active emergency state from the stream on boot.
   */
  async hydrateState() {
    console.log('🔄 [Persistence] Hydrating city state from Redis Streams...');
    
    // Read from beginning of stream
    const events = await this.client.xread('STREAMS', this.STREAM_KEY, '0-0');
    if (!events || events.length === 0) return {};

    const [streamName, data] = events[0];
    const incidents = {};

    data.forEach(([id, fields]) => {
      // Redis XREAD returns flat array [key1, val1, key2, val2...]
      const entry = {};
      for (let i = 0; i < fields.length; i += 2) {
        entry[fields[i]] = fields[i + 1];
      }

      // Reconstruct incident object
      const hardwareId = entry.hardware_id;
      incidents[hardwareId] = {
        last_event_id: id,
        timestamp: entry.timestamp,
        telemetry: JSON.parse(entry.telemetry),
        location: JSON.parse(entry.location),
        status: 'HYDRATED'
      };
    });

    console.log(`✅ [Persistence] Hydrated ${Object.keys(incidents).length} incidents.`);
    return incidents;
  }

  /**
   * Guard against duplicate SOS flushes from IoT devices.
   * Uses SET NX (Not Exists) with a 24h TTL.
   */
  async checkIdempotency(hardwareId, eventHash) {
    const key = `v2:idempotency:${hardwareId}:${eventHash}`;
    const result = await this.client.set(key, '1', 'NX', 'EX', 86400);
    return result === 'OK';
  }

  /**
   * ATOMIC INCIDENT SNAPSHOT & BROADCAST
   * Stores current state in a Redis Hash and publishes update.
   */
  async snapshotIncident(incidentId, state) {
    const key = `${this.STATE_PREFIX}:${incidentId}:state`;
    
    const pipeline = this.client.pipeline();
    pipeline.set(key, JSON.stringify(state), 'EX', 86400);
    pipeline.publish('v2_dispatch_updates', JSON.stringify({ incidentId, state }));
    
    await pipeline.exec();
  }
}

export const persistenceService = new PersistenceService();
