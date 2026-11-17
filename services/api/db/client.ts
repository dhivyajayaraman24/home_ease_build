import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface QueryableDatabase {
  query<T = unknown>(sql: string, params?: readonly unknown[]): Promise<{ rows: T[] }>;
}

export interface MigrationFile {
  version: string;
  name: string;
  path: string;
  sql: string;
  checksum: string;
}

export interface MigrationResult {
  applied: string[];
  skipped: string[];
}

export interface PostgresClientConfig {
  connectionString?: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
}

const dbRoot = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(dbRoot, "migrations");
const seedsDir = path.join(dbRoot, "seeds");

async function loadSqlFiles(directory: string): Promise<MigrationFile[]> {
  const names = (await readdir(directory)).filter((name) => name.endsWith(".sql")).sort();

  return Promise.all(
    names.map(async (fileName) => {
      const filePath = path.join(directory, fileName);
      const sql = await readFile(filePath, "utf8");
      const [version] = fileName.split("_", 1);

      return {
        version,
        name: fileName,
        path: filePath,
        sql,
        checksum: createHash("sha256").update(sql).digest("hex")
      };
    })
  );
}

export async function createPostgresClient(config: PostgresClientConfig = {}): Promise<QueryableDatabase> {
  const connectionString = config.connectionString ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to connect to PostgreSQL.");
  }

  const { Pool } = (await import("pg")) as typeof import("pg");

  return new Pool({
    connectionString,
    ssl: config.ssl ?? (process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined)
  });
}

export async function runMigrations(database: QueryableDatabase): Promise<MigrationResult> {
  const files = await loadSqlFiles(migrationsDir);
  const applied: string[] = [];
  const skipped: string[] = [];

  for (const migration of files) {
    const existing = await database.query<{ checksum: string }>(
      "SELECT checksum FROM schema_migrations WHERE version = $1",
      [migration.version]
    ).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);

      if (message.includes("schema_migrations")) {
        return { rows: [] };
      }

      throw error;
    });

    if (existing.rows[0]) {
      if (existing.rows[0].checksum !== migration.checksum) {
        throw new Error(`Migration ${migration.name} checksum differs from the applied version.`);
      }

      skipped.push(migration.name);
      continue;
    }

    await database.query(migration.sql);
    await database.query(
      "INSERT INTO schema_migrations (version, name, checksum) VALUES ($1, $2, $3)",
      [migration.version, migration.name, migration.checksum]
    );
    applied.push(migration.name);
  }

  return { applied, skipped };
}

export async function runSeeds(database: QueryableDatabase): Promise<MigrationResult> {
  const files = await loadSqlFiles(seedsDir);
  const applied: string[] = [];

  for (const seed of files) {
    await database.query(seed.sql);
    applied.push(seed.name);
  }

  return { applied, skipped: [] };
}

export async function closeDatabase(database: QueryableDatabase): Promise<void> {
  const maybePool = database as QueryableDatabase & { end?: () => Promise<void> };

  await maybePool.end?.();
}
