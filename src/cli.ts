#!/usr/bin/env node
import { cpSync, readFileSync, writeFileSync, existsSync, renameSync } from "node:fs"
import { join, resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const args = process.argv.slice(2)

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(`
  ░▒▓ create-effect-http-starter ▓▒░

  Scaffold a new Effect HTTP server project with schema-first API design.

  Usage:
    npm create effect-http-starter@latest -- <project-name>
    pnpm create effect-http-starter <project-name>
    bun create effect-http-starter <project-name>
    npx create-effect-http-starter@latest <project-name>

  Options:
    --template <name>  Template to use (default: "default")
    --help, -h         Show this help message
`)
  process.exit(0)
}

const projectName = args[0]
const templateIndex = args.indexOf("--template")
const template = templateIndex !== -1 ? args[templateIndex + 1] : "default"

if (!projectName) {
  console.error("Error: Please specify a project name.")
  console.error("  create-effect-http-starter <project-name>")
  process.exit(1)
}

const targetDir = resolve(projectName)

if (existsSync(targetDir)) {
  console.error(`Error: Directory "${projectName}" already exists.`)
  process.exit(1)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const templateDir = join(__dirname, "..", "templates", template)

if (!existsSync(templateDir)) {
  console.error(`Error: Template "${template}" not found.`)
  process.exit(1)
}

// Copy template files
cpSync(templateDir, targetDir, { recursive: true })

// Rename _gitignore -> .gitignore (npm excludes .gitignore from packages)
const gitignoreSrc = join(targetDir, "_gitignore")
if (existsSync(gitignoreSrc)) {
  renameSync(gitignoreSrc, join(targetDir, ".gitignore"))
}

// Replace project name in package.json
const pkgPath = join(targetDir, "package.json")
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"))
  pkg.name = projectName
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
}

// Detect package manager for next-steps hint
const pm = detectPackageManager()

console.log(`
✨  Project created at ${targetDir}

Next steps:
  cd ${projectName}
  ${pm.install}
  ${pm.dev}
`)

function detectPackageManager(): { install: string; dev: string } {
  const userAgent = process.env.npm_config_user_agent ?? ""
  if (userAgent.startsWith("bun")) return { install: "bun install", dev: "bun dev" }
  if (userAgent.startsWith("pnpm")) return { install: "pnpm install", dev: "pnpm dev" }
  if (userAgent.startsWith("yarn")) return { install: "yarn", dev: "yarn dev" }
  return { install: "npm install", dev: "npm run dev" }
}
