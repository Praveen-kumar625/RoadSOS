/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { z } from 'zod';
import { BaseEntitySchema } from './common.schema.js';

export const TowingSchema = BaseEntitySchema.extend({
  vehicleTypes: z.array(z.string()).optional(),
  isAvailable: z.boolean().default(true)
});
