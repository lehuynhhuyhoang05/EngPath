import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GOALS, GRADES } from '../data/seed';
import type { GoalId, Grade, LearnerProfile } from '../domain/models';
import { Brand, Button, Icon, Pill, Screen } from '../ui/components';
import { colors, radii, spacing, type } from '../ui/theme';

export function OnboardingScreen({ initialProfile, onContinue }: { initialProfile?: LearnerProfile; onContinue: (profile: LearnerProfile) => void }) {
  const [grade, setGrade] = useState<Grade>(initialProfile?.grade ?? 9);
  const [goalId, setGoalId] = useState<GoalId>(initialProfile?.goalId ?? 'exam-10');
  const availableGoals = useMemo(() => GOALS.filter((goal) => goal.id !== 'exam-10' || grade === 9), [grade]);

  const selectGrade = (nextGrade: Grade) => {
    setGrade(nextGrade);
    if (nextGrade !== 9 && goalId === 'exam-10') setGoalId('school-support');
  };

  return (
    <Screen
      testID="onboarding-screen"
      footer={<Button label="Tiếp tục" onPress={() => onContinue({ grade, goalId })} />}
    >
      <Brand />
      <View style={styles.hero}>
        <Pill tone="primary">Thiết kế riêng cho lớp 6–9</Pill>
        <Text style={styles.title}>Hôm nay em muốn tiến bộ điều gì?</Text>
        <Text style={styles.body}>Chọn lớp và mục tiêu. EngPath sẽ đề xuất một đường học ngắn, không cần tạo tài khoản.</Text>
      </View>

      <Text style={styles.sectionTitle}>Em đang học lớp</Text>
      <View style={styles.gradeRow}>
        {GRADES.map((item) => {
          const selected = grade === item;
          return (
            <Pressable
              key={item}
              accessibilityRole="radio"
              accessibilityLabel={`Lớp ${item}`}
              accessibilityState={{ checked: selected }}
              onPress={() => selectGrade(item)}
              style={({ pressed }) => [styles.grade, selected && styles.gradeSelected, pressed && styles.pressed]}
            >
              <Text style={[styles.gradePrefix, selected && styles.selectedText]}>LỚP</Text>
              <Text style={[styles.gradeNumber, selected && styles.selectedText]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Mục tiêu chính</Text>
      <View style={styles.goalList} accessibilityRole="radiogroup">
        {availableGoals.map((goal) => {
          const selected = goal.id === goalId;
          return (
            <Pressable
              key={goal.id}
              accessibilityRole="radio"
              accessibilityLabel={`${goal.title}. ${goal.description}`}
              accessibilityState={{ checked: selected }}
              onPress={() => setGoalId(goal.id)}
              style={({ pressed }) => [styles.goal, selected && styles.goalSelected, pressed && styles.pressed]}
            >
              <View style={[styles.goalIcon, selected && styles.goalIconSelected]}>
                <Icon name={goal.id === 'pronunciation' ? 'mic' : goal.id === 'exam-10' ? 'flag' : goal.id === 'foundation-repair' ? 'rotate' : 'book'} color={selected ? colors.primary : colors.muted} />
              </View>
              <View style={styles.goalCopy}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalBody}>{goal.description}</Text>
              </View>
              <View style={[styles.radio, selected && styles.radioSelected]}>{selected ? <View style={styles.radioDot} /> : null}</View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

export function DiagnosticIntroScreen({ grade, onStart, onBack }: { grade: Grade; onStart: () => void; onBack: () => void }) {
  return (
    <Screen footer={<Button label="Bắt đầu chẩn đoán" onPress={onStart} />}>
      <Pressable accessibilityRole="button" accessibilityLabel="Quay lại chọn mục tiêu" onPress={onBack} style={styles.inlineBack}>
        <Icon name="arrow-left" size={20} color={colors.ink} />
        <Text style={styles.inlineBackText}>Chọn lại</Text>
      </Pressable>
      <View style={styles.introIcon}><Icon name="target" size={34} color={colors.primary} /></View>
      <Text style={styles.introTitle}>Tìm điểm bắt đầu phù hợp cho lớp {grade}</Text>
      <Text style={styles.introBody}>Khoảng 3–5 phút, mỗi màn hình một câu. Nếu chưa chắc, em có thể chọn “Em chưa biết” thay vì đoán.</Text>
      <View style={styles.factList}>
        <Fact icon="clock" text="Tối đa 9 câu ngắn" />
        <Fact icon="target" text="Không tính điểm hay xếp hạng" />
        <Fact icon="lock" text="Kết quả được lưu trên thiết bị này" />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Kết quả ban đầu chỉ là ước lượng</Text>
        <Text style={styles.infoBody}>EngPath sẽ điều chỉnh lộ trình khi có thêm bằng chứng từ những buổi học sau.</Text>
      </View>
    </Screen>
  );
}

function Fact({ icon, text }: { icon: 'clock' | 'target' | 'lock'; text: string }) {
  return <View style={styles.fact}><Icon name={icon} size={21} color={colors.primary} /><Text style={styles.factText}>{text}</Text></View>;
}

const styles = StyleSheet.create({
  hero: { marginTop: spacing.xxl, marginBottom: spacing.xl },
  title: { ...type.display, color: colors.ink, marginTop: spacing.md },
  body: { ...type.body, color: colors.muted, marginTop: spacing.sm },
  sectionTitle: { ...type.heading, color: colors.ink, marginBottom: spacing.sm },
  gradeRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.xl },
  grade: { flex: 1, minHeight: 72, borderWidth: 1, borderColor: colors.line, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  gradeSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  gradePrefix: { ...type.caption, color: colors.muted, fontSize: 10 },
  gradeNumber: { color: colors.ink, fontSize: 25, lineHeight: 30, fontWeight: '700' },
  selectedText: { color: colors.white },
  goalList: { gap: spacing.sm },
  goal: { minHeight: 88, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: radii.lg, padding: spacing.sm, backgroundColor: colors.surface },
  goalSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  goalIcon: { width: 48, height: 48, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceMuted },
  goalIconSelected: { backgroundColor: colors.surface },
  goalCopy: { flex: 1, marginHorizontal: spacing.sm },
  goalTitle: { ...type.bodyStrong, color: colors.ink },
  goalBody: { ...type.caption, color: colors.muted, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  pressed: { opacity: 0.72 },
  inlineBack: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'flex-start' },
  inlineBackText: { ...type.label, color: colors.ink },
  introIcon: { width: 68, height: 68, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft, marginTop: spacing.lg },
  introTitle: { ...type.display, color: colors.ink, marginTop: spacing.lg },
  introBody: { ...type.body, color: colors.muted, marginTop: spacing.sm },
  factList: { marginTop: spacing.xl, gap: spacing.md },
  fact: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  factText: { ...type.bodyStrong, color: colors.ink, flex: 1 },
  infoBox: { borderRadius: radii.lg, padding: spacing.md, backgroundColor: colors.warningSoft, marginTop: spacing.xl },
  infoTitle: { ...type.label, color: colors.warning },
  infoBody: { ...type.caption, color: colors.inkSoft, marginTop: spacing.xs },
});
