#!/usr/bin/env node
// =============================================================================
//  APYX Smart Traffic — Build Script
//  Builds the full-stack application (Vite frontend + esbuild backend)
// =============================================================================

import { execSync, spawn } from "child_process";
import { existsSync, rmSync, mkdirSync, copyFileSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname);
const DIST = join(ROOT, "dist");
const DIST_PUBLIC = join(DIST, "public");

// ─── ANSI color helpers ───────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  dim: "\x1b[2m",
};

function log(icon, color, label, msg = "") {
  console.log(`${color}${c.bold}${icon} ${label}${c.reset}${c.dim}${msg ? " — " + msg : ""}${c.reset}`);
}

function step(label, msg)  { log("▶", c.cyan,   label, msg); }
function ok(label, msg)    { log("✔", c.green,  label, msg); }
function warn(label, msg)  { log("⚠", c.yellow, label, msg); }
function fail(label, msg)  { log("✘", c.red,    label, msg); }
function header(title) {
  const line = "─".repeat(60);
  console.log(`\n${c.cyan}${c.bold}${line}${c.reset}`);
  console.log(`${c.cyan}${c.bold}  ${title}${c.reset}`);
  console.log(`${c.cyan}${c.bold}${line}${c.reset}\n`);
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function run(cmd, options = {}) {
  try {
    execSync(cmd, { stdio: "inherit", cwd: ROOT, ...options });
  } catch (err) {
    fail("Command failed", cmd);
    process.exit(1);
  }
}

function sizeOf(dir) {
  let total = 0;
  if (!existsSync(dir)) return "0 B";
  function walk(d) {
    readdirSync(d).forEach((f) => {
      const full = join(d, f);
      if (statSync(full).isDirectory()) walk(full);
      else total += statSync(full).size;
    });
  }
  walk(dir);
  if (total < 1024) return `${total} B`;
  if (total < 1024 * 1024) return `${(total / 1024).toFixed(1)} KB`;
  return `${(total / 1024 / 1024).toFixed(2)} MB`;
}

// ─── BUILD STEPS ─────────────────────────────────────────────────────────────

function clean() {
  step("Clean", "removing previous dist/");
  if (existsSync(DIST)) {
    rmSync(DIST, { recursive: true, force: true });
  }
  mkdirSync(DIST_PUBLIC, { recursive: true });
  ok("Clean", "dist/ cleared");
}

function typeCheck() {
  step("TypeScript", "checking types (tsc --noEmit)");
  run("npx tsc --noEmit");
  ok("TypeScript", "no type errors found");
}

function buildFrontend() {
  step("Vite", "building React frontend");
  run("npx vite build");
  ok("Vite", `frontend built → dist/public/ (${sizeOf(DIST_PUBLIC)})`);
}

function buildBackend() {
  step("esbuild", "bundling Express server");
  run(
    [
      "npx esbuild server/index.ts",
      "--platform=node",
      "--packages=external",
      "--bundle",
      "--format=esm",
      "--outdir=dist",
      "--sourcemap",
    ].join(" ")
  );
  ok("esbuild", `backend bundled → dist/index.js`);
}

function summary() {
  console.log("");
  header("Build Complete");
  console.log(`  ${c.green}${c.bold}Frontend${c.reset}  dist/public/    ${c.dim}${sizeOf(DIST_PUBLIC)}${c.reset}`);
  console.log(`  ${c.green}${c.bold}Backend${c.reset}   dist/index.js   ready`);
  console.log("");
  console.log(`  ${c.cyan}Run production server:${c.reset}`);
  console.log(`    ${c.bold}NODE_ENV=production node dist/index.js${c.reset}`);
  console.log(`    ${c.dim}or: npm start${c.reset}`);
  console.log("");
}

// ─── CLI ARG PARSING ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const skipTypeCheck = args.includes("--skip-types") || args.includes("-s");
const onlyFrontend  = args.includes("--frontend");
const onlyBackend   = args.includes("--backend");
const help          = args.includes("--help") || args.includes("-h");

if (help) {
  console.log(`
${c.bold}APYX Smart Traffic — Build Script${c.reset}

${c.bold}Usage:${c.reset}
  node build.mjs [options]

${c.bold}Options:${c.reset}
  --skip-types, -s   Skip TypeScript type checking (faster builds)
  --frontend         Build only the Vite frontend
  --backend          Build only the Express backend
  --help, -h         Show this help message

${c.bold}Examples:${c.reset}
  node build.mjs                  Full build (types + frontend + backend)
  node build.mjs --skip-types     Build without type checking
  node build.mjs --frontend       Only build the React app
  node build.mjs --backend        Only bundle the server
`);
  process.exit(0);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
header("APYX Smart Traffic — Production Build");

const startTime = Date.now();

if (!onlyFrontend && !onlyBackend) {
  clean();
  if (!skipTypeCheck) typeCheck();
  buildFrontend();
  buildBackend();
} else if (onlyFrontend) {
  clean();
  if (!skipTypeCheck) typeCheck();
  buildFrontend();
} else if (onlyBackend) {
  if (!skipTypeCheck) typeCheck();
  buildBackend();
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
summary();
console.log(`  ${c.dim}Total build time: ${elapsed}s${c.reset}\n`);
