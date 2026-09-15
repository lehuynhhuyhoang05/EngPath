import { describe, expect, it } from 'vitest';
import type { ChoiceQuestion } from '../domain/models';
import { validateCatalogue, validateContent } from './contentValidation';
import { DIAGNOSTIC_QUESTIONS, LESSONS_BY_SKILL, PRONUNCIATION_PROMPT, SKILLS } from './seed';

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
});
