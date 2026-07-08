import { existsSync } from "node:fs";
import { join } from "node:path";

const required = [
  "docs/Initial.md",
  "docs/Baseline_Phase1_Phase2.md",
  ".ai/orchestrator.md",
  ".ai/context/project-context.md",
  ".ai/agents/agent-registry.md",
  ".ai/skills/skill-registry.md",
];

let failed = false;

for (const file of required) {
  const ok = existsSync(join(process.cwd(), file));
  console.log(`${ok ? "OK" : "MISSING"} ${file}`);
  if (!ok) failed = true;
}

if (failed) {
  console.error("Context validation failed.");
  process.exit(1);
}

console.log("Context validation passed.");

