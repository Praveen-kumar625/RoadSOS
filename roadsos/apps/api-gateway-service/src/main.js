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
import { getHospitalsFromPublicAPI } from './routing/spatial-indexer.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

// OWASP Security Hardening (from Security Auditor/Hacker skills)
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Rate Limiting
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

io.on('connection', (socket) => {
  console.log('[Socket] Client connected: ' + socket.id);
});

app.post('/api/v1/ingestion/crash', async (req, res) => {
  const { telemetry, location, timestamp } = req.body;
  if (!telemetry || !location) return res.status(400).json({ error: 'Missing telemetry' });

  io.emit('live_telemetry', { telemetry, location, timestamp });

  try {
    // Open-LLM Analysis (Inspired by eugeneyan/open-llms)
    const analysis = await analyzeCrashWithOpenLLM(telemetry);
    io.emit('ai_analysis', analysis);

    if (analysis.isCrash && analysis.severity === 'CRITICAL') {
      // Public API Integration
      const hospitals = await getHospitalsFromPublicAPI(location.lat, location.lon);
      
      const alert = {
        alert_id: 'SOS-' + Date.now(),
        analysis,
        dispatched_to: hospitals[0] || { name: 'Fallback Trauma Center' },
        timestamp: new Date().toISOString()
      };
      io.emit('emergency_alert', alert);
      return res.status(200).json(alert);
    }
    
    res.status(200).json({ status: 'NOMINAL', analysis });
  } catch (err) {
    console.error('[Ingestion Error]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log('[Aegis-Core Gateway] Online on port ' + PORT));
