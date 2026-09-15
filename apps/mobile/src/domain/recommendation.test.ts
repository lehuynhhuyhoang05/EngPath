import { describe, expect, it } from 'vitest';
import type { DiagnosticResult } from './models';
import { recommendSkillId } from './recommendation';

const skills = {
  foundation: { id: 'foundation', title: 'Foundation', area: 'Ngữ pháp' as const, minimumGrade: 6 as const, prerequisiteIds: [] },
  target: { id: 'target', title: 'Target', area: 'Ngữ pháp' as const, minimumGrade: 9 as const, prerequisiteIds: ['foundation'] },
  other: { id: 'other', title: 'Other', area: 'Ngữ pháp' as const, minimumGrade: 7 as const, prerequisiteIds: [] },
};

function result(skillScores: DiagnosticResult['skillScores']): DiagnosticResult {
  return {
    overallScore: 45,
    strongestSkillId: 'other',
    weakestSkillId: 'target',
    skillScores,
    completedAt: '2026-09-15T00:00:00.000Z',
  };
}

describe('recommendSkillId', () => {
  it('falls back before diagnostic evidence exists', () => {
    expect(recommendSkillId(undefined, skills, 'foundation')).toBe('foundation');
  });

  it('recommends the weakest skill when prerequisites are satisfied', () => {
    expect(recommendSkillId(result([
      { skillId: 'foundation', score: 80, correct: 4, total: 5 },
      { skillId: 'target', score: 40, correct: 2, total: 5 },
    ]), skills)).toBe('target');
  });

  it('repairs a weak prerequisite before the higher-level weak skill', () => {
    expect(recommendSkillId(result([
      { skillId: 'foundation', score: 25, correct: 1, total: 4 },
      { skillId: 'target', score: 40, correct: 2, total: 5 },
    ]), skills)).toBe('foundation');
  });

  it('treats an unobserved prerequisite as a repair candidate', () => {
    expect(recommendSkillId(result([
      { skillId: 'target', score: 20, correct: 1, total: 5 },
    ]), skills)).toBe('foundation');
  });
});
