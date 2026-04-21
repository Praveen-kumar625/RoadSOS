/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { getEmergencyServicesFromPublicAPI } from '../routing/spatial-indexer.js';

export class DispatchService {
  constructor(io) {
    this.io = io;
    this.maxRetries = 3;
  }

  async processSOS(crashData, analysis) {
    const alertId = `SOS-${Date.now()}`;
    console.log(`[DISPATCH] [${alertId}] Initiating Lifecycle: CREATED`);
    
    let alertState = {
      id: alertId,
      status: 'CREATED',
      timestamp: Date.now(),
      retryCount: 0
    };

    this.updateStatus(alertState);

    try {
      // Transition to ANALYZING (Resource Discovery)
      alertState.status = 'ANALYZING';
      this.updateStatus(alertState);

      const responders = await this.findRespondersWithRetry(crashData.location);
      
      if (!responders || responders.length === 0) {
        throw new Error('No responders found in vicinity');
      }

      // Transition to DISPATCHED
      alertState.status = 'DISPATCHED';
      alertState.responder = responders[0];
      alertState.eta = Math.floor(Math.random() * 15) + 5; // Simulated ETA
      this.updateStatus(alertState);

      console.log(`[DISPATCH] [${alertId}] Successfully dispatched to ${responders[0].name}`);

    } catch (error) {
      console.error(`[DISPATCH] [${alertId}] FATAL FAILURE:`, error.message);
      alertState.status = 'FAILED';
      alertState.lastError = error.message;
      this.updateStatus(alertState);
    }
  }

  async findRespondersWithRetry(location, attempt = 1) {
    try {
      console.log(`[DISPATCH] Finding responders (Attempt ${attempt}/${this.maxRetries})...`);
      const results = await getEmergencyServicesFromPublicAPI(location.lat, location.lon);
      
      if (results.length === 0 && attempt < this.maxRetries) {
        throw new Error('OSM Query returned zero results');
      }
      
      return results;
    } catch (err) {
      if (attempt < this.maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.findRespondersWithRetry(location, attempt + 1);
      }
      throw err;
    }
  }

  updateStatus(state) {
    // Audit Logging
    console.log(`[STATE_CHANGE] [${state.id}] -> ${state.status}`);
    // Real-time Update to Dashboard
    this.io.emit('emergency_alert_update', state);
  }
}
