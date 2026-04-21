/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { analyzeCrashWithOpenLLM } from './ingestion/crash-event-ingestion.js';
import { DispatchService } from './services/dispatch-service.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

// Business Logic Orchestrator
const dispatcher = new DispatchService(io);

// OWASP Security Hardening
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Rate Limiting to prevent abuse
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

io.on('connection', (socket) => {
  console.log('[Socket] Client connected: ' + socket.id);
});

/**
 * PRODUCTION-GRADE INGESTION ENDPOINT
 * Shifted from "Direct Call" to "Event Orchestration"
 */
app.post('/api/v1/ingestion/crash', async (req, res) => {
  const { telemetry, location, timestamp } = req.body;
  
  // 1. Structural Validation
  if (!telemetry || !location) {
    return res.status(400).json({ error: 'Schema Validation Failed: Missing telemetry/location' });
  }

  // 2. Immediate Feedback to Dashboard
  io.emit('live_telemetry', { telemetry, location, timestamp });

  try {
    // 3. AI Severity Prediction (Aegis-Core)
    const analysis = await analyzeCrashWithOpenLLM(telemetry);
    io.emit('ai_analysis', analysis);

    // 4. Trigger the Resilient Dispatch Lifecycle
    if (analysis.isCrash && analysis.severity === 'CRITICAL') {
      // Non-blocking background process to handle retries and state changes
      dispatcher.processSOS({ telemetry, location, timestamp }, analysis);
      
      return res.status(202).json({ 
        message: 'SOS_ACCEPTED', 
        analysis,
        tracking_id: 'SOS-' + Date.now() 
      });
    }
    
    res.status(200).json({ status: 'NOMINAL', analysis });
  } catch (err) {
    console.error('[GATEWAY_FATAL]', err);
    res.status(500).json({ error: 'Emergency processing engine failure' });
  }
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log('🚀 [RoadSoS Gateway] Production-ready on port ' + PORT));
