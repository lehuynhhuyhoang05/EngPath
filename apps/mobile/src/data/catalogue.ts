import { validateCatalogue, type ContentIssue } from './contentValidation';
import { EXAM_SAMPLE_QUESTIONS, EXAM_SAMPLE_TEMPLATE, validateExamSample } from './examSample';
import { DIAGNOSTIC_QUESTIONS, LESSONS_BY_SKILL, PRONUNCIATION_PROMPT, SKILLS } from './seed';

export const CONTENT_SCHEMA_VERSION = 1;

export const CATALOGUE = {
  id: 'engpath-prototype',
  schemaVersion: CONTENT_SCHEMA_VERSION,
  revision: 1,
  skills: SKILLS,
  diagnostics: DIAGNOSTIC_QUESTIONS,
  lessons: Object.values(LESSONS_BY_SKILL),
  pronunciation: [PRONUNCIATION_PROMPT],
  examSamples: [{ template: EXAM_SAMPLE_TEMPLATE, questions: EXAM_SAMPLE_QUESTIONS }],
};

export function validatePrototypeCatalogue(): ContentIssue[] {
  const issues = validateCatalogue([
    ...CATALOGUE.diagnostics,
    ...CATALOGUE.lessons,
    ...CATALOGUE.pronunciation,
    ...CATALOGUE.examSamples.flatMap((sample) => sample.questions),
  ], CATALOGUE.skills);
  for (const sample of CATALOGUE.examSamples) {
    issues.push(...validateExamSample(sample.template, sample.questions, CATALOGUE.skills));
    const otherIds = [
      ...CATALOGUE.lessons.flatMap((lesson) => [lesson.id, lesson.question.id]),
      ...CATALOGUE.diagnostics.map((item) => item.id),
      ...CATALOGUE.pronunciation.map((item) => item.id),
      ...CATALOGUE.examSamples.flatMap((entry) => entry.questions.map((item) => item.id)),
    ];
    if (otherIds.includes(sample.template.id)) {
      issues.push({ code: 'duplicate-id', contentId: sample.template.id, message: 'Exam template id must be unique in the catalogue.' });
    }
  }
  return issues;
}
