/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { HfInference } from "@huggingface/inference";
import { z } from "zod";

const hf = new HfInference(process.env.HF_TOKEN || "dummy_token");

const crashSchema = z.object({
  isCrash: z.boolean(),
  severity: z.enum(["CRITICAL", "MODERATE", "NOMINAL"]),
  confidence: z.number().min(0).max(1)
});

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
2. Output ONLY a JSON object. Format: {"isCrash": boolean, "severity": "CRITICAL"|"MODERATE"|"NOMINAL", "confidence": number}
</rules>`;

  try {
    const res = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-7B-Instruct",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 200,
      temperature: 0.1
    });
    
    const content = res.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return crashSchema.parse(parsed);
    }
    
    // Fallback if no match but content is json
    const parsed = JSON.parse(content);
    return crashSchema.parse(parsed);
  } catch (err) {
    console.error("LLM Parsing Error:", err.message);
    const maxG = Math.max(Math.abs(telemetry.accelerometer.x), Math.abs(telemetry.accelerometer.y));
    return {
      isCrash: maxG > 10,
      severity: maxG > 10 ? "CRITICAL" : "NOMINAL",
      confidence: 0.99
    };
  }
}
