import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const requiredEvents = [
  "click_get_directions",
  "click_call",
  "click_whatsapp",
  "click_zalo",
  "click_facebook_message",
  "view_menu",
  "booking_start",
  "booking_submit",
  "booking_success",
  "copy_address",
  "menu_item_click",
  "language_switch",
];

const sourceRoots = ["src", "app", "pages", "components", "lib", "config", "data"];
const exts = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md"]);

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path, files);
    else if ([...exts].some((ext) => path.endsWith(ext))) files.push(path);
  }
  return files;
}

const files = sourceRoots.flatMap((dir) => walk(join(process.cwd(), dir)));

if (files.length === 0) {
  console.warn("WARNING: No application source files found yet. Tracking events cannot be verified.");
  process.exit(0);
}

const corpus = files.map((file) => readFileSync(file, "utf8")).join("\n");
let missing = 0;

for (const eventName of requiredEvents) {
  const ok = corpus.includes(eventName);
  console.log(`${ok ? "OK" : "MISSING"} ${eventName}`);
  if (!ok) missing += 1;
}

if (missing > 0) {
  console.warn(`WARNING: ${missing} required tracking event(s) not found.`);
  process.exit(0);
}

console.log("All required tracking events found.");

