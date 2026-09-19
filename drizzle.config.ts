import "dotenv/config";

import { defineConfig } from "drizzle-kit";

const migrationConnectionString =
  process.env.MIGRATION_DATABASE_URL;

if (!migrationConnectionString) {
  throw new Error(
    "MIGRATION_DATABASE_URL is required to run drizzle commands",
  );
}

export default defineConfig({
  schema: [
    "./drizzle/schema.ts",
    "./drizzle/auth-schema.ts",
  ],

  out: "./drizzle",

  dialect: "postgresql",

  dbCredentials: {
    url: migrationConnectionString,
  },
});