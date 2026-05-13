#!/usr/bin/env node

// src/cli.ts
import { cpSync, readFileSync, writeFileSync, existsSync, renameSync } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";
var args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(`
  \u2591\u2592\u2593 create-effect-http-starter \u2593\u2592\u2591

  Scaffold a new Effect HTTP server project with schema-first API design.

  Usage:
    npm create effect-http-starter@latest -- <project-name>
    pnpm create effect-http-starter <project-name>
    bun create effect-http-starter <project-name>
    npx create-effect-http-starter@latest <project-name>

  Options:
    --template <name>  Template to use (default: "default")
    --help, -h         Show this help message
`);
  process.exit(0);
}
var projectName = args[0];
var templateIndex = args.indexOf("--template");
var template = templateIndex !== -1 ? args[templateIndex + 1] : "default";
if (!projectName) {
  console.error("Error: Please specify a project name.");
  console.error("  create-effect-http-starter <project-name>");
  process.exit(1);
}
var targetDir = resolve(projectName);
if (existsSync(targetDir)) {
  console.error(`Error: Directory "${projectName}" already exists.`);
  process.exit(1);
}
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var templateDir = join(__dirname, "..", "templates", template);
if (!existsSync(templateDir)) {
  console.error(`Error: Template "${template}" not found.`);
  process.exit(1);
}
cpSync(templateDir, targetDir, { recursive: true });
var gitignoreSrc = join(targetDir, "_gitignore");
if (existsSync(gitignoreSrc)) {
  renameSync(gitignoreSrc, join(targetDir, ".gitignore"));
}
var pkgPath = join(targetDir, "package.json");
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  pkg.name = projectName;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}
var pm = detectPackageManager();
console.log(`
\u2728  Project created at ${targetDir}

Next steps:
  cd ${projectName}
  ${pm.install}
  ${pm.dev}
`);
function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent ?? "";
  if (userAgent.startsWith("bun")) return { install: "bun install", dev: "bun dev" };
  if (userAgent.startsWith("pnpm")) return { install: "pnpm install", dev: "pnpm dev" };
  if (userAgent.startsWith("yarn")) return { install: "yarn", dev: "yarn dev" };
  return { install: "npm install", dev: "npm run dev" };
}
