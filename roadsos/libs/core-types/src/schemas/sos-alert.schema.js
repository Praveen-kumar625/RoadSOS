/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { z } from 'zod';

export const AlertStatusSchema = z.enum([
  'CREATED',
  'ANALYZING',
  'DISPATCHED',
  'ACCEPTED',
  'IN_PROGRESS',
  'RESOLVED',
  'FAILED'
]);

export const SOSAlertSchema = z.object({
  id: z.string(),
  crashEventId: z.string(),
  status: AlertStatusSchema,
  responderId: z.string().optional(),
  eta: z.number().optional(), // minutes
  retryCount: z.number().default(0),
  lastError: z.string().optional(),
  timestamp: z.number().int()
});
