/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { Router } from 'express';
import { createHash } from 'node:crypto';
import { cacheService } from '../services/cache-service.js';
import { HybridLogicalClock } from '../../../../libs/core-utils/src/hlc.js';

const router = Router();
const clock = new HybridLogicalClock('gateway-01');

/**
 * IDEMPOTENT CRASH INGESTION
 */
router.post('/crash', async (req, res) => {
  const { telemetry, location, timestamp, hardware_id, hlc_timestamp } = req.body;

  // 1. Generate unique hash
  const eventHash = createHash('sha256')
    .update(JSON.stringify({ telemetry, location, timestamp }))
    .digest('hex');

  // 2. Idempotency Check
  const isUnique = await cacheService.checkIdempotency(hardware_id, eventHash);
  if (!isUnique) {
    return res.status(200).json({ status: 'DUPLICATE_IGNORED' });
  }

  // 3. Clock Sync
  const serverHlc = clock.receive(hlc_timestamp || `${timestamp}:0000:edge`);

  res.status(202).json({
    status: 'INGESTED',
    hlc_timestamp: serverHlc,
    idempotency_key: eventHash
  });
});

export const IngestionRouter = router;
