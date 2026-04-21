#!/usr/bin/env bun
/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * CLI Tool: Prompt Analyzer
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { z } from 'zod';
import { readFileSync } from 'fs';

const program = new Command();

program
  .name('prompt-analyze')
  .description('Analyze AI coding prompts for quality, security, and clarity')
  .version('1.0.0')
  .argument('[file]', 'Prompt file to analyze')
  .option('-j, --json', 'Output results in JSON format')
  .option('-s, --strict', 'Enable strict mode (higher score threshold)')
  .action(async (file, options) => {
    try {
      let content = '';
      if (file) {
        content = readFileSync(file, 'utf-8');
      } else {
        // Read from stdin
        for await (const chunk of Bun.stdin.stream()) {
          content += Buffer.from(chunk).toString();
        }
      }

      if (!content.trim()) {
        console.error(chalk.red('Error: No input provided.'));
        process.exit(2);
      }

      const results = await analyzePrompt(content);
      
      if (options.json) {
        console.log(JSON.stringify(results, null, 2));
      } else {
        renderUI(results);
      }

      // Exit Codes: 0 = good, 1 = warnings, 2 = critical issues
      if (results.score < 50) process.exit(2);
      if (results.score < 80) process.exit(1);
      process.exit(0);

    } catch (error: any) {
      console.error(chalk.red(`Fatal Error: ${error.message}`));
      process.exit(2);
    }
  });

async function analyzePrompt(input: string) {
  // Simulated LLM Evaluation logic as per user instructions
  // In a real production tool, this would call an OpenAI/Gemini/HuggingFace API
  
  const issues = [];
  let score = 100;

  if (input.length < 50) {
    issues.push("Prompt is too short/ambiguous");
    score -= 30;
  }
  if (!input.includes("Output") && !input.includes("return")) {
    issues.push("Missing explicit output format constraints");
    score -= 20;
  }
  if (input.match(/password|key|secret/i)) {
    issues.push("Security red flag: Potential credential exposure in prompt");
    score -= 40;
  }
  if (!input.includes("role") && !input.includes("You are a")) {
    issues.push("Missing persona/role definition");
    score -= 10;
  }

  return {
    issues,
    score: Math.max(0, score),
    suggestion: "Consider adding explicit constraints and a clear role definition."
  };
}

function renderUI(results: any) {
  console.log(chalk.bold.blue('\n--- Prompt Analysis Report ---'));
  console.log(`${chalk.bold('Score:')} ${formatScore(results.score)}`);
  
  if (results.issues.length > 0) {
    console.log(chalk.yellow(`\nIssues Found (${results.issues.length}):`));
    results.issues.forEach((issue: string) => console.log(chalk.dim(`- ${issue}`)));
  } else {
    console.log(chalk.green('\nNo major issues found. Great prompt!'));
  }

  console.log(chalk.bold.cyan('\nSuggestion:'));
  console.log(results.suggestion);
  console.log(chalk.bold.blue('------------------------------\n'));
}

function formatScore(score: number) {
  if (score >= 80) return chalk.green(`${score}/100 (Pass)`);
  if (score >= 50) return chalk.yellow(`${score}/100 (Warning)`);
  return chalk.red(`${score}/100 (Critical)`);
}

program.parse();
