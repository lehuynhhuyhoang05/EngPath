export type Grade = 6 | 7 | 8 | 9;

export type GoalId = 'school-support' | 'foundation-repair' | 'pronunciation' | 'exam-10';
export type Difficulty = 'foundation' | 'core' | 'advanced';
export type ContentStatus = 'draft' | 'reviewed' | 'published' | 'archived';
export type SkillArea = 'Ngữ pháp' | 'Từ vựng' | 'Đọc hiểu' | 'Phát âm';

export interface LearnerProfile {
  grade: Grade;
  goalId: GoalId;
}

export interface GoalOption {
  id: GoalId;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
}

export interface LearningSkill {
  id: string;
  title: string;
  area: SkillArea;
  minimumGrade: Grade;
  prerequisiteIds: string[];
}

export interface ContentMetadata {
  id: string;
  grade: Grade;
  skills: string[];
  prerequisites: string[];
  difficulty: Difficulty;
  status: ContentStatus;
  authoringMethod: 'human' | 'ai-assisted' | 'imported';
  source: { title: string; url?: string; retrievedAt?: string };
  review: { reviewerId?: string; reviewedAt?: string };
  version: number;
}

export interface ChoiceQuestion extends ContentMetadata {
  type: 'single-choice';
  skillId: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanationVi: string;
  commonErrorVi: string;
}

export interface Lesson extends ContentMetadata {
  skillId: string;
  title: string;
  summary: string;
  learningObjectiveVi: string;
  explanationVi: string;
  example: string;
  exampleVi: string;
  question: ChoiceQuestion;
}

export interface PronunciationPrompt extends ContentMetadata {
  type: 'scripted-pronunciation';
  text: string;
  locale: 'en-US' | 'en-GB';
  targetFeatures: string[];
  reference: { source: string; ipa?: string };
  remediationVi: string;
}

export interface ExamTemplate extends ContentMetadata {
  type: 'exam-template';
  kind: 'practice-sample' | 'province-specific';
  province?: string;
  schoolYear?: string;
  durationMinutes: number;
  pointsPerQuestion: number;
  questionIds: string[];
  independentReviews: { reviewerId: string; reviewedAt: string; decision: 'pass' | 'revise' | 'reject' }[];
}

export interface SkillScore {
  skillId: string;
  score: number;
  correct: number;
  total: number;
}

export type MasteryConfidence = 'low' | 'medium' | 'high';

export interface MasteryState extends SkillScore {
  confidence: MasteryConfidence;
  updatedAt: string;
}

export interface DiagnosticResult {
  overallScore: number;
  strongestSkillId: string;
  weakestSkillId: string;
  skillScores: SkillScore[];
  completedAt: string;
}

export interface DiagnosticDraft {
  grade: Grade;
  answers: Record<string, number>;
  currentIndex: number;
}

export interface LessonDraft {
  lessonId: string;
  selectedOptionIndex?: number;
  checked: boolean;
  updatedAt: string;
}

export interface MistakeRecord {
  questionId: string;
  lessonId: string;
  skillId: string;
  prompt: string;
  selectedOption: string;
  correctOption: string;
  explanationVi: string;
  commonErrorVi: string;
  attempts: number;
  lastAnsweredAt: string;
  status: 'active' | 'resolved';
}

export type ContentReportReason = 'answer' | 'explanation' | 'typo' | 'prompt';

export interface ContentReport {
  contentId: string;
  contentVersion: number;
  reason: ContentReportReason;
  createdAt: string;
}

export interface StoredAppState {
  profile?: LearnerProfile;
  diagnosticDraft?: DiagnosticDraft;
  diagnostic?: DiagnosticResult;
  activeLessonId?: string;
  lessonDrafts: Record<string, LessonDraft>;
  masteryStates: Record<string, MasteryState>;
  mistakeRecords: MistakeRecord[];
  contentReports: ContentReport[];
  completedLessonIds: string[];
  completedSessions: number;
  pronunciationBestScore?: number;
}
