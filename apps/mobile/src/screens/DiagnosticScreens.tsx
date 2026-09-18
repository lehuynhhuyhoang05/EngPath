import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { evidenceConfidence, learningBand, sortSkillsForReview } from '../domain/diagnosticPresentation';
import type { ChoiceQuestion, ContentReportReason, DiagnosticResult } from '../domain/models';
import { SKILLS } from '../data/seed';
import { BackButton, Button, Icon, Pill, ProgressBar, Screen } from '../ui/components';
import { colors, radii, spacing, type } from '../ui/theme';
import { ContentReportControl } from './ContentReportControl';

export function DiagnosticScreen({ questions, initialAnswers, initialIndex, reportedContentRefs, onProgress, onReport, onComplete, onExit }: {
  questions: ChoiceQuestion[];
  initialAnswers?: Record<string, number>;
  initialIndex?: number;
  reportedContentRefs?: string[];
  onProgress?: (answers: Record<string, number>, currentIndex: number) => void;
  onReport?: (question: ChoiceQuestion, reason: ContentReportReason) => void;
  onComplete: (answers: Record<string, number>) => void;
  onExit: () => void;
}) {
  const safeInitialIndex = useMemo(() => Math.min(Math.max(initialIndex ?? 0, 0), Math.max(questions.length - 1, 0)), [initialIndex, questions.length]);
  const [index, setIndex] = useState(safeInitialIndex);
  const [answers, setAnswers] = useState<Record<string, number>>(initialAnswers ?? {});
  const question = questions[index];
  const selected = answers[question.id];
  const hasAnswer = selected !== undefined;

  useEffect(() => {
    onProgress?.(answers, index);
  }, [answers, index, onProgress]);

  const continueFlow = () => {
    if (!hasAnswer) return;
    if (index === questions.length - 1) onComplete(answers);
    else setIndex((current) => current + 1);
  };

  return (
    <Screen
      testID="diagnostic-screen"
      footer={<Button label={index === questions.length - 1 ? 'Xem định hướng' : 'Câu tiếp theo'} onPress={continueFlow} disabled={!hasAnswer} />}
    >
      <View style={styles.topRow}>
        <BackButton onPress={onExit} label="Thoát" />
        <Text style={styles.counter}>Câu {index + 1}/{questions.length}</Text>
      </View>
      <ProgressBar value={(index + 1) / questions.length} label={`Câu ${index + 1} trên ${questions.length}`} />

      <View style={styles.questionBlock}>
        <Pill tone="primary">{SKILLS[question.skillId].area}</Pill>
        <Text style={styles.question}>{question.prompt}</Text>
        <Text style={styles.hint}>Chọn đáp án phù hợp nhất.</Text>
      </View>

      <View style={styles.answers} accessibilityRole="radiogroup">
        {question.options.map((option, optionIndex) => {
          const isSelected = selected === optionIndex;
          return (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityLabel={`${String.fromCharCode(65 + optionIndex)}. ${option}`}
              accessibilityState={{ checked: isSelected }}
              onPress={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
              style={({ pressed }) => [styles.answer, isSelected && styles.answerSelected, pressed && styles.pressed]}
            >
              <View style={[styles.answerLetter, isSelected && styles.answerLetterSelected]}>
                <Text style={[styles.answerLetterText, isSelected && styles.answerLetterTextSelected]}>{String.fromCharCode(65 + optionIndex)}</Text>
              </View>
              <Text style={styles.answerText}>{option}</Text>
              {isSelected ? <Icon name="check" size={20} color={colors.primary} /> : null}
            </Pressable>
          );
        })}
        <Pressable
          accessibilityRole="radio"
          accessibilityLabel="Em chưa biết"
          accessibilityState={{ checked: selected === -1 }}
          onPress={() => setAnswers((current) => ({ ...current, [question.id]: -1 }))}
          style={({ pressed }) => [styles.unknown, selected === -1 && styles.unknownSelected, pressed && styles.pressed]}
        >
          <Icon name="alert" size={20} color={selected === -1 ? colors.warning : colors.muted} />
          <Text style={styles.unknownText}>Em chưa biết</Text>
        </Pressable>
      </View>
      <ContentReportControl key={question.id} kind="question" hasReport={reportedContentRefs?.includes(`${question.id}:${question.version}`) ?? false} onReport={(reason) => onReport?.(question, reason)} />
    </Screen>
  );
}

export function DiagnosticResultScreen({ result, onStart }: { result: DiagnosticResult; onStart: () => void }) {
  const ordered = sortSkillsForReview(result.skillScores);
  const priority = ordered[0];
  const observations = result.skillScores.reduce((sum, skill) => sum + skill.total, 0);
  const repeatedSkills = result.skillScores.filter((skill) => skill.total >= 2).length;

  return (
    <Screen testID="diagnostic-result" footer={<Button label="Bắt đầu nhiệm vụ đầu tiên" onPress={onStart} />}>
      <Text style={styles.resultIndex}>01 / ĐIỂM BẮT ĐẦU</Text>
      <Text style={styles.resultTitle}>Bài đầu tiên: {SKILLS[priority.skillId].title}</Text>
      <Text style={styles.resultBody}>Em vừa làm {observations} câu ở {result.skillScores.length} phần. Mới có {repeatedSkills} phần được hỏi hơn một lần, nên đây vẫn là gợi ý ban đầu.</Text>

      <View style={styles.priorityCard}>
        <View style={styles.priorityTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardLabel}>HỌC TRƯỚC</Text>
            <Text style={styles.priorityTitle}>{SKILLS[priority.skillId].title}</Text>
          </View>
          <Text style={styles.priorityBand}>{learningBand(priority.score, priority.total)}</Text>
        </View>
        <Text style={styles.priorityBody}>Bắt đầu bằng một bài giải thích ngắn, sau đó luyện lại với ví dụ gần giống.</Text>
      </View>

      <View style={styles.evidenceHeader}>
        <Text style={styles.sectionTitle}>Kết quả từng phần</Text>
        <Text style={styles.evidenceIntro}>Mỗi phần cần thêm vài lượt làm trước khi có thể kết luận chắc chắn.</Text>
      </View>
      <View style={styles.skillList}>
        {ordered.slice(0, 3).map((skill) => (
          <View key={skill.skillId} style={styles.skillRow}>
            <View style={styles.skillCopy}>
              <Text style={styles.skillTitle}>{SKILLS[skill.skillId].title}</Text>
              <Text style={styles.skillEvidence}>Đúng {skill.correct}/{skill.total} câu · {evidenceConfidence(skill.total)}</Text>
            </View>
            <Text style={[styles.band, skill.total < 2 ? styles.bandNeutral : skill.score < 50 ? styles.bandWarning : styles.bandSuccess]}>{learningBand(skill.score, skill.total)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.note}>
        <Icon name="alert" size={20} color={colors.warning} />
        <Text style={styles.noteText}>Một câu đúng chưa có nghĩa là đã vững. Kết quả này sẽ thay đổi khi em học thêm.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: { minHeight: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  counter: { ...type.label, color: colors.muted, paddingTop: 14 },
  questionBlock: { marginTop: spacing.xxl, marginBottom: spacing.xl },
  question: { ...type.title, color: colors.ink, marginTop: spacing.md },
  hint: { ...type.body, color: colors.muted, marginTop: spacing.xs },
  answers: { gap: spacing.sm },
  answer: { minHeight: 64, flexDirection: 'row', alignItems: 'center', padding: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line },
  answerSelected: { borderLeftWidth: 3, borderLeftColor: colors.accent, backgroundColor: colors.surface },
  answerLetter: { width: 32, height: 32, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, marginRight: spacing.sm },
  answerLetterSelected: { backgroundColor: colors.primary },
  answerLetterText: { ...type.label, color: colors.inkSoft },
  answerLetterTextSelected: { color: colors.white },
  answerText: { ...type.bodyStrong, color: colors.ink, flex: 1 },
  unknown: { minHeight: 52, flexDirection: 'row', gap: spacing.sm, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: colors.line },
  unknownSelected: { borderLeftWidth: 3, borderLeftColor: colors.warning, backgroundColor: colors.warningSoft },
  unknownText: { ...type.label, color: colors.inkSoft },
  pressed: { opacity: 0.72 },
  resultIndex: { ...type.caption, color: colors.accent, letterSpacing: 0.8, marginTop: spacing.sm },
  resultTitle: { ...type.display, color: colors.ink, marginTop: spacing.lg },
  resultBody: { ...type.body, color: colors.muted, marginTop: spacing.sm },
  priorityCard: { borderLeftWidth: 3, borderLeftColor: colors.accent, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line, padding: spacing.lg, backgroundColor: colors.surface, marginTop: spacing.xl },
  priorityTop: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  cardLabel: { ...type.caption, color: colors.accent, letterSpacing: 0.8 },
  priorityTitle: { ...type.title, color: colors.ink, marginTop: spacing.xs },
  priorityBody: { ...type.body, color: colors.inkSoft, marginTop: spacing.md },
  priorityBand: { ...type.caption, color: colors.warning, maxWidth: 92, textAlign: 'right' },
  evidenceHeader: { marginTop: spacing.xl, gap: spacing.sm, alignItems: 'flex-start' },
  sectionTitle: { ...type.heading, color: colors.ink },
  evidenceIntro: { ...type.caption, color: colors.muted },
  skillList: { marginTop: spacing.sm, borderTopWidth: 1, borderColor: colors.line },
  skillRow: { minHeight: 76, flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line, gap: spacing.sm },
  skillCopy: { flex: 1 },
  skillTitle: { ...type.bodyStrong, color: colors.ink },
  skillEvidence: { ...type.caption, color: colors.muted, marginTop: 3 },
  band: { ...type.caption, textAlign: 'right', maxWidth: 95 },
  bandNeutral: { color: colors.muted },
  bandWarning: { color: colors.warning },
  bandSuccess: { color: colors.success },
  note: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.warning, marginTop: spacing.md },
  noteText: { ...type.caption, color: colors.inkSoft, flex: 1 },
});
