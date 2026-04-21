/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { z } from 'zod';

export const CrashEventSchema = z.object({
  telemetry: z.object({
    accelerometer: z.object({ x: z.number(), y: z.number(), z: z.number() }),
    speed_kmh: z.number().min(0),
    vibration_hz: z.number().min(0)
  }),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180)
  }),
  timestamp: z.number().int()
});
