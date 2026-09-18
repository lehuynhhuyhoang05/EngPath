import { describe, expect, it } from 'vitest';
import type { ChoiceQuestion } from '../domain/models';
import { validateCatalogue, validateContent, validateContentRevision, validateSkillGraph } from './contentValidation';
import { diagnosticQuestionsForGrade, DIAGNOSTIC_QUESTIONS, LESSONS_BY_SKILL, PRONUNCIATION_PROMPT, SKILLS } from './seed';

describe('prototype learning content', () => {
  it('keeps objective questions structurally valid', () => {
    expect(validateCatalogue([
      ...DIAGNOSTIC_QUESTIONS,
      ...Object.values(LESSONS_BY_SKILL),
      PRONUNCIATION_PROMPT,
    ], SKILLS)).toEqual([]);
  });

  it('does not mark AI-assisted prototype content as published', () => {
    const content = [...DIAGNOSTIC_QUESTIONS, PRONUNCIATION_PROMPT];
    for (const item of content) {
      expect(item.authoringMethod).toBe('ai-assisted');
      expect(item.status).toBe('draft');
    }
  });

  it('teaches with a separate exit check for every seeded lesson', () => {
    const diagnosticIds = new Set(DIAGNOSTIC_QUESTIONS.map((item) => item.id));
    for (const lesson of Object.values(LESSONS_BY_SKILL)) {
      expect(lesson.learningObjectiveVi.length).toBeGreaterThan(20);
      expect(lesson.example).not.toContain('___');
      expect(diagnosticIds.has(lesson.question.id)).toBe(false);
      expect(lesson.question.prompt).not.toBe(lesson.example);
    }
  });

  it('preserves the original diagnostic order when extending a saved draft', () => {
    const originalGrade9 = [
      'diag-present-simple-01', 'diag-present-simple-02', 'diag-there-be-01', 'diag-past-simple-01',
      'diag-adverb-01', 'diag-comparison-01', 'diag-present-perfect-01',
      'diag-relative-clause-01', 'diag-first-conditional-01',
    ];
    expect(diagnosticQuestionsForGrade(9).slice(0, 9).map((item) => item.id)).toEqual(originalGrade9);
    expect(diagnosticQuestionsForGrade(6).slice(0, 4).map((item) => item.id)).toEqual(originalGrade9.slice(0, 4));
  });

  it('targets a pronunciation feature that exists in the scripted sentence', () => {
    expect(PRONUNCIATION_PROMPT.targetFeatures).toContain('phoneme-th-voiceless');
    expect(PRONUNCIATION_PROMPT.text.toLowerCase()).toContain('th');
  });

  it('rejects duplicate options after normalization', () => {
    const invalidQuestion: ChoiceQuestion = {
      ...DIAGNOSTIC_QUESTIONS[0],
      id: 'invalid-duplicate-options',
      options: ['does', ' Does ', 'did'],
    };

    expect(validateContent(invalidQuestion, SKILLS).map((issue) => issue.code)).toContain('duplicate-options');
  });

  it('blocks published content without human review evidence', () => {
    const invalidQuestion: ChoiceQuestion = {
      ...DIAGNOSTIC_QUESTIONS[0],
      id: 'invalid-published-question',
      status: 'published',
      review: {},
    };

    const codes = validateContent(invalidQuestion, SKILLS).map((issue) => issue.code);
    expect(codes).toContain('missing-reviewer');
    expect(codes).toContain('missing-review-date');
    expect(codes).toContain('placeholder-source');
  });

  it('checks the nested exit question and its id', () => {
    const lesson = LESSONS_BY_SKILL['there-be'];
    const invalid = { ...lesson, question: { ...lesson.question, id: DIAGNOSTIC_QUESTIONS[0].id, options: ['are', ' ARE '] } };
    const codes = validateCatalogue([DIAGNOSTIC_QUESTIONS[0], invalid], SKILLS).map((entry) => entry.code);
    expect(codes).toContain('duplicate-id');
    expect(codes).toContain('duplicate-options');
  });

  it('rejects cycles and references to future skills', () => {
    const invalid = {
      ...SKILLS,
      'present-simple': { ...SKILLS['present-simple'], prerequisiteIds: ['relative-clause'] },
    };
    const codes = validateSkillGraph(invalid).map((entry) => entry.code);
    expect(codes).toContain('skill-cycle');
    expect(codes).toContain('future-prerequisite');
  });

  it('requires an incremented, reviewed revision before publication', () => {
    const original = DIAGNOSTIC_QUESTIONS[0];
    const premature = { ...original, status: 'published' as const, version: 2 };
    const codes = validateContentRevision(original, premature, SKILLS).map((entry) => entry.code);
    expect(codes).toContain('invalid-status-transition');
    expect(codes).toContain('missing-reviewer');

    const reviewed = { ...original, status: 'reviewed' as const, version: 2, source: { title: 'EngPath original practice sentence reviewed by educator' }, review: { reviewerId: 'educator-01', reviewedAt: '2026-09-18' } };
    expect(validateContentRevision(original, reviewed, SKILLS)).toEqual([]);
    const published = { ...reviewed, status: 'published' as const, version: 3 };
    expect(validateContentRevision(reviewed, published, SKILLS)).toEqual([]);
    const changedAnswer = { ...published, correctOptionIndex: 0 };
    expect(validateContentRevision(reviewed, changedAnswer, SKILLS).map((entry) => entry.code)).toContain('changed-after-review');
  });
});
