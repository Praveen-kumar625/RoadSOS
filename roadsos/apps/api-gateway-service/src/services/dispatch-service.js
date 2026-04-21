/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { getEmergencyServicesFromPublicAPI } from '../routing/spatial-indexer.js';
import { IntelligenceService } from './intelligence-service.js';
import { ENV } from '../config/env.js';
import { calculateDistance } from '../utils/geo-utils.js';

export class DispatchService {
  constructor(io) {
    this.io = io;
    this.STATE_FILE = join(process.cwd(), 'src/database/hot-state.json');
    this.activeEmergencies = new Map();
    this.responders = new Map(); 
    this.JWT_SECRET = ENV.HF_TOKEN;
    this.HEARTBEAT_TTL_MS = 15000;
    this.init();
  }

  async init() {
    await this.hydrate();
    setInterval(() => this.cleanupLiveness(), 10000);
  }

  cleanupLiveness() {
    const now = Date.now();
    for (const [id, data] of this.responders.entries()) {
      if (now - data.lastSeen > this.HEARTBEAT_TTL_MS * 2) {
        this.responders.delete(id);
      }
    }
  }

  async hydrate() {
    try {
      if (existsSync(this.STATE_FILE)) {
        const raw = readFileSync(this.STATE_FILE, 'utf8');
        const data = JSON.parse(raw);
        this.activeEmergencies = new Map(Object.entries(data.emergencies || {}));
      }
    } catch (e) { console.error("[Persistence] Hydration failed."); }
  }

  async persist() {
    const data = JSON.stringify({
      emergencies: Object.fromEntries(this.activeEmergencies),
      timestamp: Date.now()
    });
    return fs.writeFile(this.STATE_FILE, data).catch(e => console.error("[Persistence] IO Error"));
  }

  generateGuardianLink(incidentId) {
    const token = jwt.sign({ id: incidentId }, this.JWT_SECRET, { expiresIn: '30m' });
    return `https://roadsos.in/v/${token}`;
  }

  calculateHeuristicETA(distance) {
    return Math.ceil(distance / 400);
  }

  handleHeartbeat(responderId, metadata) {
    this.responders.set(responderId, { ...metadata, state: 'ACTIVE', lastSeen: Date.now() });
  }

  async processSOS(crashData, analysis) {
    const alertId = `SOS-${Date.now()}`;
    const alertState = {
      id: alertId,
      status: 'DISPATCHING',
      location: crashData.location,
      guardianLink: this.generateGuardianLink(alertId),
      timestamp: Date.now()
    };

    this.activeEmergencies.set(alertId, alertState);
    await this.persist();
    this.updateStatus(alertState);

    try {
      const allResponders = await getEmergencyServicesFromPublicAPI(crashData.location.lat, crashData.location.lon);
      const eligible = allResponders.filter(r => {
        const live = this.responders.get(r.id);
        return r.status === 'AVAILABLE' && (live && Date.now() - live.lastSeen < this.HEARTBEAT_TTL_MS);
      });

      const prioritized = eligible.map(r => ({
        ...r,
        ...IntelligenceService.calculatePriority(analysis, r),
        eta: this.calculateHeuristicETA(r.distance)
      })).sort((a, b) => b.score - a.score);

      if (prioritized.length === 0) throw new Error("NO_RESPONDERS");

      alertState.status = 'DISPATCHED';
      alertState.responders = prioritized.slice(0, 1);
      alertState.current_eta = prioritized[0].eta;
      
      await this.persist();
      this.updateStatus(alertState);
    } catch (e) {
      alertState.status = 'HUMAN_ESCALATION';
      await this.persist();
      this.updateStatus(alertState);
    }
  }

  updateStatus(state) {
    this.io.to(`incident_${state.id}`).emit('incident_update', state);
    this.io.emit('emergency_orchestration_update', { id: state.id, status: state.status });
  }
}
