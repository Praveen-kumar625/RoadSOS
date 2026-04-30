/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import express from 'express';
import { createServer } from 'http';
import helmet from 'helmet';
import cors from 'cors';
import { ENV } from './config/env.js';
import { IngestionRouter } from './api/routes/ingestion.routes.js';

/**
 * PRODUCTION-GRADE API GATEWAY (OPTIMIZED)
 */
const app = express();
const server = createServer(app);

// Perimeter Defense
app.use(helmet());
app.use(cors({ origin: ENV.NODE_ENV === 'production' ? /\.roadsos\.in$/ : '*' }));

// High-Throughput Body Parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.raw({ type: 'application/x-msgpack', limit: '5kb' }));

// Optimized Routing
app.use('/api/v1/ingestion', IngestionRouter);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'UP', version: '2.0.0-optimized' }));

const PORT = ENV.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🛡️ RoadSoS V2 Architecture Online [Port ${PORT}]`);
  console.log(`🚀 Mode: ${ENV.NODE_ENV} | Engine: Node.js 20`);
});
