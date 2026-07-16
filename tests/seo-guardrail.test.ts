import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { expect, test } from "@playwright/test";

test("SEO guardrail passes for the repository", () => {
  const result = spawnSync(process.execPath, ["scripts/ai/check-seo-files.mjs"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });

  expect(result.status).toBe(0);
  expect(`${result.stdout}${result.stderr}`).toContain("SEO guardrail passed");
});

test("SEO guardrail exits nonzero when required artifacts are missing", ({}, testInfo) => {
  const emptyRoot = testInfo.outputPath("empty-seo-root");
  mkdirSync(emptyRoot, { recursive: true });

  const result = spawnSync(process.execPath, ["scripts/ai/check-seo-files.mjs"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      SEO_CHECK_ROOT: emptyRoot,
    },
  });

  expect(result.status).toBe(1);
  expect(`${result.stdout}${result.stderr}`).toContain("SEO guardrail failed");
});
