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
import { AegisCoreAI } from '@roadsos/ai-local-models';
import { DispatchService } from './services/dispatch-service.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

// Unified AI Instance (Library Powered)
const aegisAI = new AegisCoreAI(process.env.HF_TOKEN);
const dispatcher = new DispatchService(io);

app.use(helmet());
app.use(cors());
app.use(express.json());

/**
 * OBSERVABILITY MIDDLEWARE
 * Logs every request and system health metrics
 */
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    io.emit('system_health', { 
      uptime: process.uptime(),
      memory: process.memoryUsage().rss,
      lastLatency: duration
    });
  });
  next();
});

/**
 * PRODUCTION-GRADE SOS PIPELINE
 */
app.post('/api/v1/ingestion/crash', async (req, res) => {
  const { telemetry, location, timestamp } = req.body;
  if (!telemetry || !location) return res.status(400).json({ error: 'INVALID_SCHEMA' });

  io.emit('live_telemetry', { telemetry, location, timestamp });

  try {
    const analysis = await aegisAI.analyze(telemetry);
    io.emit('ai_analysis', analysis);

    if (analysis.isCrash && analysis.severity === 'CRITICAL') {
      dispatcher.processSOS({ telemetry, location, timestamp }, analysis);
      return res.status(202).json({ status: 'PROCESSING', analysis });
    }
    
    res.status(200).json({ status: 'NOMINAL', analysis });
  } catch (err) {
    res.status(500).json({ error: 'PIPELINE_ERROR' });
  }
});

/**
 * JUDGE'S ONE-CLICK SIMULATOR
 */
app.post('/api/v1/simulation/trigger-demo', async (req, res) => {
  const demoData = {
    telemetry: { accelerometer: { x: 18.2, y: -5.1, z: 2.5 }, speed_kmh: 92, vibration_hz: 850 },
    location: { lat: 12.9915, lon: 80.2337 },
    timestamp: Date.now()
  };
  
  const analysis = await aegisAI.analyze(demoData.telemetry);
  io.emit('live_telemetry', demoData);
  io.emit('ai_analysis', analysis);
  dispatcher.processSOS(demoData, analysis);
  
  res.status(200).json({ status: 'DEMO_RUNNING' });
});

const PORT = 5000;
httpServer.listen(PORT, () => console.log('🛡️ Aegis-Core Gateway Solidified on Port ' + PORT));
