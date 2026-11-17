import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const pkg = JSON.parse(await readFile(path.join(process.cwd(), "package.json"), "utf8"));
const entrypoint = pkg.pulseFit?.entrypoint ?? "src/index.ts";

console.log(`${pkg.name} scaffold ready`);
console.log(`entrypoint: ${entrypoint}`);
console.log("Attach the target runtime bundler in a later implementation task.");
