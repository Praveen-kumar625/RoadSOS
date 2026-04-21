/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * 
 * INTEGRATION TEST: RoadSoS v5 Durability & Decoupling
 */

import { jest } from '@jest/globals';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { DispatchService } from '../../src/services/dispatch-service.js';

const mockIo = {
  emit: jest.fn(),
  to: jest.fn().mockReturnValue({ emit: jest.fn() })
};

describe('Hardened Dispatch System v5 (Durability)', () => {
  let dispatcher;

  beforeEach(() => {
    dispatcher = new DispatchService(mockIo);
    jest.clearAllMocks();
  });

  test('Scenario: Incident Durability (Cold Storage)', async () => {
    const crashData = {
      telemetry: { resultant_a: 20 },
      location: { lat: 12.9915, lon: 80.2337 }
    };
    
    const analysis = { severity: 'CRITICAL' };
    
    // Process SOS
    await dispatcher.processSOS(crashData, analysis);

    // 1. Verify Memory State
    expect(dispatcher.activeEmergencies.size).toBe(1);

    // 2. Verify Disk State (DURABILITY CHECK)
    const statePath = join(process.cwd(), 'src/database/hot-state.json');
    expect(existsSync(statePath)).toBe(true);
    
    const savedData = JSON.parse(readFileSync(statePath, 'utf8'));
    expect(Object.keys(savedData.emergencies).length).toBe(1);
    console.log("[Test] Durability Verified: Incident survived to disk.");
  });

  test('Scenario: Liveness Filtering', async () => {
    // Force a responder to be ACTIVE in memory
    dispatcher.handleHeartbeat('HOSP-001', { name: 'IITM Hospital' });
    
    const crashData = {
      telemetry: { resultant_a: 20 },
      location: { lat: 12.9915, lon: 80.2337 }
    };
    
    await dispatcher.processSOS(crashData, { severity: 'CRITICAL' });

    // Should find the heart-beating responder
    const calls = mockIo.to.mock.calls;
    expect(calls.some(c => c[0].startsWith('incident_'))).toBe(true);
  });
});
