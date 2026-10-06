import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";
import path from 'path';

const sqlite = new Database(path.resolve(process.cwd(), 'dev.db'));
export const db = drizzle(sqlite, { schema });
