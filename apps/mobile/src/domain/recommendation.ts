import { skillScoresFromMastery } from './mastery';
import type { DiagnosticResult, LearningSkill, SkillScore, StoredAppState } from './models';

const DEFAULT_RECOMMENDED_SKILL_ID = 'present-simple';

export interface SkillRecommendation {
  skillId: string;
  targetSkillId: string;
  reason: 'fallback' | 'practice' | 'prerequisite';
}

export function recommendSkillId(
  result: DiagnosticResult | undefined,
  skills: Record<string, LearningSkill>,
  fallbackSkillId = DEFAULT_RECOMMENDED_SKILL_ID,
): string {
  return recommendSkillFromScores(result?.skillScores ?? [], skills, fallbackSkillId).skillId;
}

export function recommendSkillIdForState(
  state: Pick<StoredAppState, 'diagnostic' | 'masteryStates'>,
  skills: Record<string, LearningSkill>,
  fallbackSkillId = DEFAULT_RECOMMENDED_SKILL_ID,
): string {
  return recommendSkillForState(state, skills, fallbackSkillId).skillId;
}

export function recommendSkillForState(
  state: Pick<StoredAppState, 'diagnostic' | 'masteryStates'>,
  skills: Record<string, LearningSkill>,
  fallbackSkillId = DEFAULT_RECOMMENDED_SKILL_ID,
): SkillRecommendation {
  const masteryScores = skillScoresFromMastery(state.masteryStates);
  return recommendSkillFromScores(masteryScores.length ? masteryScores : state.diagnostic?.skillScores ?? [], skills, fallbackSkillId);
}

export function recommendSkillIdFromScores(
  skillScores: SkillScore[],
  skills: Record<string, LearningSkill>,
  fallbackSkillId = DEFAULT_RECOMMENDED_SKILL_ID,
): string {
  return recommendSkillFromScores(skillScores, skills, fallbackSkillId).skillId;
}

export function recommendSkillFromScores(
  skillScores: SkillScore[],
  skills: Record<string, LearningSkill>,
  fallbackSkillId = DEFAULT_RECOMMENDED_SKILL_ID,
): SkillRecommendation {
  const fallback: SkillRecommendation = { skillId: fallbackSkillId, targetSkillId: fallbackSkillId, reason: 'fallback' };
  if (!skillScores.length) return fallback;

  const scores = new Map(skillScores.map((score) => [score.skillId, score]));
  const candidates = [...skillScores].sort((a, b) => a.score - b.score || b.total - a.total);

  for (const candidate of candidates) {
    const skill = skills[candidate.skillId];
    if (!skill) continue;

    const weakPrerequisite = skill.prerequisiteIds.find((prerequisiteId) => {
      const prerequisiteScore = scores.get(prerequisiteId);
      return !prerequisiteScore || prerequisiteScore.score < 50;
    });

    return weakPrerequisite
      ? { skillId: weakPrerequisite, targetSkillId: candidate.skillId, reason: 'prerequisite' }
      : { skillId: candidate.skillId, targetSkillId: candidate.skillId, reason: 'practice' };
  }

  return fallback;
}
