import type { DiagnosticResult, Lesson, MasteryConfidence, MasteryState, SkillScore } from './models';

export function confidenceFromObservations(observations: number): MasteryConfidence {
  if (observations < 2) return 'low';
  if (observations < 4) return 'medium';
  return 'high';
}

export function masteryStatesFromDiagnostic(result: DiagnosticResult): Record<string, MasteryState> {
  return Object.fromEntries(result.skillScores.map((score) => [score.skillId, {
    ...score,
    confidence: confidenceFromObservations(score.total),
    updatedAt: result.completedAt,
  }]));
}

export function updateMasteryWithLessonAnswer(
  states: Record<string, MasteryState>,
  lesson: Lesson,
  selectedOptionIndex: number,
  answeredAt = new Date().toISOString(),
): Record<string, MasteryState> {
  const correct = selectedOptionIndex === lesson.question.correctOptionIndex;
  const current = states[lesson.skillId];
  const previousScore = current?.score ?? 50;
  const resultScore = correct ? 100 : 0;
  const total = (current?.total ?? 0) + 1;
  const correctCount = (current?.correct ?? 0) + (correct ? 1 : 0);

  return {
    ...states,
    [lesson.skillId]: {
      skillId: lesson.skillId,
      score: Math.round(previousScore * 0.7 + resultScore * 0.3),
      correct: correctCount,
      total,
      confidence: confidenceFromObservations(total),
      updatedAt: answeredAt,
    },
  };
}

export function skillScoresFromMastery(states: Record<string, MasteryState>): SkillScore[] {
  return Object.values(states).map(({ skillId, score, correct, total }) => ({ skillId, score, correct, total }));
}
