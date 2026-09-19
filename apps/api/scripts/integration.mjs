import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import pg from 'pg';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required for integration tests.');

const port = 34071;
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['dist/main.js'], {
  env: { ...process.env, PORT: String(port) },
  stdio: 'inherit',
});
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const guests = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForHealth() {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`API exited before health check (${server.exitCode}).`);
    try {
      const response = await fetch(`${baseUrl}/v1/health`);
      if (response.ok) return response.json();
    } catch { /* Wait for startup. */ }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error('API did not become healthy.');
}

try {
  const health = await waitForHealth();
  assert(health.status === 'ok' && health.apiVersion === 1, 'Wrong health contract.');

  const guestResponse = await fetch(`${baseUrl}/v1/guest-sessions`, { method: 'POST' });
  assert(guestResponse.status === 201, 'Guest session was not created.');
  const { guestId, accessToken } = await guestResponse.json();
  guests.push(guestId);
  const body = {
    contentId: `diag-integration-${randomUUID()}`,
    contentVersion: 2,
    reason: 'answer',
    createdAt: '2026-09-19T08:00:00.000Z',
  };
  const unauthorized = await fetch(`${baseUrl}/v1/content-reports`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  assert(unauthorized.status === 401, 'Report endpoint accepted a missing token.');

  const send = () => fetch(`${baseUrl}/v1/content-reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body),
  });
  const first = await send();
  const second = await send();
  assert(first.status === 200 && second.status === 200, 'Report endpoint failed.');
  const firstResult = await first.json();
  const secondResult = await second.json();
  assert(firstResult.id === secondResult.id && firstResult.duplicate === false && secondResult.duplicate === true, 'Report retry was not idempotent.');
  const result = await pool.query('SELECT count(*)::integer AS count FROM content_reports WHERE guest_id = $1', [guestId]);
  assert(result.rows[0].count === 1, 'Retry created a duplicate database row.');
  console.log('EngPath API PostgreSQL integration passed');
} finally {
  for (const id of guests) await pool.query('DELETE FROM guest_sessions WHERE id = $1', [id]);
  await pool.end();
  server.kill();
}
