import { describe, expect, it } from 'vitest';
import { recordContentReport } from './contentReports';

describe('content error reports', () => {
  it('records content id and revision, and avoids repeated reports for one reason', () => {
    const first = recordContentReport([], 'exit-there-be-01', 1, 'answer', '2026-09-18T00:00:00.000Z');
    expect(first).toEqual([{ contentId: 'exit-there-be-01', contentVersion: 1, reason: 'answer', createdAt: '2026-09-18T00:00:00.000Z' }]);
    expect(recordContentReport(first, 'exit-there-be-01', 1, 'answer')).toBe(first);
    expect(recordContentReport(first, 'exit-there-be-01', 2, 'answer')).toHaveLength(2);
  });
});
