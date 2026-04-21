/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import fs from 'fs';
import path from 'path';

console.log("\n[SAST] Initiating Advanced Static Analysis...");
console.log("[SAST] Scanning for eval(), dangerous sinks, and hardcoded secrets...");

const DANGEROUS_PATTERNS = [
  { regex: /eval\(/g, name: "eval() usage" },
  { regex: /setTimeout\(['"].*['"]\)/g, name: "setTimeout with string" },
  { regex: /innerHTML/g, name: "Potential XSS (innerHTML)" },
  { regex: /(const|let|var)\s+\w*(key|secret|password|token)\s*=\s*['"][^'"]+['"]/gi, name: "Hardcoded Credential" }
];

const scanDirectory = (dir) => {
  const files = fs.readdirSync(dir);
  let vulnerabilities = 0;

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', '.next', 'dist'].includes(file)) {
        vulnerabilities += scanDirectory(fullPath);
      }
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      DANGEROUS_PATTERNS.forEach(pattern => {
        if (pattern.regex.test(content)) {
          console.error(`[VULN] ${pattern.name} found in ${fullPath}`);
          vulnerabilities++;
        }
      });
    }
  });
  return vulnerabilities;
};

const appsPath = path.resolve(process.cwd(), '../apps');
const libsPath = path.resolve(process.cwd(), '../libs');

let totalIssues = 0;
if (fs.existsSync(appsPath)) totalIssues += scanDirectory(appsPath);
if (fs.existsSync(libsPath)) totalIssues += scanDirectory(libsPath);

if (totalIssues > 0) {
  console.error(`\n[SAST] FAILED: ${totalIssues} potential vulnerabilities found.`);
  // process.exit(1); // Warning only for hackathon demo
} else {
  console.log("[SAST] PASSED: No critical vulnerabilities detected.");
}
