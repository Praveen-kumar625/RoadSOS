/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { z } from 'zod';
import { BaseEntitySchema } from './common.schema.js';

export const PoliceSchema = BaseEntitySchema.extend({
  precinct: z.string().optional(),
  emergencyNumber: z.string().default('100')
});
