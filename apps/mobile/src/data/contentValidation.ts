import type { ChoiceQuestion, ContentMetadata, LearningSkill, Lesson, PronunciationPrompt } from '../domain/models';

export type StudentContent = ChoiceQuestion | Lesson | PronunciationPrompt;

export interface ContentIssue {
  code: string;
  contentId: string;
  message: string;
}

const stableIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const placeholderPattern = /pending|requires? (?:educator )?review|chưa (?:duyệt|xác minh)/i;

function issue(contentId: string, code: string, message: string): ContentIssue {
  return { code, contentId, message };
}

function isNonEmpty(value: string | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidIsoDate(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

function validateMetadata(item: ContentMetadata, skills: Record<string, LearningSkill>): ContentIssue[] {
  const issues: ContentIssue[] = [];

  if (!stableIdPattern.test(item.id)) {
    issues.push(issue(item.id, 'invalid-id', 'Content id must be stable kebab-case.'));
  }
  if (!Number.isInteger(item.version) || item.version < 1) {
    issues.push(issue(item.id, 'invalid-version', 'Content version must be a positive integer.'));
  }
  if (item.skills.length === 0) {
    issues.push(issue(item.id, 'missing-skill', 'Content must reference at least one skill.'));
  }

  for (const skillId of [...item.skills, ...item.prerequisites]) {
    if (!skills[skillId]) {
      issues.push(issue(item.id, 'unknown-skill', `Unknown skill reference: ${skillId}.`));
    }
  }

  for (const skillId of item.skills) {
    const skill = skills[skillId];
    if (skill && item.grade < skill.minimumGrade) {
      issues.push(issue(item.id, 'grade-before-skill', `Grade ${item.grade} is below the minimum grade for ${skillId}.`));
    }
  }

  if (!isNonEmpty(item.source.title)) {
    issues.push(issue(item.id, 'missing-source', 'Content must include a source or source rationale.'));
  }
  if (item.source.url) {
    try {
      new URL(item.source.url);
    } catch {
      issues.push(issue(item.id, 'invalid-source-url', 'Source URL must be absolute.'));
    }
  }
  if (item.source.retrievedAt && !isValidIsoDate(item.source.retrievedAt)) {
    issues.push(issue(item.id, 'invalid-retrieved-at', 'Source retrieval date must be a valid ISO date.'));
  }

  if (item.status === 'reviewed' || item.status === 'published') {
    if (!isNonEmpty(item.review.reviewerId)) {
      issues.push(issue(item.id, 'missing-reviewer', 'Reviewed or published content requires a reviewer id.'));
    }
    if (!item.review.reviewedAt || !isValidIsoDate(item.review.reviewedAt)) {
      issues.push(issue(item.id, 'missing-review-date', 'Reviewed or published content requires a valid review date.'));
    }
  }

  if (item.status === 'published' && placeholderPattern.test(item.source.title)) {
    issues.push(issue(item.id, 'placeholder-source', 'Published content cannot use a pending-review source placeholder.'));
  }

  return issues;
}

function validateQuestion(item: ChoiceQuestion, skills: Record<string, LearningSkill>): ContentIssue[] {
  const issues = validateMetadata(item, skills);
  const normalizedOptions = item.options.map((option) => option.trim().toLocaleLowerCase('en'));

  if (!skills[item.skillId] || !item.skills.includes(item.skillId)) {
    issues.push(issue(item.id, 'invalid-primary-skill', 'Question skillId must exist and appear in skills.'));
  }
  if (!isNonEmpty(item.prompt)) {
    issues.push(issue(item.id, 'missing-prompt', 'Question prompt cannot be empty.'));
  }
  if (item.options.length < 2) {
    issues.push(issue(item.id, 'too-few-options', 'A choice question needs at least two options.'));
  }
  if (normalizedOptions.some((option) => option.length === 0)) {
    issues.push(issue(item.id, 'empty-option', 'Question options cannot be empty.'));
  }
  if (new Set(normalizedOptions).size !== normalizedOptions.length) {
    issues.push(issue(item.id, 'duplicate-options', 'Question options must be unique after trimming and case folding.'));
  }
  if (!Number.isInteger(item.correctOptionIndex) || item.correctOptionIndex < 0 || item.correctOptionIndex >= item.options.length) {
    issues.push(issue(item.id, 'invalid-answer-index', 'Correct option index must point to exactly one option.'));
  }
  if (!isNonEmpty(item.explanationVi)) {
    issues.push(issue(item.id, 'missing-explanation', 'Question requires a Vietnamese explanation.'));
  }
  if (!isNonEmpty(item.commonErrorVi)) {
    issues.push(issue(item.id, 'missing-common-error', 'Question requires a Vietnamese common-error explanation.'));
  }

  return issues;
}

function validateLesson(item: Lesson, skills: Record<string, LearningSkill>): ContentIssue[] {
  const issues = validateMetadata(item, skills);

  if (!skills[item.skillId] || !item.skills.includes(item.skillId)) {
    issues.push(issue(item.id, 'invalid-primary-skill', 'Lesson skillId must exist and appear in skills.'));
  }
  if (!isNonEmpty(item.title) || !isNonEmpty(item.summary) || !isNonEmpty(item.explanationVi)) {
    issues.push(issue(item.id, 'incomplete-lesson', 'Lesson requires title, summary and Vietnamese explanation.'));
  }
  if (item.question.skillId !== item.skillId) {
    issues.push(issue(item.id, 'lesson-question-skill-mismatch', 'Lesson exit question must target the lesson primary skill.'));
  }

  return issues;
}

function validatePronunciation(item: PronunciationPrompt, skills: Record<string, LearningSkill>): ContentIssue[] {
  const issues = validateMetadata(item, skills);

  if (!isNonEmpty(item.text)) {
    issues.push(issue(item.id, 'missing-pronunciation-text', 'Pronunciation text cannot be empty.'));
  }
  if (item.targetFeatures.length === 0) {
    issues.push(issue(item.id, 'missing-target-feature', 'Pronunciation content requires at least one target feature.'));
  }
  for (const featureId of item.targetFeatures) {
    const skill = skills[featureId];
    if (!skill || skill.area !== 'Phát âm') {
      issues.push(issue(item.id, 'invalid-target-feature', `Pronunciation target must reference a pronunciation skill: ${featureId}.`));
    }
  }
  if (!isNonEmpty(item.reference.source)) {
    issues.push(issue(item.id, 'missing-pronunciation-reference', 'Pronunciation content requires a reference source.'));
  }
  if (!isNonEmpty(item.remediationVi)) {
    issues.push(issue(item.id, 'missing-remediation', 'Pronunciation content requires a Vietnamese remediation tip.'));
  }
  if (item.status === 'published' && placeholderPattern.test(item.reference.source)) {
    issues.push(issue(item.id, 'placeholder-pronunciation-reference', 'Published pronunciation content requires a verified reference.'));
  }

  return issues;
}

export function validateContent(item: StudentContent, skills: Record<string, LearningSkill>): ContentIssue[] {
  if ('type' in item && item.type === 'single-choice') {
    return validateQuestion(item, skills);
  }
  if ('type' in item && item.type === 'scripted-pronunciation') {
    return validatePronunciation(item, skills);
  }
  return validateLesson(item, skills);
}

export function validateCatalogue(items: StudentContent[], skills: Record<string, LearningSkill>): ContentIssue[] {
  const issues = items.flatMap((item) => validateContent(item, skills));
  const seenIds = new Set<string>();

  for (const item of items) {
    if (seenIds.has(item.id)) {
      issues.push(issue(item.id, 'duplicate-id', 'Content ids must be unique within a catalogue.'));
    }
    seenIds.add(item.id);
  }

  return issues;
}

