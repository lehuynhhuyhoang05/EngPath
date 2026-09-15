import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GOALS, LESSONS_BY_SKILL, SKILLS } from '../data/seed';
import { evidenceConfidence, learningBand, sortSkillsForReview } from '../domain/diagnosticPresentation';
import { recommendSkillId } from '../domain/recommendation';
import type { LearnerProfile, Lesson, StoredAppState } from '../domain/models';
import { BackButton, Button, EmptyState, Icon, Pill, Screen, TextButton } from '../ui/components';
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
  const priorityId = recommendSkillId(state.diagnostic, SKILLS);
  const lesson = LESSONS_BY_SKILL[priorityId] ?? LESSONS_BY_SKILL['present-simple'];
  const examFocus = state.profile?.grade === 9 && state.profile.goalId === 'exam-10';

  return (
    <Screen testID="today-screen">
      <Header eyebrow={`LỚP ${state.profile?.grade ?? 9} · ${GOALS.find((goal) => goal.id === state.profile?.goalId)?.shortTitle ?? 'Tự học'}`} title="12 phút cho bài hôm nay" onProfile={onProfile} />

      <View style={styles.mission}>
        <View style={styles.missionTop}><Text style={styles.missionLabel}>NHIỆM VỤ HÔM NAY</Text><Pill tone="primary">8 phút</Pill></View>
        <Text style={styles.missionNumber}>01</Text>
        <Text style={styles.missionTitle}>{lesson.title}</Text>
        <Text style={styles.missionBody}>Em đã vướng phần này trong bài chẩn đoán. Ôn lại quy tắc rồi làm một câu tương tự.</Text>
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
  const recommendedSkillId = useMemo(() => recommendSkillId(state.diagnostic, SKILLS), [state.diagnostic]);
  return (
    <Screen>
      <Header eyebrow={`BÀI HỌC · LỚP ${state.profile?.grade ?? 9}`} title="Chọn một bài để học" onProfile={onProfile} />
      <Text style={styles.lead}>Các chủ điểm dưới đây được xếp từ nền tảng đến kiến thức của lớp {state.profile?.grade}.</Text>
      <View style={styles.pathList}>
        {lessons.slice(0, 5).map((lesson, index) => {
          const complete = state.completedLessonIds.includes(lesson.id);
          const recommended = lesson.skillId === recommendedSkillId;
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
      <Header eyebrow="LUYỆN" title="Phát âm và ôn lỗi sai" onProfile={onProfile} />
      <View style={styles.practiceHero}>
        <Text style={styles.practiceIndex}>01 / PHÁT ÂM</Text>
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

export function ProgressScreen({ state, onProfile, onLesson }: { state: StoredAppState; onProfile: () => void; onLesson: () => void }) {
  const scores = sortSkillsForReview(state.diagnostic?.skillScores ?? []);
  const priorityId = recommendSkillId(state.diagnostic, SKILLS);
  const priority = scores.length ? SKILLS[priorityId] : undefined;
  return (
    <Screen>
      <Header eyebrow={`LỚP ${state.profile?.grade ?? 9} · TIẾN ĐỘ`} title="Em đang học đến đâu?" onProfile={onProfile} />
      <View style={styles.summary}>
        <Text style={styles.summaryStrong}>{state.completedSessions} buổi học</Text>
        <View style={styles.summaryDot} />
        <Text style={styles.summaryText}>{state.completedLessonIds.length} bài đã xong</Text>
        <View style={styles.summaryDot} />
        <Text style={styles.summaryText}>{state.pronunciationBestScore ? 'Đã luyện nói' : 'Chưa luyện nói'}</Text>
      </View>
      <Text style={styles.sectionTitle}>Kỹ năng đã kiểm tra</Text>
      <Text style={styles.sectionIntro}>Các vạch nhỏ cho biết EngPath đã thấy bao nhiêu lượt làm, không phải phần trăm thành thạo.</Text>
      {scores.length ? (
        <View style={styles.progressList}>
          {scores.map((skill, index) => (
            <View key={skill.skillId} style={[styles.progressItem, index === 0 && styles.progressItemPriority]}>
              <Text style={styles.skillNumber}>{String(index + 1).padStart(2, '0')}</Text>
              <View style={styles.skillContent}>
                <View style={styles.progressTop}>
                  <Text style={styles.pathTitle}>{SKILLS[skill.skillId].title}</Text>
                  <Text style={[styles.progressBand, skill.total < 2 && styles.progressBandMuted]}>{learningBand(skill.score, skill.total)}</Text>
                </View>
                <Text style={styles.actionMeta}>Đúng {skill.correct}/{skill.total} câu · {evidenceConfidence(skill.total)}</Text>
                <EvidenceMeter observations={skill.total} />
              </View>
            </View>
          ))}
        </View>
      ) : <EmptyState icon="chart" title="Chưa có dữ liệu tiến độ" body="Hoàn thành chẩn đoán để EngPath tạo bản đồ kỹ năng ban đầu." />}
      <View style={styles.draftNote}><Icon name="alert" size={20} color={colors.warning} /><Text style={styles.draftText}>Kết quả này còn có thể thay đổi. EngPath chỉ gọi một kỹ năng là “khá vững” sau ít nhất bốn lượt làm.</Text></View>
      {priority ? (
        <View style={styles.nextBlock}>
          <Text style={styles.nextLabel}>HỌC TIẾP</Text>
          <Text style={styles.nextTitle}>Ôn {priority.title}</Text>
          <Text style={styles.nextBody}>Một bài ngắn để kiểm tra lại phần đang cần chú ý nhất.</Text>
          <Button label="Mở bài học" onPress={onLesson} />
        </View>
      ) : null}
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
        <Pill tone="warning">Bản xem trước</Pill>
        <Text style={styles.examStatusTitle}>Phần luyện đề đang được chuẩn bị</Text>
        <Text style={styles.examStatusBody}>Hiện chưa có đề và bộ đếm giờ. Khi mở thử nghiệm, cấu trúc đề sẽ ghi rõ tỉnh và năm học.</Text>
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
      <View style={styles.privacyCard}><Icon name="lock" color={colors.success} /><View style={{ flex: 1 }}><Text style={styles.actionTitle}>Dữ liệu đang ở trên máy</Text><Text style={styles.actionMeta}>Hiện chưa có tài khoản và app không gửi bản thu âm.</Text></View></View>

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
function PreviewRow({ icon, title, body }: { icon: 'target' | 'chart' | 'clock'; title: string; body: string }) { return <View style={styles.previewRow}><View style={styles.actionIcon}><Icon name={icon} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionMeta}>{body}</Text></View></View>; }
function EvidenceMeter({ observations }: { observations: number }) {
  return (
    <View style={styles.evidenceMeter} accessible accessibilityLabel={`Đã có ${Math.min(observations, 4)} trên 4 lượt làm cần thiết`}>
      {[0, 1, 2, 3].map((mark) => <View key={mark} style={[styles.evidenceMark, mark < observations && styles.evidenceMarkFilled]} />)}
      <Text style={styles.evidenceLabel}>{observations >= 4 ? 'Đã đủ để theo dõi' : `Cần thêm ${4 - observations} lượt`}</Text>
    </View>
  );
}

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
  missionNumber: { color: colors.lineStrong, fontSize: 34, lineHeight: 40, fontWeight: '500', marginTop: spacing.md, letterSpacing: -1 },
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
  practiceIndex: { ...type.caption, color: colors.accent, letterSpacing: 0.8 },
  practiceTitle: { ...type.title, color: colors.ink, marginTop: spacing.md },
  practiceBody: { ...type.body, color: colors.muted, marginTop: spacing.xs, marginBottom: spacing.md },
  secondaryCard: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line },
  examCard: { minHeight: 84, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderLeftWidth: 3, borderLeftColor: colors.warning, padding: spacing.sm, backgroundColor: colors.warningSoft, marginTop: spacing.md },
  gradeNote: { borderLeftWidth: 3, borderLeftColor: colors.lineStrong, padding: spacing.md, marginTop: spacing.md },
  gradeNoteText: { ...type.caption, color: colors.muted },
  summary: { minHeight: 58, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.xs, marginVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.line },
  summaryStrong: { ...type.bodyStrong, color: colors.primary },
  summaryText: { ...type.caption, color: colors.inkSoft },
  summaryDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.lineStrong },
  sectionIntro: { ...type.caption, color: colors.muted, marginTop: -4, marginBottom: spacing.md },
  progressList: { borderTopWidth: 1, borderColor: colors.line },
  progressItem: { flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line },
  progressItemPriority: { borderLeftWidth: 3, borderLeftColor: colors.accent, paddingLeft: spacing.sm },
  skillNumber: { ...type.caption, color: colors.lineStrong, width: 24 },
  skillContent: { flex: 1 },
  progressTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  progressBand: { ...type.caption, color: colors.primary, maxWidth: 100, textAlign: 'right' },
  progressBandMuted: { color: colors.muted },
  evidenceMeter: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.sm },
  evidenceMark: { width: 16, height: 4, backgroundColor: colors.line },
  evidenceMarkFilled: { backgroundColor: colors.primary },
  evidenceLabel: { ...type.caption, color: colors.muted, marginLeft: spacing.xs },
  nextBlock: { borderTopWidth: 3, borderTopColor: colors.accent, paddingTop: spacing.md, marginTop: spacing.xl },
  nextLabel: { ...type.caption, color: colors.accent, letterSpacing: 0.8 },
  nextTitle: { ...type.heading, color: colors.ink, marginTop: spacing.xs },
  nextBody: { ...type.body, color: colors.muted, marginTop: 2, marginBottom: spacing.md },
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
