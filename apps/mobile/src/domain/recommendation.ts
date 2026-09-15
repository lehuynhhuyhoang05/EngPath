import { skillScoresFromMastery } from './mastery';
import type { DiagnosticResult, LearningSkill, SkillScore, StoredAppState } from './models';

const DEFAULT_RECOMMENDED_SKILL_ID = 'present-simple';

export function recommendSkillId(
  result: DiagnosticResult | undefined,
  skills: Record<string, LearningSkill>,
  fallbackSkillId = DEFAULT_RECOMMENDED_SKILL_ID,
): string {
  return recommendSkillIdFromScores(result?.skillScores ?? [], skills, fallbackSkillId);
}

export function recommendSkillIdForState(
  state: Pick<StoredAppState, 'diagnostic' | 'masteryStates'>,
  skills: Record<string, LearningSkill>,
  fallbackSkillId = DEFAULT_RECOMMENDED_SKILL_ID,
): string {
  const masteryScores = skillScoresFromMastery(state.masteryStates);
  return recommendSkillIdFromScores(masteryScores.length ? masteryScores : state.diagnostic?.skillScores ?? [], skills, fallbackSkillId);
}

export function recommendSkillIdFromScores(
  skillScores: SkillScore[],
  skills: Record<string, LearningSkill>,
  fallbackSkillId = DEFAULT_RECOMMENDED_SKILL_ID,
): string {
  if (!skillScores.length) return fallbackSkillId;

  const scores = new Map(skillScores.map((score) => [score.skillId, score]));
  const candidates = [...skillScores].sort((a, b) => a.score - b.score || b.total - a.total);

  for (const candidate of candidates) {
    const skill = skills[candidate.skillId];
    if (!skill) continue;

    const weakPrerequisite = skill.prerequisiteIds.find((prerequisiteId) => {
      const prerequisiteScore = scores.get(prerequisiteId);
      return !prerequisiteScore || prerequisiteScore.score < 50;
    });

    return weakPrerequisite ?? candidate.skillId;
  }

  return fallbackSkillId;
}
