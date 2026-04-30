/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { Router } from 'express';
import { createHash } from 'node:crypto';
import { persistenceService } from '../services/persistence-service.js';
import { queueV2 } from '../services/queue-service.js';
import { HybridLogicalClock } from '../../../../libs/core-utils/src/hlc.js';

const router = Router();
const clock = new HybridLogicalClock('gateway-01');

/**
 * IDEMPOTENT CRASH INGESTION (HARDENED)
 */
router.post('/crash', async (req, res) => {
  const { telemetry, location, timestamp, hardware_id, hlc_timestamp, vehicle_class } = req.body;

  try {
    // 1. Generate unique hash
    const eventHash = createHash('sha256')
      .update(JSON.stringify({ telemetry, location, timestamp, hardware_id }))
      .digest('hex');

    // 2. Idempotency Check
    const isUnique = await persistenceService.checkIdempotency(hardware_id, eventHash);
    if (!isUnique) {
      return res.status(200).json({ status: 'DUPLICATE_IGNORED' });
    }

    // 3. Durable Append (Redis Streams)
    // Ensures safety-critical data is off-disk but persistent in the distributed state.
    const streamId = await persistenceService.appendEvent({
      hardware_id,
      timestamp,
      telemetry,
      location
    });

    // 4. Clock Sync
    const serverHlc = clock.receive(hlc_timestamp || `${timestamp}:0000:edge`);

    // 5. Dispatch to background worker for AI Triage & PostGIS Routing
    const incidentId = `inc_${eventHash.slice(0, 12)}`;
    await queueV2.dispatchToWorker({
      incidentId,
      streamId,
      telemetry,
      location,
      timestamp,
      vehicle_class,
      hardware_id
    });

    res.status(202).json({
      status: 'INGESTED',
      incident_id: incidentId,
      hlc_timestamp: serverHlc,
      stream_offset: streamId
    });

  } catch (err) {
    console.error('🚨 [Ingestion] Critical Pipeline Failure:', err.message);
    res.status(500).json({ error: 'INGESTION_FAILURE', reason: 'DURABILITY_SYNC_ERROR' });
  }
});

export const IngestionRouter = router;
