import { describe, expect, it } from 'vitest';
import { parseContentReportInput } from './report-input.js';

const valid = { contentId: 'diag-relative-clause-01', contentVersion: 2, reason: 'answer', createdAt: '2026-09-19T08:00:00.000Z' };

describe('content report input', () => {
  it('accepts a locally stored report without changing its content identity', () => {
    expect(parseContentReportInput(valid)).toEqual(valid);
  });

  it.each([
    { ...valid, contentId: '../private' },
    { ...valid, contentVersion: 0 },
    { ...valid, contentVersion: 1.5 },
    { ...valid, reason: 'audio' },
    { ...valid, createdAt: 'not-a-date' },
    null,
  ])('rejects invalid payload %j', (input) => {
    expect(() => parseContentReportInput(input)).toThrow();
  });
});
