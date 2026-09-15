import { describe, expect, it } from 'vitest';
import { DIAGNOSTIC_QUESTIONS } from '../data/seed';
import { scoreDiagnostic } from './diagnostic';

describe('scoreDiagnostic', () => {
  it('calculates overall and per-skill scores deterministically', () => {
    const questions = DIAGNOSTIC_QUESTIONS.slice(0, 3);
    const answers = {
      [questions[0].id]: questions[0].correctOptionIndex,
      [questions[1].id]: questions[1].correctOptionIndex,
      [questions[2].id]: -1,
    };
    const result = scoreDiagnostic(questions, answers, '2026-09-14T00:00:00.000Z');
    expect(result.overallScore).toBe(67);
    expect(result.strongestSkillId).toBe('present-simple');
    expect(result.weakestSkillId).toBe('there-be');
  });

  it('rejects an empty diagnostic', () => {
    expect(() => scoreDiagnostic([], {})).toThrow('at least one question');
  });
});

