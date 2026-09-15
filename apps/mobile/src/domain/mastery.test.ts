import { describe, expect, it } from 'vitest';
import { LESSONS_BY_SKILL } from '../data/seed';
import type { DiagnosticResult } from './models';
import { confidenceFromObservations, masteryStatesFromDiagnostic, skillScoresFromMastery, updateMasteryWithLessonAnswer } from './mastery';

describe('mastery model v1', () => {
  it('maps observations to confidence levels', () => {
    expect(confidenceFromObservations(1)).toBe('low');
    expect(confidenceFromObservations(2)).toBe('medium');
    expect(confidenceFromObservations(4)).toBe('high');
  });

  it('creates mastery states from a diagnostic result', () => {
    const result: DiagnosticResult = {
      overallScore: 50,
      strongestSkillId: 'present-simple',
      weakestSkillId: 'there-be',
      skillScores: [
        { skillId: 'present-simple', score: 50, correct: 1, total: 2 },
      ],
      completedAt: '2026-09-15T01:00:00.000Z',
    };

    expect(masteryStatesFromDiagnostic(result)['present-simple']).toEqual({
      skillId: 'present-simple',
      score: 50,
      correct: 1,
      total: 2,
      confidence: 'medium',
      updatedAt: '2026-09-15T01:00:00.000Z',
    });
  });

  it('updates lesson mastery with the deterministic 70/30 rule', () => {
    const lesson = LESSONS_BY_SKILL['present-simple'];
    const afterCorrect = updateMasteryWithLessonAnswer({
      'present-simple': {
        skillId: 'present-simple',
        score: 50,
        correct: 1,
        total: 2,
        confidence: 'medium',
        updatedAt: '2026-09-15T01:00:00.000Z',
      },
    }, lesson, lesson.question.correctOptionIndex, '2026-09-15T02:00:00.000Z');

    expect(afterCorrect['present-simple']).toMatchObject({
      score: 65,
      correct: 2,
      total: 3,
      confidence: 'medium',
    });
  });

  it('does not turn one standalone correct answer into high confidence', () => {
    const lesson = LESSONS_BY_SKILL['present-simple'];
    const states = updateMasteryWithLessonAnswer({}, lesson, lesson.question.correctOptionIndex);

    expect(states['present-simple'].score).toBe(65);
    expect(states['present-simple'].confidence).toBe('low');
  });

  it('exposes mastery as skill scores for recommendation and progress', () => {
    const lesson = LESSONS_BY_SKILL['present-simple'];
    const states = updateMasteryWithLessonAnswer({}, lesson, lesson.question.correctOptionIndex);

    expect(skillScoresFromMastery(states)).toEqual([
      { skillId: 'present-simple', score: 65, correct: 1, total: 1 },
    ]);
  });
});
