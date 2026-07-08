import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const candidates = {
  robots: ["src/app/robots.ts", "app/robots.ts", "public/robots.txt", "robots.txt"],
  sitemap: ["src/app/sitemap.ts", "app/sitemap.ts", "public/sitemap.xml", "sitemap.xml"],
};

function existsAny(paths) {
  return paths.some((file) => existsSync(join(root, file)));
}

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path, files);
    else if (/\.(ts|tsx|js|jsx|md)$/.test(path)) files.push(path);
  }
  return files;
}

const sourceFiles = ["src", "app", "pages", "components", "lib", "config"]
  .flatMap((dir) => walk(join(root, dir)));
const corpus = sourceFiles.map((file) => readFileSync(file, "utf8")).join("\n");

const checks = [
  ["robots", existsAny(candidates.robots), "Add robots.ts or robots.txt."],
  ["sitemap", existsAny(candidates.sitemap), "Add sitemap.ts or sitemap.xml."],
  ["metadata", /metadata|generateMetadata|<Head/i.test(corpus), "Add Next.js metadata implementation."],
  ["json_ld", /json-ld|application\/ld\+json|Restaurant/i.test(corpus), "Add JSON-LD Restaurant helper."],
];

let warnings = 0;

if (sourceFiles.length === 0) {
  console.warn("WARNING: No application source files found yet. SEO implementation cannot be fully verified.");
}

for (const [name, ok, hint] of checks) {
  console.log(`${ok ? "OK" : "WARNING"} ${name}${ok ? "" : ` - ${hint}`}`);
  if (!ok) warnings += 1;
}

if (warnings > 0) {
  console.warn(`SEO check completed with ${warnings} warning(s).`);
} else {
  console.log("SEO files/checks passed.");
}

