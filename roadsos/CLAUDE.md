# Aegis-Core: RoadSoS Developer Guide

## Team Information
- **Team Name:** Divine Coders
- **Team Lead:** Praveen Kumar
- **Project:** RoadSoS (IIT Madras Hackathon 2026)

## Commands
- **Install Dependencies:** `npm install`
- **Development (All):** `npm run dev` (Runs Turbo orchestration)
- **Build (All):** `npm run build`
- **Security Audit:** `npm run security-audit`
- **Analyze Prompt:** `npm run analyze-prompt`
- **Edge Simulation:** `npm run dev --workspace=@roadsos/edge-firmware`
- **Force Crash:** `npm run crash --workspace=@roadsos/edge-firmware`

## Project Structure
- `apps/api-gateway-service`: Node.js/Socket.io backend for telemetry.
- `apps/web-client-roadsos`: Next.js 15 dashboard (FSD Architecture).
- `apps/edge-iot-firmware`: ESP32 JavaScript simulator with offline buffering.
- `apps/prompt-analyzer-cli`: Bun/TypeScript developer tool.
- `libs/core-types`: Shared Zod schemas and TypeScript interfaces.
- `tools/security`: Custom SAST and AI evaluation harnesses.

## Technology Stack
- **Backend:** Node.js, Express, Socket.io, axios
- **Frontend:** Next.js 15, React, Tailwind CSS, Recharts, Lucide
- **AI:** Hybrid (Random Forest for telemetry, Qwen 2.5 for context analysis)
- **Database:** PostgreSQL (PostGIS) with Redis spatial caching
- **Runtime:** Node.js 20+, Bun (for CLI)
- **Tooling:** Turbo, ESLint, Prettier, Jest

## Coding Standards
- Follow **Feature-Sliced Design (FSD)** for the web client.
- Use **Zod** for all input validation (schemas in `libs/core-types`).
- Maintain a **security-first** approach; no hardcoded secrets.
- Add the mandatory team header to all source files.
