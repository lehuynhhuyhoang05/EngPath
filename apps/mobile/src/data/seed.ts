import type { ChoiceQuestion, GoalOption, Grade, LearningSkill, Lesson, PronunciationPrompt } from '../domain/models';

export const GRADES: Grade[] = [6, 7, 8, 9];

export const GOALS: GoalOption[] = [
  { id: 'school-support', title: 'Theo kịp kiến thức trên lớp', shortTitle: 'Theo chương trình', description: 'Ôn đúng chủ điểm đang học và hiểu rõ lỗi sai.', icon: '◇' },
  { id: 'foundation-repair', title: 'Củng cố phần bị mất gốc', shortTitle: 'Vá lỗ hổng', description: 'Tìm kiến thức nền còn thiếu và học lại theo đường ngắn nhất.', icon: '↺' },
  { id: 'pronunciation', title: 'Cải thiện phát âm', shortTitle: 'Phát âm', description: 'Luyện từ và câu với hướng dẫn sửa lỗi bằng tiếng Việt.', icon: '◖' },
  { id: 'exam-10', title: 'Ôn thi vào lớp 10', shortTitle: 'Thi vào 10', description: 'Luyện theo dạng đề, mục tiêu điểm và phần kiến thức còn yếu.', icon: '◎' },
];

export const SKILLS: Record<string, LearningSkill> = {
  'present-simple': { id: 'present-simple', title: 'Hiện tại đơn', area: 'Ngữ pháp', minimumGrade: 6, prerequisiteIds: [] },
  'there-be': { id: 'there-be', title: 'There is / There are', area: 'Ngữ pháp', minimumGrade: 6, prerequisiteIds: [] },
  'past-simple': { id: 'past-simple', title: 'Quá khứ đơn', area: 'Ngữ pháp', minimumGrade: 6, prerequisiteIds: ['present-simple'] },
  'adjective-adverb': { id: 'adjective-adverb', title: 'Tính từ và trạng từ', area: 'Ngữ pháp', minimumGrade: 7, prerequisiteIds: [] },
  comparison: { id: 'comparison', title: 'So sánh hơn', area: 'Ngữ pháp', minimumGrade: 7, prerequisiteIds: ['adjective-adverb'] },
  'present-perfect': { id: 'present-perfect', title: 'Hiện tại hoàn thành', area: 'Ngữ pháp', minimumGrade: 8, prerequisiteIds: ['past-simple'] },
  'relative-clause': { id: 'relative-clause', title: 'Mệnh đề quan hệ', area: 'Ngữ pháp', minimumGrade: 9, prerequisiteIds: ['present-simple'] },
  'first-conditional': { id: 'first-conditional', title: 'Câu điều kiện loại 1', area: 'Ngữ pháp', minimumGrade: 9, prerequisiteIds: ['present-simple'] },
  'phoneme-th-voiceless': { id: 'phoneme-th-voiceless', title: 'Âm /θ/', area: 'Phát âm', minimumGrade: 6, prerequisiteIds: [] },
};

const source = { title: 'EngPath original prototype item; requires educator review before publication' };
const pendingReview = () => ({});

function question(id: string, grade: Grade, skillId: string, prompt: string, options: string[], correctOptionIndex: number, explanationVi: string, commonErrorVi: string): ChoiceQuestion {
  return {
    id, grade, skills: [skillId], skillId, prerequisites: SKILLS[skillId].prerequisiteIds,
    difficulty: 'core', status: 'draft', authoringMethod: 'ai-assisted', source, review: pendingReview(), version: 1,
    type: 'single-choice', prompt, options, correctOptionIndex, explanationVi, commonErrorVi,
  };
}

export const DIAGNOSTIC_QUESTIONS: ChoiceQuestion[] = [
  question('diag-present-simple-01', 6, 'present-simple', 'Lan ___ her homework after dinner every day.', ['do', 'does', 'did', 'doing'], 1, 'Chủ ngữ “Lan” là ngôi thứ ba số ít nên động từ “do” đổi thành “does” ở hiện tại đơn.', 'Quên thêm -s/-es hoặc dùng dạng quá khứ dù câu có dấu hiệu “every day”.'),
  question('diag-present-simple-02', 6, 'present-simple', 'My brother does not ___ football on weekdays.', ['plays', 'play', 'played', 'playing'], 1, 'Sau “does not”, động từ chính trở về dạng nguyên mẫu “play”.', 'Vẫn thêm -s vào động từ chính sau “does not”.'),
  question('diag-there-be-01', 6, 'there-be', 'There ___ two notebooks on the desk.', ['is', 'are', 'was', 'be'], 1, 'Danh từ “two notebooks” ở số nhiều nên dùng “There are”.', 'Chọn “is” mà không kiểm tra danh từ phía sau là số ít hay số nhiều.'),
  question('diag-past-simple-01', 6, 'past-simple', 'We ___ our grandparents last Sunday.', ['visit', 'visits', 'visited', 'are visiting'], 2, '“Last Sunday” là dấu hiệu của quá khứ đơn, vì vậy dùng “visited”.', 'Bỏ qua trạng từ thời gian và chọn hiện tại đơn.'),
  question('diag-adverb-01', 7, 'adjective-adverb', 'Mai speaks English ___.', ['fluent', 'fluently', 'fluency', 'influence'], 1, 'Động từ “speaks” cần trạng từ “fluently” bổ nghĩa.', 'Nhầm tính từ “fluent” với trạng từ “fluently”.'),
  question('diag-comparison-01', 7, 'comparison', 'This exercise is ___ than the previous one.', ['easy', 'easier', 'easiest', 'more easy'], 1, 'Tính từ ngắn “easy” đổi thành “easier” trong cấu trúc so sánh hơn có “than”.', 'Dùng “more easy” thay vì quy tắc đổi y thành i rồi thêm -er.'),
  question('diag-present-perfect-01', 8, 'present-perfect', 'They ___ in An Giang since 2022.', ['live', 'lived', 'have lived', 'are living'], 2, '“Since 2022” diễn tả hành động bắt đầu trong quá khứ và còn kéo dài, nên dùng hiện tại hoàn thành.', 'Dùng quá khứ đơn dù mốc “since” cho thấy trạng thái vẫn còn liên quan đến hiện tại.'),
  question('diag-relative-clause-01', 9, 'relative-clause', 'The student ___ won the contest is in my class.', ['which', 'who', 'where', 'when'], 1, 'Đại từ quan hệ “who” thay cho người và làm chủ ngữ của “won”.', 'Dùng “which” cho người hoặc chọn trạng từ quan hệ chỉ nơi chốn/thời gian.'),
  question('diag-first-conditional-01', 9, 'first-conditional', 'If it rains tomorrow, we ___ at home.', ['stay', 'stayed', 'will stay', 'would stay'], 2, 'Điều kiện có thể xảy ra trong tương lai dùng “If + hiện tại đơn, will + động từ”.', 'Dùng “would” của câu điều kiện loại 2 cho một khả năng thực tế trong tương lai.'),
];

export function diagnosticQuestionsForGrade(grade: Grade): ChoiceQuestion[] {
  return DIAGNOSTIC_QUESTIONS.filter((item) => item.grade <= grade);
}

function lesson(skillId: string, grade: Grade, item: ChoiceQuestion): Lesson {
  return {
    id: `lesson-${skillId}-01`, grade, skills: [skillId], skillId,
    prerequisites: SKILLS[skillId].prerequisiteIds, difficulty: 'foundation', status: 'draft',
    authoringMethod: 'ai-assisted', source, review: pendingReview(), version: 1,
    title: `Làm chắc ${SKILLS[skillId].title}`,
    summary: `Ôn nhanh ${SKILLS[skillId].title.toLowerCase()} qua một quy tắc và một câu luyện tập.`,
    explanationVi: item.explanationVi,
    example: item.prompt.replace('___', item.options[item.correctOptionIndex]),
    exampleVi: 'Quan sát vị trí của từ và dấu hiệu trong câu để chọn đúng dạng.',
    question: item,
  };
}

export const LESSONS_BY_SKILL: Record<string, Lesson> = Object.fromEntries(
  DIAGNOSTIC_QUESTIONS.map((item) => [item.skillId, lesson(item.skillId, item.grade, item)]),
);

export const PRONUNCIATION_PROMPT: PronunciationPrompt = {
  id: 'pronunciation-th-01', grade: 6, skills: ['phoneme-th-voiceless'], prerequisites: [],
  difficulty: 'foundation', status: 'draft', authoringMethod: 'ai-assisted',
  source: { title: 'Prototype prompt; pronunciation reference must be verified before publication' }, review: pendingReview(), version: 1,
  type: 'scripted-pronunciation', text: 'I think Thursday will be sunny.', locale: 'en-US',
  targetFeatures: ['phoneme-th-voiceless'], reference: { source: 'Speech provider reference audio pending integration' },
  remediationVi: 'Đặt nhẹ đầu lưỡi giữa hai hàm răng rồi đẩy hơi ra; tránh đọc âm /θ/ thành /t/.',
};
