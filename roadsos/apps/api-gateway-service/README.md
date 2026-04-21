# API Gateway Service
**RoadSoS Connectivity Layer**

## Overview
This service acts as the central hub for RoadSoS, ingesting real-time telemetry from edge devices and orchestrating AI analysis and emergency dispatch.

## Features
- **M2M Ingestion:** REST/Socket.io endpoints for IoT telemetry.
- **Aegis-Core Integration:** Hybrid crash validation using Qwen 2.5.
- **Spatial Discovery:** Real-time trauma center lookup via OpenStreetMap.
- **Security:** Built-in rate limiting and OWASP hardening.

## Scripts
- `npm run dev`: Start server in development mode.
- `npm test`: Run unit tests for ingestion and routing logic.
