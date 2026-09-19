import type { ChoiceQuestion, ExamTemplate, LearningSkill } from '../domain/models';
import { validateContent, validateContentMetadata, type ContentIssue } from './contentValidation';
import { m3ReviewMetadata } from './m3Review';
import { SKILLS } from './seed';

const source = { title: 'Original EngPath exam-style practice written for a prototype; not an official provincial exam' };

function examQuestion(id: string, skillId: string, prompt: string, options: string[], correctOptionIndex: number, explanationVi: string, commonErrorVi: string): ChoiceQuestion {
  return {
    id, type: 'single-choice', grade: 9, skills: [skillId], skillId,
    prerequisites: SKILLS[skillId].prerequisiteIds, difficulty: 'core',
    authoringMethod: 'ai-assisted', ...m3ReviewMetadata(id, source, source),
    prompt, options, correctOptionIndex, explanationVi, commonErrorVi,
  };
}

export const EXAM_SAMPLE_QUESTIONS: ChoiceQuestion[] = [
  examQuestion('exam-sample-conditional-01', 'first-conditional', 'If Mai finishes her homework early tonight, she ___ her cousin tomorrow.', ['called', 'has called', 'will call', 'would call'], 2, 'Điều kiện nói về tối nay và kết quả ngày mai, nên dùng “will call”.', 'Dùng “would” như câu điều kiện loại 2.'),
  examQuestion('exam-sample-relative-01', 'relative-clause', 'The volunteer ___ helped us lives nearby.', ['which', 'who', 'where', 'when'], 1, '“The volunteer” chỉ người và là chủ ngữ của “helped”, nên dùng “who”.', 'Dùng “which” cho người hoặc chọn từ chỉ nơi chốn/thời gian.'),
  examQuestion('exam-sample-reading-01', 'reading-main-idea', 'At the end of each term, students at Hoa’s school exchange books they have finished reading. Each student can take home a different book without buying a new one. What is the passage mainly about?', ['A school book exchange', 'A new bookshop near school', 'How to write a novel', 'Why students stop reading'], 0, 'Hai câu cùng nói về việc học sinh đổi sách đã đọc để có sách khác; đó là ý chính.', 'Chọn ý không được đoạn văn nhắc đến.'),
];

export const EXAM_SAMPLE_TEMPLATE: ExamTemplate = {
  id: 'exam-sample-grade-9-01', type: 'exam-template', kind: 'practice-sample', grade: 9,
  skills: ['first-conditional', 'relative-clause', 'reading-main-idea'], prerequisites: [],
  difficulty: 'core', status: 'draft', authoringMethod: 'ai-assisted', source, review: {}, version: 1,
  durationMinutes: 8, pointsPerQuestion: 1, questionIds: EXAM_SAMPLE_QUESTIONS.map((item) => item.id), independentReviews: [],
};

export function validateExamSample(template: ExamTemplate, questions: ChoiceQuestion[], skills: Record<string, LearningSkill>): ContentIssue[] {
  const issues = validateContentMetadata(template, skills);
  const add = (code: string, message: string) => issues.push({ code, contentId: template.id, message });
  const ids = questions.map((item) => item.id);

  if (template.grade !== 9) add('exam-grade', 'Grade-10 entrance practice must target grade 9.');
  if (!Number.isInteger(template.durationMinutes) || template.durationMinutes < 1) add('exam-duration', 'Exam duration must be a positive number of minutes.');
  if (!Number.isFinite(template.pointsPerQuestion) || template.pointsPerQuestion <= 0) add('exam-points', 'Points per question must be positive.');
  if (ids.length === 0 || new Set(ids).size !== ids.length || new Set(template.questionIds).size !== template.questionIds.length || ids.length !== template.questionIds.length || ids.some((id, index) => id !== template.questionIds[index])) {
    add('exam-question-ids', 'Template question ids must uniquely match the sample questions in order.');
  }
  if (template.kind === 'province-specific' && template.status === 'published' && (!template.province?.trim() || !/^\d{4}-\d{4}$/.test(template.schoolYear ?? '') || !template.source.url)) {
    add('exam-provenance', 'A published province-specific template needs province, school year and source URL.');
  }
  if (template.status === 'published') {
    const reviews = Array.isArray(template.independentReviews) ? template.independentReviews : [];
    const passingReviews = reviews.filter((review) => review.decision === 'pass' && review.reviewerId.trim() && !Number.isNaN(Date.parse(review.reviewedAt)));
    if (new Set(passingReviews.map((review) => review.reviewerId)).size < 2) {
      add('exam-independent-reviews', 'Published exam content needs two distinct independent passing reviewers.');
    }
    if (reviews.some((review) => review.decision !== 'pass')) {
      add('exam-unresolved-review', 'Published exam content cannot contain an unresolved revise or reject decision.');
    }
  }
  for (const question of questions) {
    issues.push(...validateContent(question, skills));
    if (question.grade !== 9 || !template.skills.includes(question.skillId)) {
      issues.push({ code: 'exam-question-skill', contentId: question.id, message: 'Exam question must target grade 9 and a template skill.' });
    }
    if (template.status === 'published' && question.status !== 'published') {
      issues.push({ code: 'exam-unpublished-question', contentId: question.id, message: 'A published template cannot include an unpublished question.' });
    }
  }
  return issues;
}

export function scoreExamSample(template: ExamTemplate, questions: ChoiceQuestion[], answers: Record<string, number>) {
  if (questions.length !== template.questionIds.length || questions.some((question, index) => question.id !== template.questionIds[index])) {
    throw new Error('Exam questions do not match the template.');
  }
  const bySkill: Record<string, { earned: number; possible: number }> = {};
  for (const question of questions) {
    const result = bySkill[question.skillId] ?? { earned: 0, possible: 0 };
    result.possible += template.pointsPerQuestion;
    if (answers[question.id] === question.correctOptionIndex) result.earned += template.pointsPerQuestion;
    bySkill[question.skillId] = result;
  }
  const earned = Object.values(bySkill).reduce((total, result) => total + result.earned, 0);
  const possible = Object.values(bySkill).reduce((total, result) => total + result.possible, 0);
  return { earned, possible, bySkill };
}
