import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import pg from 'pg';

const direction = process.argv[2];
if (direction !== 'up' && direction !== 'down') throw new Error('Specify up or down.');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');

const base = path.dirname(fileURLToPath(import.meta.url));
const filename = path.join(base, '..', 'migrations', `0001_guest_reports.${direction}.sql`);
const sql = await readFile(filename, 'utf8');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
try {
  await pool.query(sql);
  console.log(`Migration 0001 ${direction} complete.`);
} finally {
  await pool.end();
}
