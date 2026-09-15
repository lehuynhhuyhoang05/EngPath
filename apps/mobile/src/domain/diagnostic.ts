import type { ChoiceQuestion, DiagnosticResult, SkillScore } from './models';

export function scoreDiagnostic(
  questions: ChoiceQuestion[],
  answers: Record<string, number>,
  completedAt = new Date().toISOString(),
): DiagnosticResult {
  if (questions.length === 0) throw new Error('A diagnostic requires at least one question.');

  const aggregate = new Map<string, { correct: number; total: number }>();
  let totalCorrect = 0;

  for (const question of questions) {
    const isCorrect = answers[question.id] === question.correctOptionIndex;
    const current = aggregate.get(question.skillId) ?? { correct: 0, total: 0 };
    aggregate.set(question.skillId, {
      correct: current.correct + (isCorrect ? 1 : 0),
      total: current.total + 1,
    });
    totalCorrect += isCorrect ? 1 : 0;
  }

  const skillScores: SkillScore[] = [...aggregate.entries()].map(([skillId, value]) => ({
    skillId,
    correct: value.correct,
    total: value.total,
    score: Math.round((value.correct / value.total) * 100),
  }));
  const strongest = [...skillScores].sort((a, b) => b.score - a.score)[0];
  const weakest = [...skillScores].sort((a, b) => a.score - b.score)[0];

  return {
    overallScore: Math.round((totalCorrect / questions.length) * 100),
    strongestSkillId: strongest.skillId,
    weakestSkillId: weakest.skillId,
    skillScores,
    completedAt,
  };
}

