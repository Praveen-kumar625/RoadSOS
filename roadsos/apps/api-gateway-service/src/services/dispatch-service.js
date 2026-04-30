/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * Protocol: Ralph Loop (Greenfield Optimized)
 */

import { createClient } from '@supabase/supabase-js';
import { ENV } from '../../config/env.secure.js';

/**
 * HYPER-OPTIMIZED DISPATCH ORCHESTRATOR
 * Zero application-side spatial math.
 * Delegates 100% of proximity logic to PostGIS.
 */
export class OptimizedDispatchService {
  constructor(io) {
    this.io = io;
    this.supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY);
  }

  /**
   * Core Dispatch Logic (PostGIS Powered)
   */
  async processEmergency(crashData) {
    const { lat, lon } = crashData.location;
    const { severity, requiresIcu = false } = crashData.analysis;

    console.log(`🚨 [Dispatch] Processing ${severity} Incident at ${lat}, ${lon}`);

    try {
      // Step 1: Find prioritized responders using RPC (O(log N))
      // This single DB call handles radius filter, ICU requirement, and distance sorting.
      const { data: responders, error } = await this.supabase.rpc('get_nearby_responders_v2', {
        target_lat: lat,
        target_lon: lon,
        radius_meters: 10000, // Search within 10km for high-severity
        min_icu: requiresIcu
      });

      if (error) throw error;

      if (!responders || responders.length === 0) {
        return this.escalateToHuman(crashData, "NO_RESPONDERS_IN_RADIUS");
      }

      // Step 2: Select the optimal responder (Heuristic: Closest with lowest load)
      // Since SQL already sorted by distance, we pick the first eligible one.
      const primaryResponder = responders[0];

      // Step 3: Atomic State Handover via Redis (Simulation)
      const dispatchState = {
        incidentId: crashData.id,
        status: 'DISPATCHED',
        responder: primaryResponder,
        eta_minutes: Math.ceil(primaryResponder.dist_meters / 450), // 450m/min approx speed
        spatial_engine: 'PostGIS_GiST'
      };

      // Step 4: Broadcast to Stakeholders
      this.io.to(`incident_${crashData.id}`).emit('responder_assigned', dispatchState);
      
      console.log(`✅ [Dispatch] Assigned ${primaryResponder.name} (ETA: ${dispatchState.eta_minutes}m)`);
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
