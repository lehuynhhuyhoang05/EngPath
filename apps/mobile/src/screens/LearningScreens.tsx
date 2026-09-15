import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Lesson, PronunciationPrompt } from '../domain/models';
import { BackButton, Button, Icon, Pill, ProgressBar, Screen, TextButton } from '../ui/components';
import { colors, radii, spacing, type } from '../ui/theme';

export function LessonScreen({ lesson, onBack, onComplete }: { lesson: Lesson; onBack: () => void; onComplete: () => void }) {
  const [selected, setSelected] = useState<number>();
  const [checked, setChecked] = useState(false);
  const [reported, setReported] = useState(false);
  const correct = selected === lesson.question.correctOptionIndex;

  return (
    <Screen
      testID="lesson-screen"
      footer={<Button label={checked ? 'Hoàn thành bài' : 'Kiểm tra đáp án'} onPress={checked ? onComplete : () => setChecked(true)} disabled={selected === undefined} icon={checked ? 'check' : 'arrow-right'} />}
    >
      <View style={styles.lessonTop}><BackButton onPress={onBack} /><Pill tone="primary">8 phút</Pill></View>
      <Text style={styles.stepLabel}>HIỂU · BƯỚC 1/4</Text>
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.lead}>{lesson.summary}</Text>
      <ProgressBar value={checked ? 0.75 : 0.45} label={checked ? 'Bước giải thích' : 'Bước thử'} />

      <View style={styles.ruleCard}>
        <View style={styles.ruleHeading}><Text style={styles.ruleIndex}>01</Text><Text style={styles.ruleLabel}>QUY TẮC NGẮN</Text></View>
        <Text style={styles.ruleText}>{lesson.explanationVi}</Text>
        <View style={styles.example}><Text style={styles.exampleLabel}>VÍ DỤ</Text><Text style={styles.exampleText}>{lesson.example}</Text><Text style={styles.exampleVi}>{lesson.exampleVi}</Text></View>
      </View>

      <Text style={styles.stepLabel}>THỬ · BƯỚC 2/4</Text>
      <Text style={styles.question}>{lesson.question.prompt}</Text>
      <View style={styles.answers} accessibilityRole="radiogroup">
        {lesson.question.options.map((option, index) => {
          const isSelected = selected === index;
          const showCorrect = checked && index === lesson.question.correctOptionIndex;
          const showWrong = checked && isSelected && !correct;
          return (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityLabel={`${String.fromCharCode(65 + index)}. ${option}`}
              accessibilityState={{ checked: isSelected, disabled: checked }}
              disabled={checked}
              onPress={() => setSelected(index)}
              style={({ pressed }) => [styles.answer, isSelected && styles.answerSelected, showCorrect && styles.answerCorrect, showWrong && styles.answerWrong, pressed && styles.pressed]}
            >
              <Text style={styles.answerLetter}>{String.fromCharCode(65 + index)}</Text>
              <Text style={styles.answerText}>{option}</Text>
              {showCorrect ? <Icon name="check" color={colors.success} /> : showWrong ? <Icon name="alert" color={colors.danger} /> : null}
            </Pressable>
          );
        })}
      </View>

      {checked ? (
        <View accessibilityLiveRegion="polite" style={[styles.feedback, correct ? styles.feedbackCorrect : styles.feedbackWrong]}>
          <View style={styles.feedbackTitleRow}><Icon name={correct ? 'check' : 'alert'} color={correct ? colors.success : colors.danger} /><Text style={[styles.feedbackTitle, { color: correct ? colors.success : colors.danger }]}>{correct ? 'Đúng rồi' : 'Mình sửa chỗ này nhé'}</Text></View>
          <Text style={styles.feedbackBody}>{correct ? lesson.question.explanationVi : `${lesson.question.commonErrorVi} ${lesson.question.explanationVi}`}</Text>
          {!correct ? <Text style={styles.nearExample}>Ví dụ gần giống: {lesson.example}</Text> : null}
        </View>
      ) : null}

      {!reported ? <TextButton label="Báo nội dung có vấn đề" onPress={() => setReported(true)} /> : <Text accessibilityLiveRegion="polite" style={styles.reported}>Đã ghi nhận. Tính năng gửi báo cáo cho đội nội dung sẽ được thêm sau.</Text>}
    </Screen>
  );
}

type PronunciationPhase = 'ready' | 'countdown' | 'recording' | 'review' | 'result' | 'denied';

export function PronunciationScreen({ prompt, bestScore, onBack, onScore, onComplete }: {
  prompt: PronunciationPrompt;
  bestScore?: number;
  onBack: () => void;
  onScore: (score: number) => void;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<PronunciationPhase>('ready');
  const [countdown, setCountdown] = useState(3);
  const [samplePlayed, setSamplePlayed] = useState(false);

  useEffect(() => {
    if (phase !== 'countdown') return;
    const timer = setTimeout(() => {
      if (countdown <= 1) {
        setCountdown(0);
        setPhase('recording');
      } else {
        setCountdown((value) => value - 1);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [countdown, phase]);

  const start = () => { setCountdown(3); setPhase('countdown'); };
  const retry = () => { setCountdown(3); setPhase('ready'); };
  const showResult = () => { onScore(82); setPhase('result'); };

  const footer = phase === 'ready' ? <Button label="Thu bản thử" onPress={start} icon="mic" />
    : phase === 'countdown' ? <Button label="Hủy đếm ngược" onPress={() => setPhase('ready')} tone="secondary" icon={null} />
      : phase === 'recording' ? <Button label="Dừng bản thu mô phỏng" onPress={() => setPhase('review')} icon="check" />
        : phase === 'review' ? <Button label="Xem phản hồi mô phỏng" onPress={showResult} />
          : phase === 'denied' ? <Button label="Thử cấp quyền lại" onPress={retry} tone="secondary" icon="rotate" />
            : <View style={styles.footerStack}><Button label="Thử lại" onPress={retry} icon="rotate" /><TextButton label="Hoàn thành" onPress={onComplete} /></View>;

  return (
    <Screen testID="pronunciation-screen" footer={footer}>
      <View style={styles.lessonTop}><BackButton onPress={onBack} /><Pill tone="warning">Mô phỏng UX</Pill></View>
      <Text style={styles.stepLabel}>PHÁT ÂM · ÂM /θ/</Text>
      <Text style={styles.title}>Luyện âm /θ/ trong một câu</Text>
      <Text style={styles.lead}>Đây là bản mô phỏng: app chưa dùng micro, chưa thu và chưa gửi âm thanh.</Text>

      <View style={styles.speechCard}>
        <Pressable accessibilityRole="button" accessibilityLabel="Nghe câu mẫu mô phỏng" onPress={() => setSamplePlayed(true)} style={({ pressed }) => [styles.listenButton, pressed && styles.pressed]}>
          <Icon name="headphones" color={colors.primary} />
          <Text style={styles.listenText}>{samplePlayed ? 'Đã phát mẫu mô phỏng' : 'Nghe mẫu'}</Text>
        </Pressable>
        <Text style={styles.speechText}>{prompt.text}</Text>
        <Text style={styles.speechLocale}>Giọng {prompt.locale}</Text>
        <View style={styles.waveform}>{[18, 30, 42, 25, 50, 34, 55, 27, 44, 31, 48].map((height, index) => <View key={`${height}-${index}`} style={[styles.wave, { height }]} />)}</View>
      </View>

      <View style={styles.tipCard}>
        <View style={styles.tipIcon}><Icon name="target" color={colors.warning} /></View>
        <View style={{ flex: 1 }}><Text style={styles.tipTitle}>Mẹo khẩu hình</Text><Text style={styles.tipBody}>{prompt.remediationVi}</Text></View>
      </View>

      {phase === 'countdown' ? <View accessibilityLiveRegion="assertive" style={styles.recordState}><Text style={styles.countdown}>{countdown || 'Nói'}</Text><Text style={styles.recordStateText}>Chuẩn bị đọc câu trên</Text></View> : null}
      {phase === 'recording' ? <View accessibilityLiveRegion="assertive" style={[styles.recordState, styles.recording]}><View style={styles.recordDot} /><Text style={styles.recordingTitle}>Đang mô phỏng thu âm…</Text><Text style={styles.recordStateText}>Đọc chậm và nhấn dừng khi hoàn tất</Text></View> : null}
      {phase === 'review' ? <View accessibilityLiveRegion="polite" style={styles.reviewCard}><Icon name="play" size={34} color={colors.primary} /><Text style={styles.reviewTitle}>Bản thu mô phỏng đã sẵn sàng</Text><Text style={styles.reviewBody}>Trong bản thật, em sẽ nghe lại giọng của mình trước khi gửi chấm.</Text></View> : null}
      {phase === 'result' ? (
        <View accessibilityLiveRegion="polite" style={styles.resultCard}>
          <View style={styles.resultTop}><View style={styles.resultIcon}><Icon name="check" size={27} color={colors.success} /></View><View style={{ flex: 1 }}><Text style={styles.resultLabel}>KẾT QUẢ DỄ HIỂU</Text><Text style={styles.resultTitle}>Gần đúng</Text></View></View>
          <View style={styles.focusRow}><Text style={styles.focusWord}>think</Text><Pill tone="warning">Cần sửa âm /θ/</Pill></View>
          <Text style={styles.resultBody}>Đưa nhẹ đầu lưỡi ra giữa hai hàm răng và đẩy hơi. Thử chậm từ “think” trước khi đọc cả câu.</Text>
          {bestScore !== undefined ? <Text style={styles.mockScore}>Dữ liệu kỹ thuật mô phỏng: {Math.max(bestScore, 82)}/100 — không phải đánh giá thật.</Text> : null}
        </View>
      ) : null}
      {phase === 'denied' ? (
        <View accessibilityLiveRegion="polite" style={styles.deniedCard}><Icon name="mic" size={30} color={colors.danger} /><Text style={styles.deniedTitle}>EngPath chưa được dùng micro</Text><Text style={styles.deniedBody}>Em vẫn có thể nghe mẫu và học phần khác. Khi sẵn sàng, mở Cài đặt để cấp quyền rồi quay lại.</Text><TextButton label="Tiếp tục mà không dùng micro" onPress={onBack} /></View>
      ) : null}

      {phase === 'ready' ? <TextButton label="Xem thử trạng thái khi từ chối micro" onPress={() => setPhase('denied')} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  lessonTop: { minHeight: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  stepLabel: { ...type.caption, color: colors.primary, letterSpacing: 0.9, marginTop: spacing.md },
  title: { ...type.title, color: colors.ink, marginTop: spacing.xs },
  lead: { ...type.body, color: colors.muted, marginTop: spacing.xs, marginBottom: spacing.lg },
  ruleCard: { borderLeftWidth: 3, borderLeftColor: colors.accent, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line, padding: spacing.lg, backgroundColor: colors.surface, marginVertical: spacing.xl },
  ruleHeading: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  ruleIndex: { color: colors.lineStrong, fontSize: 27, lineHeight: 32, fontWeight: '500' },
  ruleLabel: { ...type.caption, color: colors.accent, letterSpacing: 0.8 },
  ruleText: { ...type.bodyStrong, color: colors.ink, marginTop: spacing.xs },
  example: { borderLeftWidth: 2, borderLeftColor: colors.primary, paddingLeft: spacing.md, paddingVertical: spacing.xs, marginTop: spacing.lg },
  exampleLabel: { ...type.caption, color: colors.primary },
  exampleText: { ...type.bodyStrong, color: colors.ink, marginTop: spacing.xs },
  exampleVi: { ...type.caption, color: colors.muted, marginTop: 2 },
  question: { ...type.heading, color: colors.ink, marginTop: spacing.xs, marginBottom: spacing.md },
  answers: { borderTopWidth: 1, borderTopColor: colors.line },
  answer: { minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line },
  answerSelected: { borderLeftWidth: 3, borderLeftColor: colors.accent, backgroundColor: colors.surface },
  answerCorrect: { borderColor: colors.success, backgroundColor: colors.successSoft },
  answerWrong: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  answerLetter: { ...type.label, color: colors.muted, width: 26, textAlign: 'center' },
  answerText: { ...type.bodyStrong, color: colors.ink, flex: 1 },
  pressed: { opacity: 0.72 },
  feedback: { borderLeftWidth: 3, padding: spacing.md, marginTop: spacing.md },
  feedbackCorrect: { backgroundColor: colors.successSoft, borderLeftColor: colors.success },
  feedbackWrong: { backgroundColor: colors.dangerSoft, borderLeftColor: colors.danger },
  feedbackTitleRow: { flexDirection: 'row', gap: spacing.xs, alignItems: 'center' },
  feedbackTitle: { ...type.heading },
  feedbackBody: { ...type.body, color: colors.inkSoft, marginTop: spacing.xs },
  nearExample: { ...type.bodyStrong, color: colors.ink, marginTop: spacing.sm },
  reported: { ...type.caption, color: colors.success, textAlign: 'center', paddingVertical: spacing.md },
  speechCard: { alignItems: 'center', paddingVertical: spacing.xl, borderTopWidth: 3, borderTopColor: colors.accent, borderBottomWidth: 1, borderBottomColor: colors.line },
  listenButton: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, borderRadius: radii.md, borderWidth: 1, borderColor: colors.primary },
  listenText: { ...type.label, color: colors.primary },
  speechText: { fontSize: 25, lineHeight: 34, fontWeight: '700', color: colors.ink, textAlign: 'center', marginTop: spacing.lg },
  speechLocale: { ...type.caption, color: colors.muted, marginTop: spacing.xs },
  waveform: { height: 60, flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.md },
  wave: { width: 4, borderRadius: 2, backgroundColor: colors.primary },
  tipCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, borderLeftWidth: 3, borderLeftColor: colors.warning, padding: spacing.md, backgroundColor: colors.warningSoft, marginTop: spacing.md },
  tipIcon: { width: 36, height: 44, alignItems: 'flex-start', justifyContent: 'center' },
  tipTitle: { ...type.label, color: colors.warning },
  tipBody: { ...type.body, color: colors.inkSoft, marginTop: 2 },
  recordState: { minHeight: 150, alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.primary, backgroundColor: colors.primarySoft, marginTop: spacing.md, padding: spacing.lg },
  countdown: { fontSize: 48, lineHeight: 56, fontWeight: '700', color: colors.primary },
  recordStateText: { ...type.body, color: colors.muted, textAlign: 'center', marginTop: spacing.xs },
  recording: { backgroundColor: colors.dangerSoft },
  recordDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.danger, marginBottom: spacing.sm },
  recordingTitle: { ...type.heading, color: colors.danger },
  reviewCard: { alignItems: 'center', borderLeftWidth: 3, borderLeftColor: colors.primary, padding: spacing.lg, backgroundColor: colors.primarySoft, marginTop: spacing.md },
  reviewTitle: { ...type.heading, color: colors.ink, marginTop: spacing.sm, textAlign: 'center' },
  reviewBody: { ...type.body, color: colors.muted, marginTop: spacing.xs, textAlign: 'center' },
  resultCard: { borderLeftWidth: 3, borderLeftColor: colors.success, padding: spacing.lg, backgroundColor: colors.successSoft, marginTop: spacing.md },
  resultTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  resultIcon: { width: 40, height: 52, alignItems: 'flex-start', justifyContent: 'center' },
  resultLabel: { ...type.caption, color: colors.success, letterSpacing: 0.8 },
  resultTitle: { ...type.title, color: colors.ink },
  focusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg },
  focusWord: { fontSize: 24, lineHeight: 30, fontWeight: '700', color: colors.ink },
  resultBody: { ...type.body, color: colors.inkSoft, marginTop: spacing.sm },
  mockScore: { ...type.caption, color: colors.muted, marginTop: spacing.md },
  deniedCard: { alignItems: 'center', borderTopWidth: 3, borderTopColor: colors.danger, padding: spacing.lg, backgroundColor: colors.dangerSoft, marginTop: spacing.md },
  deniedTitle: { ...type.heading, color: colors.danger, marginTop: spacing.sm, textAlign: 'center' },
  deniedBody: { ...type.body, color: colors.inkSoft, marginTop: spacing.xs, textAlign: 'center' },
  footerStack: { gap: spacing.xs },
});
