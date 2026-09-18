import { describe, expect, it } from 'vitest';
import { CATALOGUE, CONTENT_SCHEMA_VERSION, validatePrototypeCatalogue } from './catalogue';
import { EXAM_SAMPLE_QUESTIONS, EXAM_SAMPLE_TEMPLATE, scoreExamSample, validateExamSample } from './examSample';
import { diagnosticQuestionsForGrade, LESSONS_BY_SKILL, SKILLS } from './seed';

describe('M3 prototype catalogue', () => {
  it('has two lesson topics per grade and valid references', () => {
    expect(CATALOGUE.schemaVersion).toBe(CONTENT_SCHEMA_VERSION);
    expect(CATALOGUE.revision).toBeGreaterThan(0);
    for (const grade of [6, 7, 8, 9]) {
      expect(Object.values(LESSONS_BY_SKILL).filter((lesson) => lesson.grade === grade).length).toBeGreaterThanOrEqual(2);
      expect(diagnosticQuestionsForGrade(grade as 6 | 7 | 8 | 9).length).toBeGreaterThanOrEqual(8);
      expect(diagnosticQuestionsForGrade(grade as 6 | 7 | 8 | 9).length).toBeLessThanOrEqual(15);
    }
    expect(validatePrototypeCatalogue()).toEqual([]);
  });

  it('keeps exam content as an original, unreviewed practice sample', () => {
    expect(EXAM_SAMPLE_TEMPLATE.kind).toBe('practice-sample');
    expect(EXAM_SAMPLE_TEMPLATE.status).toBe('draft');
    expect(EXAM_SAMPLE_TEMPLATE.source.title).toContain('not an official provincial exam');
    expect(EXAM_SAMPLE_QUESTIONS.every((question) => question.status === 'draft')).toBe(true);
  });

  it('scores correct, wrong and unanswered questions deterministically by skill', () => {
    const [conditional, relative, reading] = EXAM_SAMPLE_QUESTIONS;
    const result = scoreExamSample(EXAM_SAMPLE_TEMPLATE, EXAM_SAMPLE_QUESTIONS, {
      [conditional.id]: conditional.correctOptionIndex,
      [relative.id]: relative.correctOptionIndex === 0 ? 1 : 0,
    });
    expect(result).toEqual({
      earned: 1,
      possible: 3,
      bySkill: {
        'first-conditional': { earned: 1, possible: 1 },
        'relative-clause': { earned: 0, possible: 1 },
        'reading-main-idea': { earned: 0, possible: 1 },
      },
    });
    expect(reading.id).toBe('exam-sample-reading-01');
  });

  it('blocks incompatible question ids and unsupported publication claims', () => {
    const incompatible = { ...EXAM_SAMPLE_TEMPLATE, questionIds: ['missing-question'] };
    expect(validateExamSample(incompatible, EXAM_SAMPLE_QUESTIONS, SKILLS).map((issue) => issue.code)).toContain('exam-question-ids');
    expect(() => scoreExamSample(incompatible, EXAM_SAMPLE_QUESTIONS, {})).toThrow('do not match');

    const falseProvinceClaim = { ...EXAM_SAMPLE_TEMPLATE, kind: 'province-specific' as const, status: 'published' as const };
    const codes = validateExamSample(falseProvinceClaim, EXAM_SAMPLE_QUESTIONS, SKILLS).map((issue) => issue.code);
    expect(codes).toContain('exam-provenance');
    expect(codes).toContain('exam-unpublished-question');
    expect(codes).toContain('exam-independent-reviews');
    expect(codes).toContain('missing-reviewer');
  });

  it('allows a reviewed practice sample only with two distinct passing reviewers', () => {
    const source = { title: 'Original EngPath practice sample checked by educators' };
    const review = { reviewerId: 'educator-01', reviewedAt: '2026-09-18' };
    const publishedQuestions = EXAM_SAMPLE_QUESTIONS.map((question) => ({ ...question, source, review, status: 'published' as const, version: 3 }));
    const template = {
      ...EXAM_SAMPLE_TEMPLATE, source, review, status: 'published' as const, version: 3,
      independentReviews: [
        { reviewerId: 'educator-01', reviewedAt: '2026-09-18', decision: 'pass' as const },
        { reviewerId: 'educator-02', reviewedAt: '2026-09-18', decision: 'pass' as const },
      ],
    };
    expect(validateExamSample(template, publishedQuestions, SKILLS)).toEqual([]);
    expect(validateExamSample({ ...template, independentReviews: [template.independentReviews[0], template.independentReviews[0]] }, publishedQuestions, SKILLS).map((issue) => issue.code)).toContain('exam-independent-reviews');
    expect(validateExamSample({ ...template, independentReviews: [...template.independentReviews, { reviewerId: 'educator-03', reviewedAt: '2026-09-18', decision: 'reject' as const }] }, publishedQuestions, SKILLS).map((issue) => issue.code)).toContain('exam-unresolved-review');
  });
});
