/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { z } from 'zod';

/**
 * Optimized Crash Event Schema
 * Supports spatial geometry and temporal windowing.
 */
export const CrashEventSchema = z.object({
  telemetry: z.object({
    accelerometer: z.object({ x: z.number(), y: z.number(), z: z.number() }),
    speed_kmh: z.number().min(0),
    vibration_hz: z.number().min(0),
    resultant_a: z.number().optional()
  }),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    // PostGIS compatible point
    geom: z.string().optional() 
  }),
  hardware_id: z.string().startsWith('ROAD-'),
  timestamp: z.number().int(),
  vehicle_class: z.enum(['L3', 'L5', 'M1', 'N1']).default('M1')
});
