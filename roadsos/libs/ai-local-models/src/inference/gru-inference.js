/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * File: libs/ai-local-models/src/inference/gru-inference.js
 */

/**
 * AEGIS-CORE GRU (Gated Recurrent Unit) SIMULATOR
 * Hyper-optimized pure JavaScript inference engine using Float32Arrays
 * for zero-allocation, minimal memory overhead and strict latency.
 */
export class TemporalAegisGRU {
  constructor() {
    // Pack weights into flat TypedArrays to ensure CPU cache locality and zero GC overhead
    // Format: [w, u, b]
    this.weights = new Float32Array([
      0.72, 0.45, -0.12, // Update Gate
      0.65, 0.38,  0.05, // Reset Gate
      0.88, 0.52, -0.22  // Candidate
    ]);
    this.hiddenState = 0.0;
  }

  /**
   * Fast approximate sigmoid
   */
  fastSigmoid(x) {
    return x / (1 + Math.abs(x)) * 0.5 + 0.5;
  }

  /**
   * Fast approximate tanh
   */
  fastTanh(x) {
    if (x > 3) return 1;
    if (x < -3) return -1;
    const x2 = x * x;
    return x * (27 + x2) / (27 + 9 * x2);
  }

  /**
   * Single Step Inference (Zero Allocation)
   * @param {number} input Normalized G-Force
   */
  step(input) {
    const w = this.weights;
    const h = this.hiddenState;
    
    // Update Gate
    const z = this.fastSigmoid(w[0] * input + w[1] * h + w[2]);
    // Reset Gate
    const r = this.fastSigmoid(w[3] * input + w[4] * h + w[5]);
    // Candidate
    const h_tilde = this.fastTanh(w[6] * input + w[7] * (r * h) + w[8]);
    
    this.hiddenState = (1 - z) * h + z * h_tilde;
    return this.hiddenState;
  }

  /**
   * Process a sequence of telemetry points with minimal allocation
   * @param {Float32Array|Array<number>} sequence Array of resultant G-forces
   */
  analyzeSequence(sequence) {
    this.hiddenState = 0.0; // Reset state
    
    const len = sequence.length;
    let finalScore = 0;
    
    // Execute sequence without array mapping/allocations
    for (let i = 0; i < len; i++) {
      finalScore = this.step(sequence[i] * 0.05); // Normalize to 0-1 range (approx 20G max)
    }
    
    return {
      severityScore: finalScore,
      isAnomalous: finalScore > 0.65,
      confidence: 0.85 + (finalScore * 0.1)
    };
  }
}
