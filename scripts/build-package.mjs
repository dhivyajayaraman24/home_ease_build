import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const cwd = process.cwd();
const pkg = JSON.parse(await readFile(path.join(cwd, "package.json"), "utf8"));
const srcDir = path.join(cwd, "src");
const distDir = path.join(cwd, "dist");

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

const entrypoint = pkg.pulseFit?.entrypoint ?? "src/index.ts";
await readFile(path.join(cwd, entrypoint), "utf8");

await writeFile(
  path.join(distDir, "build-info.json"),
  JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      entrypoint,
      sourceRoot: path.relative(cwd, srcDir),
      builtAt: new Date().toISOString()
    },
    null,
    2
  )
);

console.log(`built ${pkg.name}`);
