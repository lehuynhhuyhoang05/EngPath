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
  if (!isNonEmpty(item.title) || !isNonEmpty(item.summary) || !isNonEmpty(item.learningObjectiveVi) || !isNonEmpty(item.explanationVi) || !isNonEmpty(item.example) || !isNonEmpty(item.exampleVi)) {
    issues.push(issue(item.id, 'incomplete-lesson', 'Lesson requires title, summary, objective, rule and explained example.'));
  }
  if (item.question.skillId !== item.skillId) {
    issues.push(issue(item.id, 'lesson-question-skill-mismatch', 'Lesson exit question must target the lesson primary skill.'));
  }
  if (item.question.grade !== item.grade) {
    issues.push(issue(item.id, 'lesson-question-grade-mismatch', 'Lesson exit question must target the lesson grade.'));
  }
  if (item.question.id === item.id) {
    issues.push(issue(item.id, 'duplicate-id', 'Lesson and exit question must have different ids.'));
  }
  issues.push(...validateQuestion(item.question, skills));

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
  const issues = [...validateSkillGraph(skills), ...items.flatMap((item) => validateContent(item, skills))];
  const seenIds = new Set<string>();

  for (const item of items) {
    for (const id of 'question' in item ? [item.id, item.question.id] : [item.id]) {
      if (seenIds.has(id)) {
        issues.push(issue(id, 'duplicate-id', 'Content ids must be unique within a catalogue, including lesson exit questions.'));
      }
      seenIds.add(id);
    }
  }

  return issues;
}

export function validateSkillGraph(skills: Record<string, LearningSkill>): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(skillId: string): void {
    const skill = skills[skillId];
    if (!skill || visited.has(skillId)) return;
    if (visiting.has(skillId)) {
      issues.push(issue(skillId, 'skill-cycle', 'Skill prerequisites must not contain a cycle.'));
      return;
    }
    visiting.add(skillId);
    if (skill.id !== skillId) issues.push(issue(skillId, 'skill-key-mismatch', 'Skill map key must match skill id.'));
    for (const prerequisiteId of skill.prerequisiteIds) {
      const prerequisite = skills[prerequisiteId];
      if (!prerequisite) {
        issues.push(issue(skillId, 'unknown-prerequisite', `Unknown prerequisite: ${prerequisiteId}.`));
      } else {
        if (prerequisite.minimumGrade > skill.minimumGrade) {
          issues.push(issue(skillId, 'future-prerequisite', 'Prerequisite cannot start in a later grade.'));
        }
        visit(prerequisiteId);
      }
    }
    visiting.delete(skillId);
    visited.add(skillId);
  }

  Object.keys(skills).forEach(visit);
  return issues;
}

const allowedTransitions: Record<ContentMetadata['status'], ContentMetadata['status'][]> = {
  draft: ['reviewed'],
  reviewed: ['published', 'draft'],
  published: ['archived'],
  archived: [],
};

export function validateContentRevision(previous: StudentContent, next: StudentContent, skills: Record<string, LearningSkill>): ContentIssue[] {
  const issues = validateContent(next, skills);
  const kind = (item: StudentContent) => 'type' in item ? item.type : 'lesson';
  if (previous.id !== next.id || kind(previous) !== kind(next)) {
    issues.push(issue(next.id, 'revision-identity', 'A revision must keep the same id and content type.'));
  }
  if (next.version !== previous.version + 1) {
    issues.push(issue(next.id, 'revision-version', 'A revision must increment the version by one.'));
  }
  if (!allowedTransitions[previous.status].includes(next.status)) {
    issues.push(issue(next.id, 'invalid-status-transition', `Cannot move from ${previous.status} to ${next.status}.`));
  }
  if (previous.status === 'reviewed' && next.status === 'published') {
    const withoutTransitionFields = (item: StudentContent) => {
      const { status: _status, version: _version, ...reviewedPayload } = item;
      return reviewedPayload;
    };
    if (JSON.stringify(withoutTransitionFields(previous)) !== JSON.stringify(withoutTransitionFields(next))) {
      issues.push(issue(next.id, 'changed-after-review', 'Publishing cannot change reviewed content or its review evidence.'));
    }
  }
  return issues;
}
