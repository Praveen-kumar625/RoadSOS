/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import express from 'express';
import { createServer } from 'http';
import helmet from 'helmet';
import cors from 'cors';
import { loadHardenedConfig, setGlobalEnv } from './config/env.js';
import { IngestionRouter } from './api/routes/ingestion.routes.js';
import { persistenceService } from './services/persistence-service.js';
import { UDPIngestionGateway } from './ingestion/udp-gateway.js';

/**
 * PRODUCTION-GRADE API GATEWAY (OPTIMIZED)
 */
const app = express();
const server = createServer(app);

// Perimeter Defense
app.use(helmet());

/**
 * CRITICAL BOOT SEQUENCE: VAULT, HYDRATION & GATEWAYS
 */
const startServer = async () => {
  try {
    // 1. Secure Secret Synchronization (HashiCorp Vault)
    const hardenedEnv = await loadHardenedConfig();
    setGlobalEnv(hardenedEnv);
    console.log('📡 [Boot] Vault Identity Verified. Secrets Synced.');

    // 2. Middleware Config (Delayed for Env injection)
    app.use(cors({ origin: hardenedEnv.NODE_ENV === 'production' ? /\.roadsos\.in$/ : '*' }));
    app.use(express.json({ limit: '10kb' }));
    app.use('/api/v1/ingestion', IngestionRouter);
    app.get('/health', (req, res) => res.json({ status: 'UP', vault: 'CONNECTED' }));

    // 3. Recover active incident state from distributed event log
    const initialState = await persistenceService.hydrateState();
    console.log(`📡 [Boot] Recovery Complete. System tracking ${Object.keys(initialState).length} active emergencies.`);

    // 4. Initialize MQTT-SN UDP Gateway (Option 2)
    const udpGateway = new UDPIngestionGateway(1884);
    udpGateway.start();

    // 5. Start HTTP Listeners
    const PORT = hardenedEnv.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🛡️ RoadSoS V2 Architecture Online [Port ${PORT}]`);
      console.log(`🚀 Mode: ${hardenedEnv.NODE_ENV} | UDP-Gateway: 1884 (MQTT-SN)`);
    });
  } catch (err) {
    console.error('🚨 [Boot] Critical initialization failure:', err.message);
    process.exit(1);
  }
};

startServer();
