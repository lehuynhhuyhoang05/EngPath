import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from './database.service.js';

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export function hashGuestToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class GuestService {
  constructor(private readonly db: DatabaseService) {}

  async create(): Promise<{ guestId: string; accessToken: string }> {
    const guestId = randomUUID();
    const accessToken = randomBytes(32).toString('base64url');
    await this.db.query('INSERT INTO guest_sessions (id, token_hash) VALUES ($1, $2)', [guestId, hashGuestToken(accessToken)]);
    return { guestId, accessToken };
  }

  async requireGuest(authorization: string | undefined): Promise<string> {
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!TOKEN_PATTERN.test(token)) throw new UnauthorizedException('A valid guest token is required.');
    const rows = await this.db.query<{ id: string }>('SELECT id FROM guest_sessions WHERE token_hash = $1', [hashGuestToken(token)]);
    if (!rows.length) throw new UnauthorizedException('Guest token was not found.');
    return rows[0].id;
  }
}
