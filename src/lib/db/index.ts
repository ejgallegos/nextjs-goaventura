import 'server-only';

import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';
import { z } from 'zod';

const databaseEnvSchema = z.object({
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
});

type Database = PostgresJsDatabase;

let sqlClient: Sql | null = null;
let database: Database | null = null;

function getDatabaseUrl(): string {
  const result = databaseEnvSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
  });

  if (!result.success) {
    throw new Error('DATABASE_URL must be a valid postgresql:// URL');
  }

  return result.data.DATABASE_URL;
}

/** Creates the client on first use, avoiding build/import-time connections. */
export function getDb(): Database {
  if (database) {
    return database;
  }

  sqlClient = postgres(getDatabaseUrl(), {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  database = drizzle(sqlClient);

  return database;
}

/** Closes the lazily-created pool for scripts and graceful shutdowns. */
export async function closeDb(): Promise<void> {
  if (sqlClient) {
    await sqlClient.end({ timeout: 5 });
    sqlClient = null;
    database = null;
  }
}
