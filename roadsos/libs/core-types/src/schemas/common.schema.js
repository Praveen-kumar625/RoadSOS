/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { z } from 'zod';
import { LocationSchema } from './location.schema.js';

export const BaseEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  location: LocationSchema,
  contact: z.string().optional(),
  lastUpdated: z.number().int()
});
