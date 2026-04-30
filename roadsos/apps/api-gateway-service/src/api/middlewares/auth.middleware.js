/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

/**
 * Hardened Zero-Trust Auth Middleware
 * Supports JWT-based authentication for both Responders and IoT Devices.
 */
export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'UNAUTHORIZED', 
      detail: 'Missing or malformed authorization header' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'FORBIDDEN', 
      detail: 'Invalid or expired token' 
    });
  }
};
