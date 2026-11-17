import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const pkg = JSON.parse(await readFile(path.join(process.cwd(), "package.json"), "utf8"));

if (pkg.pulseFit?.healthRouteFile) {
  const routeFile = path.join(process.cwd(), pkg.pulseFit.healthRouteFile);
  const content = await readFile(routeFile, "utf8");
  for (const route of ["/health", "/api/v1"]) {
    if (!content.includes(route)) {
      console.error(`${pkg.name} is missing ${route}`);
      process.exit(1);
    }
  }
}

console.log(`tests passed for ${pkg.name}`);
