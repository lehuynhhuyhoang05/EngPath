import type { SkillScore } from './models';

export type LearningBand = 'Cần củng cố' | 'Đang hình thành' | 'Khá vững';
export type EvidenceConfidence = 'Thấp' | 'Đang tăng' | 'Đủ để định hướng';

export function learningBand(score: number): LearningBand {
  if (score < 50) return 'Cần củng cố';
  if (score < 80) return 'Đang hình thành';
  return 'Khá vững';
}

export function evidenceConfidence(observations: number): EvidenceConfidence {
  if (observations < 2) return 'Thấp';
  if (observations < 4) return 'Đang tăng';
  return 'Đủ để định hướng';
}

export function sortSkillsForReview(scores: SkillScore[]): SkillScore[] {
  return [...scores].sort((a, b) => a.score - b.score || a.total - b.total);
}
