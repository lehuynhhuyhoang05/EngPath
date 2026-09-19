import type { ChoiceQuestion, GoalOption, Grade, LearningSkill, Lesson, PronunciationPrompt } from '../domain/models';
import { m3ReviewMetadata } from './m3Review';

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
  'reading-main-idea': { id: 'reading-main-idea', title: 'Ý chính đoạn văn', area: 'Đọc hiểu', minimumGrade: 8, prerequisiteIds: [] },
  'relative-clause': { id: 'relative-clause', title: 'Mệnh đề quan hệ', area: 'Ngữ pháp', minimumGrade: 9, prerequisiteIds: ['present-simple'] },
  'first-conditional': { id: 'first-conditional', title: 'Câu điều kiện loại 1', area: 'Ngữ pháp', minimumGrade: 9, prerequisiteIds: ['present-simple'] },
  'phoneme-th-voiceless': { id: 'phoneme-th-voiceless', title: 'Âm /θ/', area: 'Phát âm', minimumGrade: 6, prerequisiteIds: [] },
};

const source = { title: 'EngPath original prototype item; requires educator review before publication' };
const reviewedSource = { title: 'Original EngPath grade-9 grammar practice; review evidence in docs/content/M3-REVIEW-RESULTS.md' };
const pendingReview = () => ({});

function question(id: string, grade: Grade, skillId: string, prompt: string, options: string[], correctOptionIndex: number, explanationVi: string, commonErrorVi: string): ChoiceQuestion {
  return {
    id, grade, skills: [skillId], skillId, prerequisites: SKILLS[skillId].prerequisiteIds,
    difficulty: 'core', authoringMethod: 'ai-assisted', ...m3ReviewMetadata(id, source, reviewedSource),
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
  // Append new questions after the original nine so saved diagnostic indexes keep their meaning.
  question('diag-present-simple-03', 6, 'present-simple', 'He ___ to school by bus every morning.', ['go', 'goes', 'went', 'going'], 1, '“He” là ngôi thứ ba số ít; “go” thêm -es thành “goes”.', 'Dùng động từ nguyên mẫu dù chủ ngữ là “he”.'),
  question('diag-there-be-02', 6, 'there-be', 'There ___ a small park near our school.', ['is', 'are', 'were', 'be'], 0, '“A small park” là số ít nên dùng “There is”.', 'Thấy “there” rồi chọn “are” mà không xem danh từ phía sau.'),
  question('diag-there-be-03', 6, 'there-be', 'There ___ five books in my bag.', ['is', 'are', 'was', 'be'], 1, '“Five books” là số nhiều nên dùng “There are”.', 'Dùng “is” dù danh từ phía sau ở số nhiều.'),
  question('diag-past-simple-02', 6, 'past-simple', 'My friends ___ a film last night.', ['watch', 'watches', 'watched', 'are watching'], 2, '“Last night” chỉ thời gian đã qua; “watch” thêm -ed thành “watched”.', 'Bỏ qua “last night” và chọn dạng hiện tại.'),
  question('diag-reading-main-idea-01', 8, 'reading-main-idea', 'Every Friday, Linh and her classmates collect used paper at school. They sell it to buy notebooks for younger students. What is the passage mainly about?', ['A recycling project that helps younger students', 'How to make paper at home', 'A trip to a bookshop', 'Why Linh dislikes school'], 0, 'Cả hai câu đều nói về việc thu gom giấy để giúp học sinh nhỏ hơn; đó là ý chính của đoạn.', 'Chọn một chi tiết hoặc một ý không xuất hiện trong đoạn thay vì ý bao quát.'),
];

export function diagnosticQuestionsForGrade(grade: Grade): ChoiceQuestion[] {
  return DIAGNOSTIC_QUESTIONS.filter((item) => item.grade <= grade);
}

interface LessonSeed {
  objective: string;
  rule: string;
  example: string;
  exampleVi: string;
  question: [string, string[], number, string, string];
}

const LESSON_SEEDS: Record<string, LessonSeed> = {
  'present-simple': { objective: 'Chọn đúng dạng động từ ở hiện tại đơn với chủ ngữ ngôi thứ ba số ít.', rule: 'Với he, she, it hoặc tên một người, thêm -s hoặc -es vào động từ trong câu khẳng định hiện tại đơn.', example: 'Minh walks to school every morning.', exampleVi: 'Minh đi bộ đến trường mỗi sáng; “Minh” là ngôi thứ ba số ít nên “walk” thêm -s.', question: ['My sister ___ TV after school.', ['watch', 'watches', 'watched', 'watching'], 1, '“My sister” là ngôi thứ ba số ít; “watch” thêm -es thành “watches”.', 'Dùng động từ nguyên mẫu dù chủ ngữ là ngôi thứ ba số ít.'] },
  'there-be': { objective: 'Chọn is hoặc are theo số lượng danh từ đứng sau there.', rule: 'Trong câu hiện tại, dùng “There is” với danh từ số ít và “There are” với danh từ số nhiều.', example: 'There is one chair beside the desk.', exampleVi: 'Có một chiếc ghế cạnh bàn; “one chair” là số ít nên dùng “is”.', question: ['There ___ three windows in this room.', ['is', 'are', 'was', 'be'], 1, '“Three windows” là số nhiều nên dùng “There are”.', 'Nhìn từ “there” mà quên kiểm tra danh từ phía sau.'] },
  'past-simple': { objective: 'Nhận ra dấu hiệu thời gian đã qua và chọn dạng quá khứ của động từ có quy tắc.', rule: 'Với hành động đã kết thúc trong quá khứ, dùng dạng quá khứ; động từ có quy tắc thường thêm -ed.', example: 'They visited Da Lat last summer.', exampleVi: 'Họ đã thăm Đà Lạt mùa hè trước; “last summer” chỉ thời gian đã qua.', question: ['Hoa ___ her aunt yesterday.', ['visits', 'visited', 'visit', 'is visiting'], 1, '“Yesterday” chỉ thời gian đã qua, nên “visit” đổi thành “visited”.', 'Bỏ qua “yesterday” và chọn dạng hiện tại.'] },
  'adjective-adverb': { objective: 'Phân biệt tính từ và trạng từ khi bổ nghĩa cho động từ.', rule: 'Một trạng từ thường bổ nghĩa cho cách thực hiện hành động; nhiều trạng từ được tạo bằng cách thêm -ly vào tính từ.', example: 'He speaks clearly.', exampleVi: 'Anh ấy nói rõ ràng; “clearly” mô tả cách anh ấy nói.', question: ['The students listened ___ to the teacher.', ['careful', 'carefully', 'care', 'caring'], 1, '“Listened” là động từ; “carefully” diễn tả cách lắng nghe.', 'Dùng tính từ “careful” để bổ nghĩa trực tiếp cho động từ.'] },
  comparison: { objective: 'Dùng dạng so sánh hơn của tính từ ngắn khi có than.', rule: 'Tính từ ngắn thường thêm -er trước “than”; tính từ kết thúc bằng -y thường đổi y thành i rồi thêm -er.', example: 'This bag is lighter than that one.', exampleVi: 'Chiếc túi này nhẹ hơn chiếc kia; “light” thêm -er.', question: ['This street is ___ than my street.', ['narrow', 'narrower', 'narrowest', 'more narrowest'], 1, 'Có “than” nên dùng dạng so sánh hơn “narrower”.', 'Dùng dạng gốc hoặc so sánh nhất trước “than”.'] },
  'present-perfect': { objective: 'Dùng have/has + quá khứ phân từ cho trạng thái bắt đầu trong quá khứ và còn tiếp diễn.', rule: 'Với “since” chỉ mốc bắt đầu của trạng thái còn tiếp diễn, thường dùng hiện tại hoàn thành: have/has + quá khứ phân từ.', example: 'I have lived here since 2020.', exampleVi: 'Tôi sống ở đây từ năm 2020 đến nay; “have lived” nối quá khứ với hiện tại.', question: ['She ___ at this school since 2021.', ['studies', 'studied', 'has studied', 'is studying'], 2, '“Since 2021” cho biết việc học bắt đầu trước đây và còn tiếp diễn; “she” đi với “has studied”.', 'Chọn quá khứ đơn dù “since” nối mốc bắt đầu với hiện tại.'] },
  'reading-main-idea': { objective: 'Chọn một câu tóm tắt bao quát các ý trong đoạn văn ngắn.', rule: 'Đọc cả đoạn, tìm hoạt động hoặc chủ đề được nhắc xuyên suốt; tránh chọn đáp án chỉ nói một chi tiết nhỏ.', example: 'Our school library opens after class. Students can borrow books or join a reading club.', exampleVi: 'Ý chính: thư viện trường tạo cơ hội đọc sách sau giờ học; mượn sách và câu lạc bộ là hai chi tiết hỗ trợ.', question: ['On Saturdays, Nam and his friends plant vegetables in the school garden. They use the vegetables for class cooking activities. What is the main idea?', ['Students grow vegetables for school activities', 'Nam buys food at a market', 'The school garden closes on Saturdays', 'Cooking is Nam’s favourite subject'], 0, 'Cả việc trồng và sử dụng rau đều nằm trong hoạt động ở trường; đáp án này bao quát toàn đoạn.', 'Chọn chi tiết không có trong đoạn hoặc chỉ chú ý một từ quen thuộc.'] },
  'relative-clause': { objective: 'Dùng who để nối mệnh đề bổ nghĩa cho một người.', rule: 'Dùng “who” làm chủ ngữ của mệnh đề quan hệ khi danh từ phía trước chỉ người.', example: 'The girl who sings is my friend.', exampleVi: 'Cô gái đang hát là bạn tôi; “who” thay cho “the girl”.', question: ['The teacher ___ helped me is very kind.', ['which', 'who', 'where', 'when'], 1, '“The teacher” chỉ người và là chủ ngữ của “helped”, nên dùng “who”.', 'Dùng “which” cho người hoặc dùng từ chỉ nơi chốn/thời gian.'] },
  'first-conditional': { objective: 'Hoàn thành mệnh đề kết quả của điều kiện có thể xảy ra trong tương lai.', rule: 'Câu điều kiện loại 1 thường có “If + hiện tại đơn, will + động từ nguyên mẫu” để nói về khả năng trong tương lai.', example: 'If I finish early, I will call you.', exampleVi: 'Nếu xong sớm, tôi sẽ gọi bạn; điều kiện có thể xảy ra.', question: ['If you study tonight, you ___ the lesson better.', ['understand', 'understood', 'will understand', 'would understand'], 2, 'Điều kiện “If you study” ở hiện tại đơn; kết quả có thể xảy ra dùng “will understand”.', 'Dùng “would” của câu điều kiện loại 2.'] },
};

function lesson(skillId: string, grade: Grade): Lesson {
  const seed = LESSON_SEEDS[skillId];
  return {
    id: `lesson-${skillId}-01`, grade, skills: [skillId], skillId,
    prerequisites: SKILLS[skillId].prerequisiteIds, difficulty: 'foundation',
    authoringMethod: 'ai-assisted', ...m3ReviewMetadata(`lesson-${skillId}-01`, source, reviewedSource),
    title: `Làm chắc ${SKILLS[skillId].title}`,
    summary: `Ôn nhanh ${SKILLS[skillId].title.toLowerCase()} qua một quy tắc và một câu luyện tập.`,
    learningObjectiveVi: seed.objective,
    explanationVi: seed.rule,
    example: seed.example,
    exampleVi: seed.exampleVi,
    question: question(`exit-${skillId}-01`, grade, skillId, ...seed.question),
  };
}

export const LESSONS_BY_SKILL: Record<string, Lesson> = Object.fromEntries(
  DIAGNOSTIC_QUESTIONS.map((item) => [item.skillId, lesson(item.skillId, item.grade)]),
);

export const PRONUNCIATION_PROMPT: PronunciationPrompt = {
  id: 'pronunciation-th-01', grade: 6, skills: ['phoneme-th-voiceless'], prerequisites: [],
  difficulty: 'foundation', status: 'draft', authoringMethod: 'ai-assisted',
  source: { title: 'Prototype prompt; pronunciation reference must be verified before publication' }, review: pendingReview(), version: 1,
  type: 'scripted-pronunciation', text: 'I think Thursday will be sunny.', locale: 'en-US',
  targetFeatures: ['phoneme-th-voiceless'], reference: { source: 'Speech provider reference audio pending integration' },
  remediationVi: 'Đặt nhẹ đầu lưỡi giữa hai hàm răng rồi đẩy hơi ra; tránh đọc âm /θ/ thành /t/.',
};
