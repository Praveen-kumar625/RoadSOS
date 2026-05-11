import { calculateESS } from '../../../libs/core-utils/src/spatial.js';
import { TemporalAegisGRU } from '../../../libs/ai-local-models/src/inference/gru-inference.js';

describe('Emergency Scoring System (ESS)', () => {
  it('should correctly calculate score for available responder with distance', () => {
    const responder = { status: 'AVAILABLE', dist_meters: 600 }; // 600m => 98 eta score
    const result = calculateESS({}, responder);
    // ETA score = 100 - (600/300) = 98
    // Final score = (98 * 0.4) + (100 * 0.4) = 39.2 + 40 = 79.2 => 79
    expect(result.score).toBe(79);
    expect(result.factors.eta).toBe(98);
  });

  it('should use cell_distance if dist_meters is unavailable', () => {
    const responder = { status: 'AVAILABLE', cell_distance: 1 }; // 1 * 1200m = 1200m
    const result = calculateESS({}, responder);
    // ETA score = 100 - (1200/300) = 96
    // Final score = (96 * 0.4) + (100 * 0.4) = 38.4 + 40 = 78.4 => 78
    expect(result.score).toBe(78);
  });

  it('should handle unavailable responder', () => {
    const responder = { status: 'UNAVAILABLE', dist_meters: 300 };
    const result = calculateESS({}, responder);
    // ETA score = 100 - 1 = 99
    // Final score = (99 * 0.4) + (0 * 0.4) = 39.6 => 40
    expect(result.score).toBe(40);
  });
});

describe('TemporalAegisGRU', () => {
  it('should calculate severity score for sequence and trigger anomaly', () => {
    const gru = new TemporalAegisGRU();
    const sequence = [10, 20, 30, 40, 50, 60];
    const result = gru.analyzeSequence(sequence);
    
    expect(result).toHaveProperty('isAnomalous');
    expect(result).toHaveProperty('severityScore');
    expect(result).toHaveProperty('confidence');
    
    // With 20G in sequence, it should definitely be anomalous
    expect(result.isAnomalous).toBe(true);
    expect(result.severityScore).toBeGreaterThan(0.8);
  });

  it('should output nominal for low impact sequence', () => {
    const gru = new TemporalAegisGRU();
    const sequence = [1, 1.2, 0.9, 1.1, 1.3, 1.0];
    const result = gru.analyzeSequence(sequence);
    
    expect(result.isAnomalous).toBe(false);
    expect(result.severityScore).toBeLessThan(0.3);
  });
});
