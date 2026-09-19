import { describe, expect, it, vi } from 'vitest';
import { GuestService, hashGuestToken } from './guest.service.js';
import type { DatabaseService } from './database.service.js';

describe('guest session token', () => {
  it('stores a hash, never the bearer token, and resolves only that token', async () => {
    const query = vi.fn(async (_sql: string, values: unknown[]) => {
      if (_sql.startsWith('INSERT')) return [];
      return values[0] === storedHash ? [{ id: guestId }] : [];
    });
    const service = new GuestService({ query } as unknown as DatabaseService);
    const { guestId, accessToken } = await service.create();
    const storedHash = query.mock.calls[0][1][1];
    expect(accessToken).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(storedHash).toBe(hashGuestToken(accessToken));
    expect(storedHash).not.toBe(accessToken);
    expect(await service.requireGuest(`Bearer ${accessToken}`)).toBe(guestId);
    await expect(service.requireGuest('Bearer invalid')).rejects.toThrow();
  });
});
