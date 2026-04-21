/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { z } from 'zod';
import { BaseEntitySchema } from './common.schema.js';

export const PunctureShopSchema = BaseEntitySchema.extend({
  services: z.array(z.string()).default(['tyre-repair']),
  isOpen24x7: z.boolean().default(false)
});
