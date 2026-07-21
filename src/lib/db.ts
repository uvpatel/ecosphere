import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '@/schema/schema';


const sql = neon(process.env.DATABASE_URL!);

// Initialize Drizzle ORM with the neon client using the config object signature
export const db = drizzle({ client: sql, schema } as any);
export type DbClient = typeof db;
export * as schema from '@/schema/schema';
