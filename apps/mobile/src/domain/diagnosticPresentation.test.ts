import { describe, expect, it } from 'vitest';
import { evidenceConfidence, learningBand, sortSkillsForReview } from './diagnosticPresentation';

describe('diagnostic presentation', () => {
  it('does not infer mastery from a single observation', () => {
    expect(learningBand(0, 1)).toBe('Đang quan sát');
    expect(learningBand(100, 1)).toBe('Đang quan sát');
    expect(learningBand(100, 2)).toBe('Có tín hiệu tốt');
    expect(learningBand(80, 4)).toBe('Khá vững');
  });

  it('keeps confidence low when evidence is sparse', () => {
    expect(evidenceConfidence(1)).toBe('Cần thêm lượt làm');
    expect(evidenceConfidence(2)).toBe('Đang rõ dần');
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
