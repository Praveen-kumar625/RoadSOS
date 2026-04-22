/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { HfInference } from '@huggingface/inference';
import { TemporalAegisGRU } from './inference/gru-inference.js';

export class AegisCoreAI {
  constructor(token) {
    this.hf = new HfInference(token || 'dummy_token');
    this.model = 'Qwen/Qwen2.5-7B-Instruct';
    this.gru = new TemporalAegisGRU();
  }

  /**
   * ADVANCED MULTI-MODAL ANALYSIS
   * Combines Temporal GRU inference with LLM reasoning.
   */
  async analyze(telemetry, history = []) {
    const start = Date.now();
    
    // 1. TEMPORAL GRU INFERENCE (Core AI Logic)
    // We analyze the sequence of forces (Current + Last 5 from history)
    const sequence = [...history.map(h => h.resultant_a), telemetry.resultant_a].slice(-6);
    const temporalAnalysis = this.gru.analyzeSequence(sequence);
    
    let result = {
      isCrash: temporalAnalysis.isAnomalous,
      severity: temporalAnalysis.severityScore > 0.8 ? 'CRITICAL' : (temporalAnalysis.severityScore > 0.5 ? 'MODERATE' : 'NOMINAL'),
      confidence: temporalAnalysis.confidence,
      method: 'GRU_TEMPORAL_ANALYSIS',
      ai_metadata: {
        layer: 'Recurrent Neural Network (GRU)',
        input_dim: sequence.length,
        normalized_score: temporalAnalysis.severityScore.toFixed(4)
      }
    };

    // 2. LLM ENRICHMENT (Reasoning Layer)
    try {
      const prompt = `<system>You are Aegis-Core, a safety-critical AI. Analyze this crash signature.
      Context: ${result.severity} impact detected via GRU model.
      Data: ${JSON.stringify(telemetry)}</system>
      Return JSON: { "explanation": "string", "recommended_action": "string", "victim_status_prediction": "string" }`;

      const res = await this.hf.textGeneration({
        model: this.model,
        inputs: prompt,
        parameters: { max_new_tokens: 150, temperature: 0.1 }
      });
      
      const aiResponse = this.parseCleanJson(res.generated_text);
      if (aiResponse) {
        result = { 
          ...result, 
          ...aiResponse, 
          method: 'HYBRID_AI_ORCHESTRATION',
          latency: Date.now() - start 
        };
      }
    } catch (err) {
      result.method = 'GRU_ONLY (Offline Fallback)';
    }

    result.latency = Date.now() - start;
    return result;
  }

  /**
   * Robust JSON parser that handles LLM noise
   */
  parseCleanJson(text) {
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return null;
      return JSON.parse(match[0]);
    } catch (e) {
      return null;
    }
  }
}
