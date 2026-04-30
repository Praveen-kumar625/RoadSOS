/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { z } from 'zod';

export const HospitalSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.object({
    lat: z.number(),
    lon: z.number()
  }),
  has_icu: z.boolean(),
  current_load: z.number().min(0).max(100),
  category: z.string().default('hospital')
});
