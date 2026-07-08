import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const agentsDir = join(root, ".ai", "agents");
const skillsDir = join(root, ".ai", "skills");
const outFile = join(root, ".ai", "AGENT_INDEX.md");

function mdFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((file) => file.endsWith(".md")).sort();
}

function heading(content) {
  return content.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "Untitled";
}

function section(content, name) {
  const pattern = new RegExp(`## ${name}\\s+([\\s\\S]*?)(?=\\n## |$)`, "i");
  return content.match(pattern)?.[1]?.trim().replace(/\s+/g, " ") ?? "";
}

const lines = [
  "# Agent Index",
  "",
  `Generated at ${new Date().toISOString()}.`,
  "",
  "## Agents",
  "",
  "| Agent | File | Responsibility | Related skills |",
  "|---|---|---|---|",
];

for (const file of mdFiles(agentsDir)) {
  if (file === "agent-registry.md") continue;
  const rel = `.ai/agents/${file}`;
  const content = readFileSync(join(agentsDir, file), "utf8");
  lines.push(`| ${heading(content)} | \`${rel}\` | ${section(content, "Responsibilities") || section(content, "Role")} | ${section(content, "Skills used")} |`);
}

lines.push("", "## Skills", "", "| Skill | File | Purpose |", "|---|---|---|");

for (const file of mdFiles(skillsDir)) {
  if (file === "skill-registry.md") continue;
  const rel = `.ai/skills/${file}`;
  const content = readFileSync(join(skillsDir, file), "utf8");
  lines.push(`| ${heading(content)} | \`${rel}\` | ${section(content, "Purpose")} |`);
}

writeFileSync(outFile, `${lines.join("\n")}\n`, "utf8");
console.log(`Generated ${outFile}`);

