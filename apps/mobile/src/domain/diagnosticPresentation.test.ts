import { describe, expect, it } from 'vitest';
import { evidenceConfidence, learningBand, sortSkillsForReview } from './diagnosticPresentation';

describe('diagnostic presentation', () => {
  it('uses learning bands instead of exposing false precision', () => {
    expect(learningBand(0)).toBe('Cần củng cố');
    expect(learningBand(50)).toBe('Đang hình thành');
    expect(learningBand(80)).toBe('Khá vững');
  });

  it('keeps confidence low when evidence is sparse', () => {
    expect(evidenceConfidence(1)).toBe('Thấp');
    expect(evidenceConfidence(2)).toBe('Đang tăng');
    expect(evidenceConfidence(4)).toBe('Đủ để định hướng');
  });

  it('prioritizes the weakest observed skill', () => {
    const result = sortSkillsForReview([
      { skillId: 'strong', score: 100, correct: 1, total: 1 },
      { skillId: 'weak', score: 0, correct: 0, total: 2 },
    ]);
    expect(result[0].skillId).toBe('weak');
  });
});
