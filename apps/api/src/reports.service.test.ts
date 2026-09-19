import { describe, expect, it, vi } from 'vitest';
import type { DatabaseService } from './database.service.js';
import { ReportsService } from './reports.service.js';

describe('content report idempotency', () => {
  it('returns the same report ID for a retry without creating a second row', async () => {
    let inserted = false;
    const query = vi.fn(async (sql: string) => {
      if (sql.includes('INSERT INTO content_reports')) {
        if (inserted) return [];
        inserted = true;
        return [{ id: 'report-01', reported_at: new Date() }];
      }
      return [{ id: 'report-01', reported_at: new Date() }];
    });
    const service = new ReportsService({ query } as unknown as DatabaseService);
    const report = { contentId: 'diag-relative-clause-01', contentVersion: 2, reason: 'answer' as const, createdAt: '2026-09-19T08:00:00.000Z' };
    expect(await service.save('guest-01', report)).toEqual({ id: 'report-01', duplicate: false });
    expect(await service.save('guest-01', report)).toEqual({ id: 'report-01', duplicate: true });
    expect(query).toHaveBeenCalledTimes(3);
  });
});
