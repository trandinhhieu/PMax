import { readFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const showAll = args.includes("--all");
const query = args.filter((arg) => arg !== "--all").join(" ").trim().toLowerCase();

if (!query) {
  console.error("Usage: npm.cmd run ai:route -- \"booking form\"");
  process.exit(1);
}

const routes = JSON.parse(
  readFileSync(join(process.cwd(), ".ai", "agents", "agent-routing-map.json"), "utf8"),
);

function score(route) {
  const haystack = [
    route.id,
    ...(route.keywords ?? []),
    route.primaryAgent,
    ...(route.skills ?? []),
    ...(route.workflows ?? []),
  ]
    .join(" ")
    .toLowerCase();

  const words = query.split(/\s+/).filter(Boolean);
  let total = 0;

  for (const word of words) {
    if (haystack.includes(word)) total += 1;
  }

  for (const keyword of route.keywords ?? []) {
    if (query.includes(keyword.toLowerCase())) total += 3;
  }

  return total;
}

const allMatches = routes
  .map((route) => ({ route, score: score(route) }))
  .filter((entry) => entry.score > 0)
  .sort((a, b) => b.score - a.score);

const matches = showAll ? allMatches.slice(0, 3) : allMatches.slice(0, 1);

if (matches.length === 0) {
  console.warn(`No route matched "${query}". Start with .ai/orchestrator.md and .ai/agents/agent-registry.md.`);
  process.exit(0);
}

for (const { route, score: routeScore } of matches) {
  console.log(`\n# ${route.id} (score ${routeScore})`);
  console.log(`Primary agent: ${route.primaryAgent}`);
  console.log(`Supporting agents: ${(route.supportingAgents ?? []).join(", ") || "none"}`);
  console.log(`Required context:\n- ${route.requiredContext.join("\n- ")}`);
  console.log(`Workflows:\n- ${route.workflows.join("\n- ")}`);
  console.log(`Skills:\n- ${route.skills.join("\n- ")}`);
  console.log(`Checklists:\n- ${route.checklists.join("\n- ")}`);
  console.log(`Validation:\n- ${route.validation.join("\n- ")}`);
}
