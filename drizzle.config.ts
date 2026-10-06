import { defineConfig } from "drizzle-kit";
import * as path from "path";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "dev.db",
  },
});
