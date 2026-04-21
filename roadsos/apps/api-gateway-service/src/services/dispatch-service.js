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
    this.duplicateWindowMs = 300000; // 5 minutes window
    this.duplicateRadiusMeters = 100; // 100m radius
  }

  /**
   * Checks if an incoming report is a duplicate of an existing active emergency
   */
  isDuplicate(location) {
    const now = Date.now();
    for (const [id, event] of this.activeEmergencies.entries()) {
      const timeDiff = Math.abs(now - event.timestamp);
      
      // Calculate basic distance (Euclidean approx for efficiency)
      const dist = Math.sqrt(
        Math.pow(location.lat - event.location.lat, 2) + 
        Math.pow(location.lon - event.location.lon, 2)
      ) * 111000; // ~111km per degree

      if (timeDiff < this.duplicateWindowMs && dist < this.duplicateRadiusMeters) {
        return event;
      }
    }
    return null;
  }

  async processSOS(crashData, analysis) {
    // 1. DUPLICATE DETECTION (Elite Feature)
    const existingEvent = this.isDuplicate(crashData.location);
    if (existingEvent) {
      console.log(`[ORCHESTRATOR] Duplicate report detected for ${existingEvent.id}. Merging reports.`);
      this.io.emit('duplicate_report_merged', { 
        originalId: existingEvent.id, 
        newTimestamp: Date.now() 
      });
      return;
    }

    const alertId = `SOS-${Date.now()}`;
    const trafficFactor = Math.random(); 
    
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
      // 2. RESOURCE DISCOVERY
      const allResponders = await getEmergencyServicesFromPublicAPI(
        crashData.location.lat, 
        crashData.location.lon
      );

      // 3. MULTI-AGENT COORDINATION
      const categories = ['hospital', 'police', 'towing', 'puncture'];
      const coordinatedTeam = [];

      categories.forEach(cat => {
        const available = allResponders.filter(r => r.category === cat);
        if (available.length > 0) {
          const scored = available.map(r => {
            const dist = 1000; // Mock distance
            const intel = IntelligenceService.calculatePriority(analysis, dist, trafficFactor);
            return { ...r, ...intel };
          }).sort((a, b) => b.score - a.score);

          coordinatedTeam.push(scored[0]);
        }
      });

      alertState.status = 'DISPATCHED';
      alertState.responders = coordinatedTeam;
      alertState.priorityScore = coordinatedTeam[0]?.score || 50;
      alertState.explanation = coordinatedTeam[0]?.reasoning || "Optimized dispatch active.";
      
      this.updateStatus(alertState);
      
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
