/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { Worker } from 'bullmq';
import axios from 'axios';
import { ENV } from '../config/env.js';
import { persistenceService } from '../services/persistence-service.js';
import { OptimizedDispatchService } from '../services/dispatch-service.js';

/**
 * PRODUCTION-GRADE CRASH TRIAGE WORKER
 */
export class CrashTriageWorker {
  constructor(io) {
    this.connection = {
      host: new URL(ENV.REDIS_URL).hostname,
      port: parseInt(new URL(ENV.REDIS_URL).port || '6379', 10),
      password: new URL(ENV.REDIS_URL).password || undefined,
      tls: ENV.REDIS_URL.startsWith('rediss') ? {} : undefined
    };

    this.dispatchService = new OptimizedDispatchService(io);
    this.aiServiceUrl = process.env.AI_TRIAGE_URL || 'http://localhost:8000/predict';

    this.worker = new Worker('crash_processing', async (job) => {
      return await this.handleJob(job.data);
    }, { 
      connection: this.connection,
      concurrency: 5
    });

    console.log('👷 [Worker] Crash Triage Processor Online');
  }

  async handleJob(payload) {
    const { incidentId, telemetry, location, timestamp, vehicle_class } = payload;
    
    try {
      const vehicleMap = { 'L3': 0, 'L5': 0, 'M1': 1, 'N1': 2 };
      const impact_g = telemetry.resultant_a || 0;
      
      // 1. Execute AI Triage (Random Forest)
      let triageResult;
      try {
        const response = await axios.post(this.aiServiceUrl, {
          speed_kmh: telemetry.speed_kmh || 0,
          impact_g: impact_g,
          vehicle_type: vehicleMap[vehicle_class] || 1,
          hour_of_day: new Date(timestamp).getHours()
        }, { timeout: 3000 });
        triageResult = response.data;
      } catch (aiErr) {
        // Tier-1 Heuristic Fallback
        triageResult = { triage_level: impact_g > 20 ? 'CRITICAL' : 'MODERATE' };
      }

      const crashContext = {
        id: incidentId,
        location,
        analysis: {
          severity: triageResult.triage_level,
          requiresIcu: triageResult.triage_level === 'CRITICAL'
        }
      };

      // 2. Perform Spatial Routing (PostGIS)
      const dispatchResult = await this.dispatchService.processEmergency(crashContext);

      // 3. Durable Snapshot (Redis Hash)
      // Finalize the state machine in distributed memory
      await persistenceService.snapshotIncident(incidentId, {
        ...crashContext,
        ...triageResult,
        ...dispatchResult,
        processed_at: Date.now(),
        status: 'DISPATCHED'
      });

      return triageResult;
    } catch (error) {
      console.error(`🚨 [Worker] Failure:`, error.message);
      throw error;
    }
  }
}
