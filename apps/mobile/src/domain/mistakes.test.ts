import { describe, expect, it } from 'vitest';
import { DIAGNOSTIC_QUESTIONS, LESSONS_BY_SKILL } from '../data/seed';
import { activeMistakes, recordLessonAnswer } from './mistakes';

const lesson = LESSONS_BY_SKILL['present-simple'];
const wrongIndex = DIAGNOSTIC_QUESTIONS[0].correctOptionIndex === 0 ? 1 : 0;

describe('mistake notebook behavior', () => {
  it('stores a wrong lesson answer with enough context to review later', () => {
    const records = recordLessonAnswer([], lesson, wrongIndex, '2026-09-15T01:00:00.000Z');

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      questionId: lesson.question.id,
      lessonId: lesson.id,
      skillId: lesson.skillId,
      selectedOption: lesson.question.options[wrongIndex],
      correctOption: lesson.question.options[lesson.question.correctOptionIndex],
      attempts: 1,
      status: 'active',
    });
  });

  it('increments an existing active mistake instead of duplicating it', () => {
    const once = recordLessonAnswer([], lesson, wrongIndex, '2026-09-15T01:00:00.000Z');
    const twice = recordLessonAnswer(once, lesson, wrongIndex, '2026-09-15T02:00:00.000Z');

    expect(twice).toHaveLength(1);
    expect(twice[0].attempts).toBe(2);
    expect(twice[0].lastAnsweredAt).toBe('2026-09-15T02:00:00.000Z');
  });

  it('marks a mistake resolved after a correct retry', () => {
    const wrong = recordLessonAnswer([], lesson, wrongIndex, '2026-09-15T01:00:00.000Z');
    const fixed = recordLessonAnswer(wrong, lesson, lesson.question.correctOptionIndex, '2026-09-15T03:00:00.000Z');

    expect(fixed[0].status).toBe('resolved');
    expect(activeMistakes(fixed)).toEqual([]);
  });

  it('sorts active mistakes with the newest first', () => {
    const first = recordLessonAnswer([], lesson, wrongIndex, '2026-09-15T01:00:00.000Z');
    const otherLesson = LESSONS_BY_SKILL['there-be'];
    const second = recordLessonAnswer(first, otherLesson, 0, '2026-09-15T03:00:00.000Z');

    expect(activeMistakes(second).map((record) => record.lessonId)).toEqual([otherLesson.id, lesson.id]);
  });
});
