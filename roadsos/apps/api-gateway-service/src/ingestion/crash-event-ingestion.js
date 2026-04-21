/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_TOKEN || 'dummy_token');

export async function analyzeCrashWithOpenLLM(telemetry) {
  // Advanced Prompt Engineering from anthropics/prompt-eng-interactive-tutorial
  const prompt = `<system>
You are Aegis-Core, an elite AI Crash Analyst for RoadSoS.
Your task is to analyze IMU telemetry and determine if a vehicular crash occurred.
Think step-by-step in <scratchpad> tags before outputting JSON.
</system>
<telemetry>
${JSON.stringify(telemetry)}
</telemetry>
<rules>
1. If G-Force (x, y, or z) exceeds 10G or vibration exceeds 500Hz, it is a CRITICAL crash.
2. Output ONLY a JSON object after the scratchpad. Format: {"isCrash": boolean, "severity": "CRITICAL"|"NOMINAL", "confidence": number}
</rules>`;

  try {
    const res = await hf.textGeneration({
      model: 'Qwen/Qwen2.5-7B-Instruct',
      inputs: prompt,
      parameters: { max_new_tokens: 200, temperature: 0.1 }
    });
    
    const jsonMatch = res.generated_text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("Failed to parse LLM output");
  } catch (err) {
    const maxG = Math.max(Math.abs(telemetry.accelerometer.x), Math.abs(telemetry.accelerometer.y));
    return {
      isCrash: maxG > 10,
      severity: maxG > 10 ? 'CRITICAL' : 'NOMINAL',
      confidence: 0.99
    };
  }
}
