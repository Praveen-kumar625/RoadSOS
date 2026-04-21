/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { getEmergencyServicesFromPublicAPI } from '../routing/spatial-indexer.js';
import { IntelligenceService } from './intelligence-service.js';

export class DispatchService {
  constructor(io) {
    this.io = io;
    this.activeEmergencies = new Map();
  }

  async processSOS(crashData, analysis) {
    const alertId = `SOS-${Date.now()}`;
    const trafficFactor = Math.random(); // Simulated live traffic factor
    
    let alertState = {
      id: alertId,
      status: 'ANALYZING',
      location: crashData.location,
      analysis: analysis,
      responders: [],
      timestamp: Date.now()
    };

    this.activeEmergencies.set(alertId, alertState);
    this.updateStatus(alertState);

    try {
      // 1. Fetch ALL mandated responders (Police + Ambulance + Repair)
      const allResponders = await getEmergencyServicesFromPublicAPI(
        crashData.location.lat, 
        crashData.location.lon
      );

      // 2. Multi-Agent Coordination Logic
      // We don't just pick one; we pick the BEST for each required category
      const categories = ['hospital', 'police', 'towing', 'puncture'];
      const coordinatedTeam = [];

      categories.forEach(cat => {
        const available = allResponders.filter(r => r.category === cat);
        if (available.length > 0) {
          // Score each and pick the best
          const scored = available.map(r => {
            const dist = 1000; // Mock distance for hackathon
            const intel = IntelligenceService.calculatePriority(analysis, dist, trafficFactor);
            return { ...r, ...intel };
          }).sort((a, b) => b.score - a.score);

          coordinatedTeam.push(scored[0]);
        }
      });

      // 3. Update State to DISPATCHED
      alertState.status = 'DISPATCHED';
      alertState.responders = coordinatedTeam;
      alertState.priorityScore = coordinatedTeam[0]?.score || 50;
      alertState.explanation = coordinatedTeam[0]?.reasoning || "Standard dispatch protocols active.";
      
      this.updateStatus(alertState);
      console.log(`[ORCHESTRATOR] [${alertId}] Multi-Agent Team Dispatched.`);

    } catch (error) {
      alertState.status = 'FAILED';
      alertState.lastError = error.message;
      this.updateStatus(alertState);
    }
  }

  updateStatus(state) {
    this.io.emit('emergency_orchestration_update', state);
  }
}
