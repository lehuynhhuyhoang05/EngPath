import type { Lesson, MistakeRecord } from './models';

export function recordLessonAnswer(
  records: MistakeRecord[],
  lesson: Lesson,
  selectedOptionIndex: number,
  answeredAt = new Date().toISOString(),
): MistakeRecord[] {
  const question = lesson.question;
  const correct = selectedOptionIndex === question.correctOptionIndex;
  const existing = records.find((record) => record.questionId === question.id);
  const others = records.filter((record) => record.questionId !== question.id);

  if (correct) {
    if (!existing) return records;
    return [
      {
        ...existing,
        selectedOption: question.options[selectedOptionIndex],
        attempts: existing.attempts + 1,
        lastAnsweredAt: answeredAt,
        status: 'resolved',
      },
      ...others,
    ];
  }

  const nextRecord: MistakeRecord = {
    questionId: question.id,
    lessonId: lesson.id,
    skillId: lesson.skillId,
    prompt: question.prompt,
    selectedOption: question.options[selectedOptionIndex],
    correctOption: question.options[question.correctOptionIndex],
    explanationVi: question.explanationVi,
    commonErrorVi: question.commonErrorVi,
    attempts: (existing?.attempts ?? 0) + 1,
    lastAnsweredAt: answeredAt,
    status: 'active',
  };

  return [nextRecord, ...others];
}

export function activeMistakes(records: MistakeRecord[]): MistakeRecord[] {
  return records
    .filter((record) => record.status === 'active')
    .sort((a, b) => b.lastAnsweredAt.localeCompare(a.lastAnsweredAt));
}
