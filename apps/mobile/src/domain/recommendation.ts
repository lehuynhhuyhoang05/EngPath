import type { DiagnosticResult, LearningSkill } from './models';

const DEFAULT_RECOMMENDED_SKILL_ID = 'present-simple';

export function recommendSkillId(
  result: DiagnosticResult | undefined,
  skills: Record<string, LearningSkill>,
  fallbackSkillId = DEFAULT_RECOMMENDED_SKILL_ID,
): string {
  if (!result?.skillScores.length) return fallbackSkillId;

  const scores = new Map(result.skillScores.map((score) => [score.skillId, score]));
  const candidates = [...result.skillScores].sort((a, b) => a.score - b.score || b.total - a.total);

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
