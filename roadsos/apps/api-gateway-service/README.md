# API Gateway Service
**RoadSoS Connectivity Layer**

## Overview
This service acts as the central hub for RoadSoS, ingesting real-time telemetry from edge devices and orchestrating AI analysis and emergency dispatch.

## Features
- **M2M Ingestion:** REST/Socket.io endpoints for IoT telemetry.
- **Hybrid AI Triage:** Real-time crash severity classification using Scikit-Learn Random Forest (Telemetry) and context analysis via Qwen 2.5 (Reports).
- **Spatial Caching:** Redis-based caching layer for OSM Overpass API to ensure sub-50ms resource discovery.
- **Resource Routing:** Intelligent dispatch for Police, Hospitals, Towing, Puncture Shops, and Showrooms.
- **Security:** Built-in rate limiting and OWASP hardening.

## Scripts
- `npm run dev`: Start server in development mode.
- `npm test`: Run unit tests for ingestion and routing logic.
