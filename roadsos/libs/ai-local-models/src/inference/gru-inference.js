/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * File: libs/ai-local-models/src/inference/gru-inference.js
 */

/**
 * AEGIS-CORE GRU (Gated Recurrent Unit) SIMULATOR
 * This implements a pure JavaScript inference engine for temporal telemetry analysis.
 * It uses a pre-trained weight matrix (simulated) to detect crash patterns in time-series data.
 */

export class TemporalAegisGRU {
  constructor() {
    // Simulated Weights (Normally loaded from a .bin or .json file)
    // Trained on NCRB Road Safety Dataset (Simulated)
    this.weights = {
      updateGate: { w: 0.72, u: 0.45, b: -0.12 },
      resetGate: { w: 0.65, u: 0.38, b: 0.05 },
      candidate: { w: 0.88, u: 0.52, b: -0.22 }
    };
    this.hiddenState = 0.0;
  }

  /**
   * Sigmoid Activation Function
   */
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  /**
   * Tanh Activation Function
   */
  tanh(x) {
    return Math.tanh(x);
  }

  /**
   * Single Step Inference
   * @param {number} input Normalized G-Force
   */
  step(input) {
    const z = this.sigmoid(this.weights.updateGate.w * input + this.weights.updateGate.u * this.hiddenState + this.weights.updateGate.b);
    const r = this.sigmoid(this.weights.resetGate.w * input + this.weights.resetGate.u * this.hiddenState + this.weights.resetGate.b);
    
    const h_tilde = this.tanh(this.weights.candidate.w * input + this.weights.candidate.u * (r * this.hiddenState) + this.weights.candidate.b);
    
    this.hiddenState = (1 - z) * this.hiddenState + z * h_tilde;
    return this.hiddenState;
  }

  /**
   * Process a sequence of telemetry points
   * @param {Array<number>} sequence Array of resultant G-forces
   */
  analyzeSequence(sequence) {
    this.hiddenState = 0.0; // Reset state
    let scores = sequence.map(val => this.step(val / 20.0)); // Normalize to 0-1 range (approx 20G max)
    
    const finalScore = scores[scores.length - 1];
    
    return {
      severityScore: finalScore,
      isAnomalous: finalScore > 0.65,
      confidence: 0.85 + (finalScore * 0.1)
    };
  }
}
