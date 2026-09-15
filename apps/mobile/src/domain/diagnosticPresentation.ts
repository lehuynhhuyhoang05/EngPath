import type { SkillScore } from './models';

export type LearningBand = 'Đang quan sát' | 'Cần củng cố' | 'Đang hình thành' | 'Có tín hiệu tốt' | 'Khá vững';
export type EvidenceConfidence = 'Cần thêm lượt làm' | 'Đang rõ dần' | 'Đủ để định hướng';

export function learningBand(score: number, observations: number): LearningBand {
  if (observations < 2) return 'Đang quan sát';
  if (score < 50) return 'Cần củng cố';
  if (score < 80) return 'Đang hình thành';
  if (observations < 4) return 'Có tín hiệu tốt';
  return 'Khá vững';
}

export function evidenceConfidence(observations: number): EvidenceConfidence {
  if (observations < 2) return 'Cần thêm lượt làm';
  if (observations < 4) return 'Đang rõ dần';
  return 'Đủ để định hướng';
}

export function sortSkillsForReview(scores: SkillScore[]): SkillScore[] {
  return [...scores].sort((a, b) => a.score - b.score || a.total - b.total);
}
