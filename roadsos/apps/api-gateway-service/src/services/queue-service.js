/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * Protocol: Ralph Loop (Greenfield Optimized)
 */

import { Queue } from 'bullmq';
import { ENV } from '../config/env.secure.js';

/**
 * DISTRIBUTED TASK ORCHESTRATOR
 * Decouples Ingestion (HTTP) from Processing (AI/DB).
 * Uses Upstash Redis for persistence.
 */
export class QueueV2Service {
  constructor() {
    this.connection = {
      host: new URL(ENV.REDIS_URL).hostname,
      port: parseInt(new URL(ENV.REDIS_URL).port || '6379', 10),
      password: new URL(ENV.REDIS_URL).password || undefined,
      tls: ENV.REDIS_URL.startsWith('rediss') ? {} : undefined
    };

    this.crashQueue = new Queue('v2_crash_processing', { 
      connection: this.connection,
      defaultJobOptions: {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true
      }
    });
    
    console.log('📦 [Queue] BullMQ V2 Ingestion Engine Online');
  }

  /**
   * Enqueues incident for background processing.
   * Completes in < 5ms locally.
   */
  async dispatchToWorker(payload) {
    const job = await this.crashQueue.add('analyze_and_dispatch', payload);
    return job.id;
  }
}

export const queueV2 = new QueueV2Service();
