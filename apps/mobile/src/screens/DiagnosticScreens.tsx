import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { evidenceConfidence, learningBand, sortSkillsForReview } from '../domain/diagnosticPresentation';
import type { ChoiceQuestion, DiagnosticResult } from '../domain/models';
import { SKILLS } from '../data/seed';
import { BackButton, Button, Icon, Pill, ProgressBar, Screen } from '../ui/components';
import { colors, radii, spacing, type } from '../ui/theme';

export function DiagnosticScreen({ questions, onComplete, onExit }: {
  questions: ChoiceQuestion[];
  onComplete: (answers: Record<string, number>) => void;
  onExit: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const question = questions[index];
  const selected = answers[question.id];
  const hasAnswer = selected !== undefined;

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
    </Screen>
  );
}

export function DiagnosticResultScreen({ result, onStart }: { result: DiagnosticResult; onStart: () => void }) {
  const ordered = sortSkillsForReview(result.skillScores);
  const priority = ordered[0];
  const observations = result.skillScores.reduce((sum, skill) => sum + skill.total, 0);

  return (
    <Screen testID="diagnostic-result" footer={<Button label="Bắt đầu nhiệm vụ đầu tiên" onPress={onStart} />}>
      <View style={styles.resultIcon}><Icon name="target" size={32} color={colors.primary} /></View>
      <Text style={styles.resultTitle}>Em nên bắt đầu từ {SKILLS[priority.skillId].title}</Text>
      <Text style={styles.resultBody}>Đây là lộ trình tạm dựa trên {observations} câu vừa quan sát. Kết quả sẽ được cập nhật sau mỗi buổi học.</Text>

      <View style={styles.priorityCard}>
        <View style={styles.priorityTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardLabel}>ƯU TIÊN ĐẦU TIÊN</Text>
            <Text style={styles.priorityTitle}>{SKILLS[priority.skillId].title}</Text>
          </View>
          <Pill tone="warning">{learningBand(priority.score)}</Pill>
        </View>
        <Text style={styles.priorityBody}>Bắt đầu bằng một bài giải thích ngắn, sau đó luyện lại với ví dụ gần giống.</Text>
      </View>

      <View style={styles.evidenceHeader}>
        <Text style={styles.sectionTitle}>Những gì EngPath đã quan sát</Text>
        <Pill tone="neutral">Tin cậy: {evidenceConfidence(observations)}</Pill>
      </View>
      <View style={styles.skillList}>
        {ordered.slice(0, 3).map((skill) => (
          <View key={skill.skillId} style={styles.skillRow}>
            <View style={styles.skillCopy}>
              <Text style={styles.skillTitle}>{SKILLS[skill.skillId].title}</Text>
              <Text style={styles.skillEvidence}>{skill.correct}/{skill.total} câu quan sát · Tin cậy {evidenceConfidence(skill.total).toLowerCase()}</Text>
            </View>
            <Text style={[styles.band, skill.score < 50 ? styles.bandWarning : styles.bandSuccess]}>{learningBand(skill.score)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.note}>
        <Icon name="alert" size={20} color={colors.warning} />
        <Text style={styles.noteText}>Một câu đúng chưa có nghĩa là đã thành thạo. EngPath cần thêm lần luyện để tăng độ tin cậy.</Text>
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
  answer: { minHeight: 64, flexDirection: 'row', alignItems: 'center', padding: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radii.lg, backgroundColor: colors.surface },
  answerSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  answerLetter: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceMuted, marginRight: spacing.sm },
  answerLetterSelected: { backgroundColor: colors.primary },
  answerLetterText: { ...type.label, color: colors.inkSoft },
  answerLetterTextSelected: { color: colors.white },
  answerText: { ...type.bodyStrong, color: colors.ink, flex: 1 },
  unknown: { minHeight: 52, flexDirection: 'row', gap: spacing.sm, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  unknownSelected: { borderColor: colors.warning, backgroundColor: colors.warningSoft },
  unknownText: { ...type.label, color: colors.inkSoft },
  pressed: { opacity: 0.72 },
  resultIcon: { width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft },
  resultTitle: { ...type.display, color: colors.ink, marginTop: spacing.lg },
  resultBody: { ...type.body, color: colors.muted, marginTop: spacing.sm },
  priorityCard: { borderRadius: radii.hero, padding: spacing.lg, backgroundColor: colors.scrim, marginTop: spacing.xl },
  priorityTop: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  cardLabel: { ...type.caption, color: '#BCC9F8', letterSpacing: 0.8 },
  priorityTitle: { ...type.title, color: colors.white, marginTop: spacing.xs },
  priorityBody: { ...type.body, color: '#CFD6E5', marginTop: spacing.md },
  evidenceHeader: { marginTop: spacing.xl, gap: spacing.sm, alignItems: 'flex-start' },
  sectionTitle: { ...type.heading, color: colors.ink },
  skillList: { marginTop: spacing.sm, borderRadius: radii.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  skillRow: { minHeight: 76, flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line, gap: spacing.sm },
  skillCopy: { flex: 1 },
  skillTitle: { ...type.bodyStrong, color: colors.ink },
  skillEvidence: { ...type.caption, color: colors.muted, marginTop: 3 },
  band: { ...type.caption, textAlign: 'right', maxWidth: 95 },
  bandWarning: { color: colors.warning },
  bandSuccess: { color: colors.success },
  note: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.warningSoft, marginTop: spacing.md },
  noteText: { ...type.caption, color: colors.inkSoft, flex: 1 },
});
