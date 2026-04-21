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
import { EventEmitter } from 'events';
import jwt from 'jsonwebtoken';
import { AegisCoreAI } from '@roadsos/ai-local-models';
import { DispatchService } from './services/dispatch-service.js';
import { ENV } from './config/env.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

// SYSTEM-WIDE EVENT BUS (Decoupled Core)
const systemBus = new EventEmitter();

const aegisAI = new AegisCoreAI(ENV.HF_TOKEN);
const dispatcher = new DispatchService(io);

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
app.post('/api/v1/ingestion/crash', async (req, res) => {
  const { telemetry, location, timestamp, vehicle_class } = req.body;
  if (!telemetry || !location) return res.status(400).json({ error: 'INVALID_SCHEMA' });

  // 1. FAST INGESTION (Non-Blocking)
  const analysis = { 
    severity: (telemetry.resultant_a > 15) ? 'CRITICAL' : 'MODERATE',
    vehicle_class
  };

  systemBus.emit('CRITICAL_IMPACT', { 
    context: { telemetry, location, timestamp },
    analysis 
  });

  // 2. ASYNC ENRICHMENT
  aegisAI.analyze(telemetry).then(ai => {
    io.to(`incident_SOS-${timestamp}`).emit('ai_enrichment', ai);
  }).catch(() => {});

  res.status(202).json({ 
    status: 'INGESTED', 
    incidentId: `SOS-${timestamp}`,
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
