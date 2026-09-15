import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GOALS, LESSONS_BY_SKILL, SKILLS } from '../data/seed';
import { evidenceConfidence, learningBand, sortSkillsForReview } from '../domain/diagnosticPresentation';
import type { LearnerProfile, Lesson, StoredAppState } from '../domain/models';
import { BackButton, Button, EmptyState, Icon, Pill, ProgressBar, Screen, TextButton } from '../ui/components';
import { colors, radii, spacing, type } from '../ui/theme';

function Header({ title, eyebrow, onProfile }: { title: string; eyebrow: string; onProfile: () => void }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerCopy}><Text style={styles.eyebrow}>{eyebrow}</Text><Text style={styles.screenTitle}>{title}</Text></View>
      <Pressable accessibilityRole="button" accessibilityLabel="Mở hồ sơ và cài đặt" onPress={onProfile} style={({ pressed }) => [styles.profileButton, pressed && styles.pressed]}>
        <Icon name="user" color={colors.primary} />
      </Pressable>
    </View>
  );
}

export function TodayScreen({ state, onLesson, onPronunciation, onExam, onProfile }: {
  state: StoredAppState;
  onLesson: () => void;
  onPronunciation: () => void;
  onExam: () => void;
  onProfile: () => void;
}) {
  const priorityId = state.diagnostic?.weakestSkillId ?? 'present-simple';
  const lesson = LESSONS_BY_SKILL[priorityId] ?? LESSONS_BY_SKILL['present-simple'];
  const examFocus = state.profile?.grade === 9 && state.profile.goalId === 'exam-10';

  return (
    <Screen testID="today-screen">
      <Header eyebrow={`LỚP ${state.profile?.grade ?? 9} · ${GOALS.find((goal) => goal.id === state.profile?.goalId)?.shortTitle ?? 'Tự học'}`} title="Hôm nay mình học 12 phút nhé" onProfile={onProfile} />

      <View style={styles.mission}>
        <View style={styles.missionTop}><Text style={styles.missionLabel}>NHIỆM VỤ HÔM NAY</Text><Pill tone="primary">8 phút</Pill></View>
        <View style={styles.missionIcon}><Icon name="target" size={28} color={colors.primary} /></View>
        <Text style={styles.missionTitle}>{lesson.title}</Text>
        <Text style={styles.missionBody}>Sửa một lỗ hổng từ bài chẩn đoán bằng quy tắc ngắn và một lần luyện có giải thích.</Text>
        <View style={styles.missionSteps}>
          <Step text="Hiểu quy tắc" />
          <Step text="Thử một câu" />
          <Step text="Xem giải thích" />
        </View>
        <Button label="Bắt đầu nhiệm vụ" onPress={onLesson} />
      </View>

      <Text style={styles.sectionTitle}>Ôn lại hôm nay</Text>
      <ActionRow icon="mic" title="Phát âm âm /θ/" meta="3 phút · Bản mô phỏng" onPress={onPronunciation} />

      {examFocus ? (
        <View style={styles.examPrompt}>
          <View style={styles.examIcon}><Icon name="flag" color={colors.warning} /></View>
          <View style={{ flex: 1 }}><Text style={styles.actionTitle}>Khu ôn thi vào 10</Text><Text style={styles.actionMeta}>Xem mục tiêu và dạng bài sắp có</Text></View>
          <Pressable accessibilityRole="button" accessibilityLabel="Mở khu ôn thi vào 10" onPress={onExam} style={styles.rowButton}><Icon name="arrow-right" color={colors.warning} /></Pressable>
        </View>
      ) : null}

      <View style={styles.gentleStreak}><Text style={styles.gentleStreakTitle}>Nhịp học tuần này</Text><Text style={styles.gentleStreakValue}>{state.completedSessions} buổi đã hoàn thành</Text><Text style={styles.gentleStreakBody}>Bỏ lỡ một ngày không làm mất tiến bộ đã có.</Text></View>
    </Screen>
  );
}

export function LearnScreen({ state, onLesson, onProfile }: { state: StoredAppState; onLesson: (lesson: Lesson) => void; onProfile: () => void }) {
  const lessons = useMemo(() => Object.values(LESSONS_BY_SKILL).filter((lesson) => lesson.grade <= (state.profile?.grade ?? 9)), [state.profile?.grade]);
  return (
    <Screen>
      <Header eyebrow="LỘ TRÌNH CÁ NHÂN" title="Học theo phần em cần" onProfile={onProfile} />
      <Text style={styles.lead}>Các chủ điểm dưới đây được xếp từ nền tảng đến kiến thức của lớp {state.profile?.grade}.</Text>
      <View style={styles.pathList}>
        {lessons.slice(0, 5).map((lesson, index) => {
          const complete = state.completedLessonIds.includes(lesson.id);
          const recommended = lesson.skillId === state.diagnostic?.weakestSkillId;
          return (
            <Pressable key={lesson.id} accessibilityRole="button" accessibilityLabel={`Mở bài ${lesson.title}`} onPress={() => onLesson(lesson)} style={({ pressed }) => [styles.pathItem, pressed && styles.pressed]}>
              <View style={[styles.pathIndex, complete && styles.pathIndexComplete]}>{complete ? <Icon name="check" size={18} color={colors.white} /> : <Text style={styles.pathIndexText}>{index + 1}</Text>}</View>
              <View style={{ flex: 1 }}>
                <View style={styles.pathTitleRow}><Text style={styles.pathTitle}>{lesson.title}</Text>{recommended ? <Pill tone="primary">Nên học</Pill> : null}</View>
                <Text style={styles.pathMeta}>{SKILLS[lesson.skillId].area} · 8 phút</Text>
              </View>
              <Icon name="arrow-right" size={20} color={colors.muted} />
            </Pressable>
          );
        })}
      </View>
      <View style={styles.draftNote}><Icon name="alert" size={20} color={colors.warning} /><Text style={styles.draftText}>Nội dung hiện là bộ mẫu có kiểm soát, chưa phải ngân hàng bài học hoàn chỉnh.</Text></View>
    </Screen>
  );
}

export function PracticeScreen({ profile, onPronunciation, onExam, onProfile }: { profile: LearnerProfile; onPronunciation: () => void; onExam: () => void; onProfile: () => void }) {
  return (
    <Screen>
      <Header eyebrow="LUYỆN KỸ NĂNG" title="Chọn một cách luyện" onProfile={onProfile} />
      <View style={styles.practiceHero}>
        <View style={styles.practiceHeroIcon}><Icon name="mic" size={30} color={colors.primary} /></View>
        <Pill tone="success">Cốt lõi EngPath</Pill>
        <Text style={styles.practiceTitle}>Luyện phát âm theo từng âm khó</Text>
        <Text style={styles.practiceBody}>Nghe mẫu, xem mẹo khẩu hình, thu thử và hiểu mình cần sửa gì.</Text>
        <Button label="Luyện âm /θ/" onPress={onPronunciation} />
      </View>

      <Text style={styles.sectionTitle}>Luyện thêm</Text>
      <View style={styles.secondaryCard}>
        <Icon name="rotate" color={colors.muted} />
        <View style={{ flex: 1 }}><Text style={styles.actionTitle}>Sổ lỗi sai</Text><Text style={styles.actionMeta}>Chưa có câu đến hạn ôn lại</Text></View>
        <Pill tone="neutral">Sắp có</Pill>
      </View>

      {profile.grade === 9 ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Mở khu ôn thi vào lớp 10" onPress={onExam} style={({ pressed }) => [styles.examCard, pressed && styles.pressed]}>
          <View style={styles.examIcon}><Icon name="flag" color={colors.warning} /></View>
          <View style={{ flex: 1 }}><Text style={styles.actionTitle}>Ôn thi vào lớp 10</Text><Text style={styles.actionMeta}>Không gian riêng cho dạng đề và mục tiêu điểm</Text></View>
          <Icon name="arrow-right" color={colors.warning} />
        </Pressable>
      ) : (
        <View style={styles.gradeNote}><Text style={styles.gradeNoteText}>Khu thi vào 10 chỉ xuất hiện khi hồ sơ chọn lớp 9.</Text></View>
      )}
    </Screen>
  );
}

export function ProgressScreen({ state, onProfile }: { state: StoredAppState; onProfile: () => void }) {
  const scores = sortSkillsForReview(state.diagnostic?.skillScores ?? []);
  return (
    <Screen>
      <Header eyebrow="TIẾN ĐỘ CÁ NHÂN" title="Tiến bộ đi cùng bằng chứng" onProfile={onProfile} />
      <View style={styles.stats}>
        <Stat value={String(state.completedSessions)} label="Buổi học" />
        <Stat value={String(state.completedLessonIds.length)} label="Bài xong" />
        <Stat value={state.pronunciationBestScore ? 'Đã thử' : 'Chưa thử'} label="Phát âm" />
      </View>
      <Text style={styles.sectionTitle}>Bản đồ kỹ năng ban đầu</Text>
      {scores.length ? (
        <View style={styles.progressList}>
          {scores.map((skill) => (
            <View key={skill.skillId} style={styles.progressItem}>
              <View style={styles.progressTop}><View style={{ flex: 1 }}><Text style={styles.pathTitle}>{SKILLS[skill.skillId].title}</Text><Text style={styles.actionMeta}>{skill.total} lần quan sát · Tin cậy {evidenceConfidence(skill.total).toLowerCase()}</Text></View><Text style={styles.progressBand}>{learningBand(skill.score)}</Text></View>
              <ProgressBar value={skill.score / 100} label={`${SKILLS[skill.skillId].title}: ${learningBand(skill.score)}`} />
            </View>
          ))}
        </View>
      ) : <EmptyState icon="chart" title="Chưa có dữ liệu tiến độ" body="Hoàn thành chẩn đoán để EngPath tạo bản đồ kỹ năng ban đầu." />}
      <View style={styles.draftNote}><Icon name="alert" size={20} color={colors.warning} /><Text style={styles.draftText}>Mức kỹ năng là ước lượng, không phải điểm số chính thức. Độ tin cậy tăng khi em luyện thêm.</Text></View>
    </Screen>
  );
}

export function ExamScreen({ onBack }: { onBack: () => void }) {
  return (
    <Screen footer={<Button label="Quay về khu Luyện" onPress={onBack} tone="secondary" icon="arrow-left" />}>
      <BackButton onPress={onBack} />
      <View style={styles.examLargeIcon}><Icon name="flag" size={34} color={colors.warning} /></View>
      <Text style={styles.screenTitle}>Khu ôn thi vào lớp 10</Text>
      <Text style={styles.lead}>Không trộn áp lực thi cử vào luồng học hằng ngày. Đây sẽ là nơi luyện theo dạng đề, xem phần mất điểm và quay lại kiến thức nền.</Text>
      <View style={styles.examStatus}>
        <Pill tone="warning">Khung UX M1</Pill>
        <Text style={styles.examStatusTitle}>Nội dung luyện đề chưa được mở</Text>
        <Text style={styles.examStatusBody}>Timer, cấu trúc đề theo tỉnh và chấm điểm chính xác thuộc M6, sau khi luồng học lõi được kiểm chứng.</Text>
      </View>
      <View style={styles.previewList}>
        <PreviewRow icon="target" title="Mục tiêu điểm" body="Thiết lập theo nhu cầu của em" />
        <PreviewRow icon="chart" title="Dạng câu cần ưu tiên" body="Dựa trên lỗi và kiến thức nền" />
        <PreviewRow icon="clock" title="Đề mô phỏng có lưu bài" body="Chống mất dữ liệu khi thoát app" />
      </View>
    </Screen>
  );
}

export function ProfileScreen({ profile, onBack, onReset }: { profile: LearnerProfile; onBack: () => void; onReset: () => void }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <Screen>
      <BackButton onPress={onBack} />
      <Text style={styles.screenTitle}>Hồ sơ học tập</Text>
      <Text style={styles.lead}>Thông tin này dùng để cá nhân hóa bản mẫu trên thiết bị.</Text>
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>{profile.grade}</Text></View>
        <View><Text style={styles.profileLabel}>HỌC SINH LỚP {profile.grade}</Text><Text style={styles.profileGoal}>{GOALS.find((goal) => goal.id === profile.goalId)?.title}</Text></View>
      </View>
      <View style={styles.privacyCard}><Icon name="lock" color={colors.success} /><View style={{ flex: 1 }}><Text style={styles.actionTitle}>Dữ liệu đang ở trên máy</Text><Text style={styles.actionMeta}>Bản M1 chưa có tài khoản, backend hoặc gửi bản thu âm.</Text></View></View>

      <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Kiểm thử bản mẫu</Text>
      {!confirming ? (
        <Button label="Đặt lại để xem onboarding" onPress={() => setConfirming(true)} tone="danger" icon="rotate" />
      ) : (
        <View style={styles.confirmCard}>
          <Text style={styles.confirmTitle}>Đặt lại toàn bộ tiến độ mẫu?</Text>
          <Text style={styles.confirmBody}>Thao tác này xóa lớp, mục tiêu, chẩn đoán và tiến độ đang lưu trên thiết bị.</Text>
          <Button label="Xác nhận đặt lại" onPress={onReset} tone="danger" icon="rotate" />
          <TextButton label="Giữ lại tiến độ" onPress={() => setConfirming(false)} />
        </View>
      )}
    </Screen>
  );
}

function Step({ text }: { text: string }) { return <View style={styles.step}><View style={styles.stepDot} /><Text style={styles.stepText}>{text}</Text></View>; }
function ActionRow({ icon, title, meta, onPress }: { icon: 'mic'; title: string; meta: string; onPress: () => void }) { return <Pressable accessibilityRole="button" accessibilityLabel={`${title}. ${meta}`} onPress={onPress} style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}><View style={styles.actionIcon}><Icon name={icon} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionMeta}>{meta}</Text></View><Icon name="arrow-right" color={colors.muted} /></Pressable>; }
function Stat({ value, label }: { value: string; label: string }) { return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>; }
function PreviewRow({ icon, title, body }: { icon: 'target' | 'chart' | 'clock'; title: string; body: string }) { return <View style={styles.previewRow}><View style={styles.actionIcon}><Icon name={icon} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionMeta}>{body}</Text></View></View>; }

const styles = StyleSheet.create({
  header: { minHeight: 82, flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line, paddingBottom: spacing.md },
  headerCopy: { flex: 1 },
  eyebrow: { ...type.caption, color: colors.primary, letterSpacing: 0.8 },
  screenTitle: { ...type.title, color: colors.ink, marginTop: spacing.xs },
  profileButton: { width: 48, height: 48, borderRadius: radii.md, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  pressed: { opacity: 0.72 },
  mission: { borderTopWidth: 3, borderTopColor: colors.accent, borderBottomWidth: 1, borderBottomColor: colors.line, paddingVertical: spacing.lg, backgroundColor: colors.surface, marginTop: spacing.lg, marginBottom: spacing.xl },
  missionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  missionLabel: { ...type.caption, color: colors.accent, letterSpacing: 0.8 },
  missionIcon: { width: 42, height: 42, alignItems: 'flex-start', justifyContent: 'center', marginTop: spacing.md },
  missionTitle: { ...type.title, color: colors.ink, marginTop: spacing.xs },
  missionBody: { ...type.body, color: colors.inkSoft, marginTop: spacing.xs },
  missionSteps: { marginVertical: spacing.md, gap: spacing.xs },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  stepDot: { width: 12, height: 2, backgroundColor: colors.accent },
  stepText: { ...type.caption, color: colors.muted },
  sectionTitle: { ...type.heading, color: colors.ink, marginBottom: spacing.sm },
  actionRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line },
  actionIcon: { width: 40, height: 48, alignItems: 'flex-start', justifyContent: 'center' },
  actionTitle: { ...type.bodyStrong, color: colors.ink },
  actionMeta: { ...type.caption, color: colors.muted, marginTop: 2 },
  gentleStreak: { borderLeftWidth: 3, borderLeftColor: colors.accent, paddingLeft: spacing.md, paddingVertical: spacing.xs, marginTop: spacing.xl },
  gentleStreakTitle: { ...type.label, color: colors.ink },
  gentleStreakValue: { ...type.heading, color: colors.primary, marginTop: spacing.xs },
  gentleStreakBody: { ...type.caption, color: colors.muted, marginTop: 2 },
  examPrompt: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderLeftWidth: 3, borderLeftColor: colors.warning, padding: spacing.sm, backgroundColor: colors.warningSoft, marginTop: spacing.sm },
  examIcon: { width: 40, height: 48, alignItems: 'flex-start', justifyContent: 'center' },
  rowButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  lead: { ...type.body, color: colors.muted, marginTop: spacing.sm, marginBottom: spacing.xl },
  pathList: { borderTopWidth: 1, borderTopColor: colors.line },
  pathItem: { minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line, paddingVertical: spacing.sm },
  pathIndex: { width: 36, height: 36, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: colors.surface },
  pathIndexComplete: { backgroundColor: colors.success },
  pathIndexText: { ...type.label, color: colors.inkSoft },
  pathTitleRow: { flexDirection: 'row', gap: spacing.xs, alignItems: 'center', flexWrap: 'wrap' },
  pathTitle: { ...type.bodyStrong, color: colors.ink },
  pathMeta: { ...type.caption, color: colors.muted, marginTop: 2 },
  draftNote: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.warning, marginTop: spacing.lg },
  draftText: { ...type.caption, color: colors.inkSoft, flex: 1 },
  practiceHero: { borderLeftWidth: 3, borderLeftColor: colors.accent, paddingLeft: spacing.lg, paddingVertical: spacing.sm, marginTop: spacing.xl, marginBottom: spacing.xxl },
  practiceHeroIcon: { width: 48, height: 48, alignItems: 'flex-start', justifyContent: 'center', marginBottom: spacing.sm },
  practiceTitle: { ...type.title, color: colors.ink, marginTop: spacing.md },
  practiceBody: { ...type.body, color: colors.muted, marginTop: spacing.xs, marginBottom: spacing.md },
  secondaryCard: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line },
  examCard: { minHeight: 84, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderLeftWidth: 3, borderLeftColor: colors.warning, padding: spacing.sm, backgroundColor: colors.warningSoft, marginTop: spacing.md },
  gradeNote: { borderLeftWidth: 3, borderLeftColor: colors.lineStrong, padding: spacing.md, marginTop: spacing.md },
  gradeNoteText: { ...type.caption, color: colors.muted },
  stats: { flexDirection: 'row', marginVertical: spacing.xl, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line },
  stat: { flex: 1, minHeight: 88, paddingVertical: spacing.sm, justifyContent: 'flex-end', borderRightWidth: 1, borderRightColor: colors.line },
  statValue: { fontSize: 21, lineHeight: 27, fontWeight: '700', color: colors.ink },
  statLabel: { ...type.caption, color: colors.muted, marginTop: 2 },
  progressList: { borderTopWidth: 1, borderColor: colors.line },
  progressItem: { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line },
  progressTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.sm },
  progressBand: { ...type.caption, color: colors.primary, maxWidth: 100, textAlign: 'right' },
  examLargeIcon: { width: 52, height: 52, alignItems: 'flex-start', justifyContent: 'center' },
  examStatus: { borderLeftWidth: 3, borderLeftColor: colors.warning, padding: spacing.lg, backgroundColor: colors.warningSoft },
  examStatusTitle: { ...type.heading, color: colors.ink, marginTop: spacing.md },
  examStatusBody: { ...type.body, color: colors.inkSoft, marginTop: spacing.xs },
  previewList: { marginTop: spacing.lg, gap: spacing.sm },
  previewRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line, paddingVertical: spacing.lg },
  profileAvatar: { width: 56, height: 56, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  profileAvatarText: { color: colors.white, fontSize: 24, fontWeight: '700' },
  profileLabel: { ...type.caption, color: colors.primary },
  profileGoal: { ...type.bodyStrong, color: colors.ink, marginTop: spacing.xs, maxWidth: 230 },
  privacyCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderLeftWidth: 3, borderLeftColor: colors.success, padding: spacing.md, backgroundColor: colors.successSoft, marginTop: spacing.md },
  confirmCard: { borderRadius: radii.lg, padding: spacing.md, backgroundColor: colors.dangerSoft },
  confirmTitle: { ...type.heading, color: colors.danger },
  confirmBody: { ...type.body, color: colors.inkSoft, marginVertical: spacing.sm },
});
