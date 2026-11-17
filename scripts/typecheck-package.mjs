import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const pkg = JSON.parse(await readFile(path.join(process.cwd(), "package.json"), "utf8"));
const entrypoint = pkg.pulseFit?.entrypoint ?? "src/index.ts";
const content = await readFile(path.join(process.cwd(), entrypoint), "utf8");

const requiredMarkers = pkg.pulseFit?.requiredMarkers ?? [];
const missingMarkers = requiredMarkers.filter((marker) => !content.includes(marker));

if (missingMarkers.length > 0) {
  console.error(`missing type surface markers: ${missingMarkers.join(", ")}`);
  process.exit(1);
}

console.log(`type surface checked for ${pkg.name}`);
