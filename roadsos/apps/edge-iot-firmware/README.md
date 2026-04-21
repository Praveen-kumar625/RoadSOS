# Edge IoT Firmware Simulator
**RoadSoS Perception Layer**

## Overview
A high-fidelity simulator of the ESP32-based RoadSoS firmware. It models IMU data, speed, and vibration to simulate realistic vehicular conditions and crash events.

## Features
- **IMU Modeling:** Generates synthetic accelerometer and vibration data.
- **Offline Resilience:** Buffers events locally when the API gateway is unreachable.
- **Crash Simulation:** Trigger crash events manually for system validation.

## Scripts
- `npm run start`: Run nominal telemetry simulation.
- `npm run crash`: Force a critical crash event simulation.
