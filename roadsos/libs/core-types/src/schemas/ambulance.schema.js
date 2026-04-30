/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { z } from 'zod';

export const AmbulanceSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['AVAILABLE', 'BUSY', 'OFFLINE']),
  location: z.object({
    lat: z.number(),
    lon: z.number()
  }),
  current_load: z.number().min(0).max(100),
  last_updated: z.number()
});
