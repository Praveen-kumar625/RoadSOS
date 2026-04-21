/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { config } from 'dotenv';
// Load from .env if it exists (Optional for dev)
config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  HF_TOKEN: process.env.HF_TOKEN || 'dummy_token',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  VERSION: '1.0.0-prototype'
};
