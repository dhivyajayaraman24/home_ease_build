import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const checkedExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"]);
const ignoredDirectories = new Set(["node_modules", "dist", ".git"]);
const failures = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        await walk(fullPath);
      }
      continue;
    }

    if (!checkedExtensions.has(path.extname(entry.name))) {
      continue;
    }

    const content = await readFile(fullPath, "utf8");
    const lines = content.split("\n");
    lines.forEach((line, index) => {
      if (line.includes("\t")) {
        failures.push(`${path.relative(process.cwd(), fullPath)}:${index + 1} contains a tab`);
      }
      if (line.length > 120) {
        failures.push(`${path.relative(process.cwd(), fullPath)}:${index + 1} exceeds 120 characters`);
      }
    });
  }
}

await stat(path.join(process.cwd(), "package.json"));
await walk(process.cwd());

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("lint passed");
