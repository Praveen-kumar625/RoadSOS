/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { z } from 'zod';

export const ServiceStationSchema = z.object({
  id: z.string(),
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  type: z.enum(['puncture', 'repair']),
  contact: z.string().optional(),
  lastUpdated: z.number()
});
