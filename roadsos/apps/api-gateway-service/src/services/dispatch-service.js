/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * Protocol: Ralph Loop (Greenfield Optimized)
 */

import { createClient } from '@supabase/supabase-js';
import { ENV } from '../../config/env.js';
import { livenessService } from './liveness-service.js';
import { getSpatialCell, getNeighboringCells } from '../../../../libs/core-utils/src/spatial.js';

/**
 * HYPER-OPTIMIZED DISPATCH ORCHESTRATOR (H3 HARDENED)
 * Combines PostGIS (Discovery) with H3/Redis (Liveness).
 */
export class OptimizedDispatchService {
  constructor(io) {
    this.io = io;
    this.supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY);
  }

  /**
   * Core Dispatch Logic (PostGIS + H3)
   */
  async processEmergency(crashData) {
    const { lat, lon } = crashData.location;
    const { severity, requiresIcu = false } = crashData.analysis;

    console.log(`🚨 [Dispatch] Processing ${severity} Incident at ${lat}, ${lon}`);

    try {
      // Step 1: Broad Discovery via PostGIS (O(log N))
      const { data: potentialResponders, error } = await this.supabase.rpc('get_nearby_responders_v2', {
        target_lat: lat,
        target_lon: lon,
        radius_meters: 10000,
        min_icu: requiresIcu
      });

      if (error) throw error;

      // Step 2: Liveness Verification via H3/Redis
      // We short-circuit if the responder hasn't heartbeated recently.
      const activeResponders = [];
      for (const responder of (potentialResponders || [])) {
        const isActive = await livenessService.isResponderActive(responder.id);
        if (isActive) {
          activeResponders.push(responder);
        }
      }

      if (activeResponders.length === 0) {
        return this.escalateToHuman(crashData, "NO_ACTIVE_RESPONDERS_FOUND");
      }

      // Step 3: Select the optimal responder (Closest Active)
      const primaryResponder = activeResponders[0];

      // Step 4: Atomic State Handover
      const dispatchState = {
        incidentId: crashData.id,
        status: 'DISPATCHED',
        responder: primaryResponder,
        eta_minutes: Math.ceil(primaryResponder.dist_meters / 450),
        spatial_engine: 'Hybrid_PostGIS_H3'
      };

      // Step 5: Broadcast to Stakeholders
      this.io.to(`incident_${crashData.id}`).emit('responder_assigned', dispatchState);
      
      console.log(`✅ [Dispatch] Assigned Liveness-Verified ${primaryResponder.name} (ETA: ${dispatchState.eta_minutes}m)`);
      return dispatchState;

    } catch (err) {
      console.error("❌ [Dispatch] Spatial Query Failure:", err.message);
      return this.escalateToHuman(crashData, "DATABASE_ERROR");
    }
  }

  escalateToHuman(incident, reason) {
    console.warn(`⚠️ [Escalation] Manual intervention required for ${incident.id}: ${reason}`);
    this.io.emit('manual_intervention_required', { incident, reason });
  }
}
