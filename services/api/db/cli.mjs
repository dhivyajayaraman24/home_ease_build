import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const dbRoot = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(dbRoot, "migrations");
const seedsDir = path.join(dbRoot, "seeds");

async function loadSqlFiles(directory) {
  const names = (await readdir(directory)).filter((name) => name.endsWith(".sql")).sort();

  return Promise.all(
    names.map(async (fileName) => {
      const filePath = path.join(directory, fileName);
      const sql = await readFile(filePath, "utf8");
      const [version] = fileName.split("_", 1);

      return {
        version,
        name: fileName,
        sql,
        checksum: createHash("sha256").update(sql).digest("hex")
      };
    })
  );
}

async function createPostgresClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to connect to PostgreSQL.");
  }

  const { Pool } = await import("pg");

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined
  });
}

async function runMigrations(database) {
  const files = await loadSqlFiles(migrationsDir);
  const result = { applied: [], skipped: [] };

  for (const migration of files) {
    const existing = await database.query(
      "SELECT checksum FROM schema_migrations WHERE version = $1",
      [migration.version]
    ).catch((error) => {
      if (error instanceof Error && error.message.includes("schema_migrations")) {
        return { rows: [] };
      }

      throw error;
    });

    if (existing.rows[0]) {
      if (existing.rows[0].checksum !== migration.checksum) {
        throw new Error(`Migration ${migration.name} checksum differs from the applied version.`);
      }

      result.skipped.push(migration.name);
      continue;
    }

    await database.query(migration.sql);
    await database.query(
      "INSERT INTO schema_migrations (version, name, checksum) VALUES ($1, $2, $3)",
      [migration.version, migration.name, migration.checksum]
    );
    result.applied.push(migration.name);
  }

  return result;
}

async function runSeeds(database) {
  const files = await loadSqlFiles(seedsDir);
  const result = { applied: [], skipped: [] };

  for (const seed of files) {
    await database.query(seed.sql);
    result.applied.push(seed.name);
  }

  return result;
}

const command = process.argv[2] ?? "migrate";
const database = await createPostgresClient();

try {
  const result = command === "seed" ? await runSeeds(database) : await runMigrations(database);
  console.log(JSON.stringify(result, null, 2));
} finally {
  await database.end();
}
