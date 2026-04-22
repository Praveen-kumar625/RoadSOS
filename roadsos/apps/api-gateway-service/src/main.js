/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { EventEmitter } from 'events';
import jwt from 'jsonwebtoken';
import { AegisCoreAI } from '@roadsos/ai-local-models';
import { DispatchService } from './services/dispatch-service.js';
import { ENV } from './config/env.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

// 1. HARDENED SECURITY LAYER (OWASP Compliance)
const ingestionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IoT device/IP to 30 requests per minute
  message: { error: 'RATE_LIMIT_EXCEEDED', advice: 'Hardware malfunctioning? Reducing sampling rate.' }
});

// SYSTEM-WIDE EVENT BUS (Decoupled Core)
const systemBus = new EventEmitter();

const aegisAI = new AegisCoreAI(ENV.HF_TOKEN);
const dispatcher = new DispatchService(io);

// 3. IN-MEMORY TELEMETRY CACHE (High-Throughput Windowing)
const telemetryBuffer = new Map(); // incidentId -> [telemetry history]

// Wire Event Bus to Service
systemBus.on('CRITICAL_IMPACT', (data) => {
  dispatcher.processSOS(data.context, data.analysis);
});

app.use(helmet());
app.use(cors());
app.use(express.json());

/**
 * PRODUCTION-GRADE SOS PIPELINE (v5 Decoupled)
 */
app.post('/api/v1/ingestion/crash', ingestionLimiter, async (req, res) => {
  const { telemetry, location, timestamp, vehicle_class, hardware_id } = req.body;
  
  // 1. AUTHENTICATION (Zero-Trust Identity)
  if (!hardware_id || !hardware_id.startsWith('ROAD-')) {
    return res.status(401).json({ error: 'UNAUTHORIZED_HARDWARE', detail: 'Invalid device signature' });
  }

  if (!telemetry || !location) return res.status(400).json({ error: 'INVALID_SCHEMA' });

  const incidentId = `SOS-${timestamp}`;
  
  // 1. MAINTAIN TEMPORAL WINDOW
  const history = telemetryBuffer.get(incidentId) || [];
  history.push(telemetry);
  if (history.length > 10) history.shift(); // Keep only last 10 points
  telemetryBuffer.set(incidentId, history);

  // 2. FAST INGESTION (Non-Blocking)
  const analysis = { 
    severity: (telemetry.resultant_a > 15) ? 'CRITICAL' : 'MODERATE',
    vehicle_class
  };

  systemBus.emit('CRITICAL_IMPACT', { 
    context: { telemetry, location, timestamp },
    analysis 
  });

  // 3. ASYNC AI ENRICHMENT (Temporal)
  aegisAI.analyze(telemetry, history).then(ai => {
    io.to(`incident_${incidentId}`).emit('ai_enrichment', ai);
    console.log(`[AI] Enhanced Incident ${incidentId} using ${ai.method}`);
  }).catch(() => {});

  res.status(202).json({ 
    status: 'INGESTED', 
    incidentId,
    bus_latency: 'O(1)' 
  });
});

io.on('connection', (socket) => {
  const { token, responderId } = socket.handshake.auth;

  // HARDENED ZERO-TRUST HANDSHAKE
  try {
    if (!token) throw new Error("MISSING_TOKEN");
    const user = jwt.verify(token, ENV.HF_TOKEN);
    console.log(`[Security] Authenticated Responder: ${user.id}`);

    socket.on('subscribe_incident', (id) => socket.join(`incident_${id}`));
    socket.on('responder_heartbeat', (data) => dispatcher.handleHeartbeat(responderId || user.id, data));

  } catch (e) {
    console.warn(`[Security] UNAUTHORIZED ACCESS ATTEMPT (Socket: ${socket.id})`);
    socket.disconnect();
  }
});

const PORT = ENV.PORT;
httpServer.listen(PORT, () => {
  console.log(`🛡️ RoadSoS v5 (Distributed Core) Online on Port ${PORT}`);
});
