import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StatusBar as NativeStatusBar, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { GOALS, GRADES, LESSONS_BY_SKILL, PRONUNCIATION_PROMPT, SKILLS, diagnosticQuestionsForGrade } from './src/data/seed';
import { scoreDiagnostic } from './src/domain/diagnostic';
import type { DiagnosticResult, Grade, LearnerProfile, StoredAppState } from './src/domain/models';
import { loadAppState, saveAppState } from './src/services/storage';
import { colors } from './src/ui/theme';

type Screen = 'onboarding' | 'diagnostic' | 'result' | 'home' | 'lesson' | 'pronunciation' | 'progress';

const INITIAL_STATE: StoredAppState = { completedLessonIds: [], completedSessions: 0 };

export default function App() {
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [appState, setAppState] = useState<StoredAppState>(INITIAL_STATE);
  const [draftProfile, setDraftProfile] = useState<LearnerProfile>({ grade: 9, goalId: 'exam-10' });

  useEffect(() => {
    void loadAppState().then((stored) => {
      if (stored) {
        setAppState(stored);
        if (stored.profile) setDraftProfile(stored.profile);
        setScreen(stored.profile ? 'home' : 'onboarding');
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) void saveAppState(appState);
  }, [appState, ready]);

  if (!ready) return <LoadingScreen />;

  const recommendedSkillId = appState.diagnostic?.weakestSkillId ?? 'adjective-adverb';
  const finishOnboarding = () => {
    setAppState((current) => ({ ...current, profile: draftProfile, diagnostic: undefined }));
    setScreen('diagnostic');
  };
  const finishDiagnostic = (diagnostic: DiagnosticResult) => {
    setAppState((current) => ({ ...current, diagnostic }));
    setScreen('result');
  };
  const completeLesson = () => {
    const lesson = LESSONS_BY_SKILL[recommendedSkillId] ?? LESSONS_BY_SKILL['adjective-adverb'];
    setAppState((current) => ({
      ...current,
      completedLessonIds: current.completedLessonIds.includes(lesson.id) ? current.completedLessonIds : [...current.completedLessonIds, lesson.id],
      completedSessions: current.completedSessions + 1,
    }));
    setScreen('pronunciation');
  };

  const app = (
    <View style={styles.appFrame}>
      {screen === 'onboarding' && <OnboardingScreen profile={draftProfile} onChange={setDraftProfile} onContinue={finishOnboarding} />}
      {screen === 'diagnostic' && <DiagnosticScreen grade={appState.profile?.grade ?? 9} onComplete={finishDiagnostic} />}
      {screen === 'result' && appState.diagnostic && <ResultScreen result={appState.diagnostic} onContinue={() => setScreen('home')} />}
      {screen === 'home' && appState.profile && (
        <HomeScreen appState={appState} skillId={recommendedSkillId} onLesson={() => setScreen('lesson')} onPronunciation={() => setScreen('pronunciation')} onProgress={() => setScreen('progress')} onRetake={() => setScreen('diagnostic')} />
      )}
      {screen === 'lesson' && <LessonScreen skillId={recommendedSkillId} onBack={() => setScreen('home')} onComplete={completeLesson} />}
      {screen === 'pronunciation' && (
        <PronunciationScreen bestScore={appState.pronunciationBestScore} onBack={() => setScreen('home')} onScore={(score) => setAppState((current) => ({ ...current, pronunciationBestScore: Math.max(score, current.pronunciationBestScore ?? 0) }))} />
      )}
      {screen === 'progress' && <ProgressScreen appState={appState} onBack={() => setScreen('home')} />}
      <StatusBar style="dark" />
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webPreviewStage}>
        <View style={styles.webPhoneFrame}>
          <View style={styles.webPhoneCamera} />
          {app}
        </View>
      </View>
    );
  }

  return app;
}

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <StatusBar style="dark" />
      <View style={styles.brandMark}><Text style={styles.brandMarkText}>E</Text></View>
      <Text style={styles.brandTitle}>EngPath</Text>
      <ActivityIndicator color={colors.primary} style={{ marginTop: 22 }} />
    </View>
  );
}

function Page({ children }: { children: ReactNode }) {
  return <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>{children}</ScrollView>;
}

function OnboardingScreen({ profile, onChange, onContinue }: { profile: LearnerProfile; onChange: (value: LearnerProfile) => void; onContinue: () => void }) {
  return (
    <Page>
      <View style={styles.brandRow}><View style={styles.miniBrand}><Text style={styles.miniBrandText}>E</Text></View><Text style={styles.brandName}>EngPath</Text></View>
      <Text style={styles.heroTitle}>Học đúng phần bạn đang thiếu.</Text>
      <Text style={styles.heroBody}>Một lộ trình tiếng Anh ngắn mỗi ngày, điều chỉnh theo khối lớp, mục tiêu và lỗi bạn thường gặp.</Text>

      <SectionLabel number="01" label="Bạn đang học lớp mấy?" />
      <View style={styles.gradeGrid}>
        {GRADES.map((grade) => {
          const selected = profile.grade === grade;
          return (
            <Pressable key={grade} accessibilityRole="button" accessibilityState={{ selected }} onPress={() => onChange({ grade, goalId: grade !== 9 && profile.goalId === 'exam-10' ? 'school-support' : profile.goalId })} style={({ pressed }) => [styles.gradeCard, selected && styles.gradeCardSelected, pressed && styles.pressed]}>
              <Text style={[styles.gradeLabel, selected && styles.onDarkMuted]}>LỚP</Text><Text style={[styles.gradeNumber, selected && styles.onDark]}>{grade}</Text>
            </Pressable>
          );
        })}
      </View>

      <SectionLabel number="02" label="Mục tiêu chính của bạn" />
      <View style={styles.stack}>
        {GOALS.filter((goal) => goal.id !== 'exam-10' || profile.grade === 9).map((goal) => {
          const selected = profile.goalId === goal.id;
          return (
            <Pressable key={goal.id} accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={() => onChange({ ...profile, goalId: goal.id })} style={({ pressed }) => [styles.goalCard, selected && styles.selectedCard, pressed && styles.pressed]}>
              <View style={styles.goalIcon}><Text style={styles.goalIconText}>{goal.icon}</Text></View>
              <View style={{ flex: 1, marginHorizontal: 13 }}><Text style={styles.goalTitle}>{goal.title}</Text><Text style={styles.goalBody}>{goal.description}</Text></View>
              <View style={[styles.radio, selected && styles.radioSelected]}>{selected && <View style={styles.radioDot} />}</View>
            </Pressable>
          );
        })}
      </View>
      <PrimaryButton label="Bắt đầu đánh giá nhanh" onPress={onContinue} />
      <Text style={styles.privacy}>Không cần email · Không thu thập tên thật</Text>
    </Page>
  );
}

function DiagnosticScreen({ grade, onComplete }: { grade: Grade; onComplete: (result: DiagnosticResult) => void }) {
  const questions = useMemo(() => diagnosticQuestionsForGrade(grade), [grade]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const current = questions[index];
  const selected = answers[current.id];

  const next = () => {
    if (selected === undefined) return;
    if (index === questions.length - 1) onComplete(scoreDiagnostic(questions, answers));
    else setIndex((value) => value + 1);
  };

  return (
    <Page>
      <View style={styles.splitRow}><Text style={styles.kicker}>ĐÁNH GIÁ NỀN TẢNG</Text><Text style={styles.mutedSmall}>{index + 1}/{questions.length}</Text></View>
      <ProgressBar value={(index + 1) / questions.length} />
      <View style={styles.questionHead}><Text style={styles.skillLabel}>{SKILLS[current.skillId].title}</Text><Text style={styles.questionText}>{current.prompt}</Text><Text style={styles.body}>Chọn một đáp án phù hợp nhất.</Text></View>
      <View style={styles.stack}>
        {current.options.map((option, optionIndex) => {
          const active = selected === optionIndex;
          return (
            <Pressable key={`${current.id}-${option}`} accessibilityRole="radio" accessibilityState={{ checked: active }} onPress={() => setAnswers((value) => ({ ...value, [current.id]: optionIndex }))} style={({ pressed }) => [styles.answerCard, active && styles.selectedCard, pressed && styles.pressed]}>
              <View style={[styles.answerLetter, active && styles.answerLetterSelected]}><Text style={[styles.answerLetterText, active && styles.onDark]}>{String.fromCharCode(65 + optionIndex)}</Text></View>
              <Text style={styles.answerText}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
      <PrimaryButton disabled={selected === undefined} label={index === questions.length - 1 ? 'Xem bản đồ kỹ năng' : 'Câu tiếp theo'} onPress={next} />
      <Text style={styles.helper}>Bài này dùng để chọn điểm bắt đầu, không dùng để xếp hạng bạn.</Text>
    </Page>
  );
}

function ResultScreen({ result, onContinue }: { result: DiagnosticResult; onContinue: () => void }) {
  return (
    <Page>
      <Text style={styles.kicker}>BẢN ĐỒ KHỞI ĐẦU</Text><Text style={styles.pageTitle}>Bạn đã có một điểm bắt đầu rõ ràng.</Text>
      <Text style={styles.pageBody}>EngPath sẽ ưu tiên phần cần cải thiện và kiểm tra lại sau khi bạn luyện tập.</Text>
      <View style={styles.overall}><Text style={styles.overallCaption}>MỨC SẴN SÀNG HIỆN TẠI</Text><Text style={styles.overallScore}>{result.overallScore}</Text><Text style={styles.overallUnit}>/100</Text></View>
      <View style={styles.insightRow}>
        <InsightCard tone="green" label="ĐIỂM MẠNH" title={SKILLS[result.strongestSkillId].title} icon="↗" />
        <InsightCard tone="yellow" label="ƯU TIÊN ÔN" title={SKILLS[result.weakestSkillId].title} icon="◎" />
      </View>
      <View style={styles.skillList}>{result.skillScores.map((item) => <SkillRow key={item.skillId} skillId={item.skillId} score={item.score} />)}</View>
      <PrimaryButton label="Xem lộ trình hôm nay" onPress={onContinue} />
    </Page>
  );
}

function HomeScreen({ appState, skillId, onLesson, onPronunciation, onProgress, onRetake }: { appState: StoredAppState; skillId: string; onLesson: () => void; onPronunciation: () => void; onProgress: () => void; onRetake: () => void }) {
  const profile = appState.profile!;
  const goal = GOALS.find((item) => item.id === profile.goalId) ?? GOALS[0];
  const lesson = LESSONS_BY_SKILL[skillId] ?? LESSONS_BY_SKILL['adjective-adverb'];
  return (
    <Page>
      <View style={styles.splitRow}><View><Text style={styles.kicker}>LỚP {profile.grade} · {goal.shortTitle.toUpperCase()}</Text><Text style={styles.homeTitle}>Sẵn sàng cho 12 phút?</Text></View><View style={styles.streak}><Text style={styles.streakText}>◆ {appState.completedSessions}</Text></View></View>
      <View style={styles.mission}>
        <View style={styles.splitRow}><Text style={styles.onDarkKicker}>NHIỆM VỤ HÔM NAY</Text><Text style={styles.duration}>12 PHÚT</Text></View>
        <Text style={styles.missionTitle}>{lesson.title}</Text><Text style={styles.missionBody}>{lesson.summary}</Text>
        <View style={styles.missionSteps}><MissionStep label="Hiểu nhanh" /><MissionStep label="Luyện một câu" /><MissionStep label="Đọc thành tiếng" /></View>
        <PrimaryButton inverted label="Tiếp tục lộ trình" onPress={onLesson} />
      </View>
      <Text style={styles.sectionTitle}>Luyện thêm</Text>
      <View style={styles.practiceGrid}>
        <PracticeCard icon="◖" label="PHÁT ÂM" title="Âm /θ/ trong câu" meta={appState.pronunciationBestScore ? `Tốt nhất ${appState.pronunciationBestScore}` : '3 phút'} onPress={onPronunciation} />
        <PracticeCard icon="◫" label="TIẾN ĐỘ" title="Bản đồ kỹ năng" meta={`${appState.diagnostic?.skillScores.length ?? 0} kỹ năng`} onPress={onProgress} />
      </View>
      {profile.grade === 9 && <View style={styles.examCard}><View style={styles.examBadge}><Text style={styles.onDarkKicker}>LỚP 9</Text></View><View style={{ flex: 1, marginHorizontal: 13 }}><Text style={styles.goalTitle}>Chế độ thi vào 10</Text><Text style={styles.goalBody}>Đề ngắn để làm quen nhịp độ; ngân hàng đề sẽ mở rộng ở beta.</Text></View><Text style={styles.examArrow}>→</Text></View>}
      <Pressable onPress={onRetake} style={styles.textButton}><Text style={styles.textButtonLabel}>Làm lại đánh giá nền tảng</Text></Pressable>
    </Page>
  );
}

function LessonScreen({ skillId, onBack, onComplete }: { skillId: string; onBack: () => void; onComplete: () => void }) {
  const lesson = LESSONS_BY_SKILL[skillId] ?? LESSONS_BY_SKILL['adjective-adverb'];
  const [selected, setSelected] = useState<number>();
  const [checked, setChecked] = useState(false);
  const correct = selected === lesson.question.correctOptionIndex;
  return (
    <Page>
      <BackButton onPress={onBack} /><Text style={styles.kicker}>{SKILLS[lesson.skillId].area.toUpperCase()} · BÀI NỀN TẢNG</Text><Text style={styles.pageTitle}>{lesson.title}</Text><Text style={styles.pageBody}>{lesson.summary}</Text>
      <View style={styles.lessonCard}><Text style={styles.onDarkKicker}>NHỚ ĐIỀU NÀY</Text><Text style={styles.lessonExplanation}>{lesson.explanationVi}</Text><View style={styles.example}><Text style={styles.exampleText}>{lesson.example}</Text><Text style={styles.exampleSub}>{lesson.exampleVi}</Text></View></View>
      <Text style={styles.sectionTitle}>Thử ngay</Text><Text style={styles.lessonQuestion}>{lesson.question.prompt}</Text>
      <View style={styles.stack}>{lesson.question.options.map((option, optionIndex) => {
        const chosen = selected === optionIndex;
        const isAnswer = checked && optionIndex === lesson.question.correctOptionIndex;
        return <Pressable disabled={checked} key={option} onPress={() => setSelected(optionIndex)} style={[styles.answerCard, chosen && styles.selectedCard, isAnswer && styles.correctCard, checked && chosen && !isAnswer && styles.wrongCard]}><Text style={styles.answerText}>{option}</Text></Pressable>;
      })}</View>
      {checked && <View style={[styles.feedback, correct ? styles.feedbackCorrect : styles.feedbackWrong]}><Text style={styles.feedbackTitle}>{correct ? 'Chính xác' : 'Chưa đúng, nhưng đã rõ chỗ cần sửa'}</Text><Text style={styles.feedbackBody}>{lesson.question.explanationVi}</Text></View>}
      <PrimaryButton disabled={selected === undefined} label={checked ? 'Tiếp tục sang phát âm' : 'Kiểm tra đáp án'} onPress={() => checked ? onComplete() : setChecked(true)} />
    </Page>
  );
}

function PronunciationScreen({ bestScore, onBack, onScore }: { bestScore?: number; onBack: () => void; onScore: (score: number) => void }) {
  const [phase, setPhase] = useState<'idle' | 'recording' | 'result'>('idle');
  const demoScore = 82;
  const record = () => {
    if (phase !== 'recording') setPhase('recording');
    else { setPhase('result'); onScore(demoScore); }
  };
  return (
    <Page>
      <BackButton onPress={onBack} /><Text style={styles.kicker}>PHÁT ÂM · ÂM /θ/</Text><Text style={styles.pageTitle}>Đọc chậm và rõ câu sau.</Text><Text style={styles.pageBody}>Tập trung vào luồng hơi ở từ “think” và “Thursday”.</Text>
      <View style={styles.speechCard}><Text style={styles.speechText}>{PRONUNCIATION_PROMPT.text}</Text><Text style={styles.exampleSub}>Tôi nghĩ thứ Năm trời sẽ nắng.</Text><View style={styles.waveform}>{[18, 32, 44, 25, 54, 38, 62, 28, 48, 35, 56].map((height, index) => <View key={`${height}-${index}`} style={[styles.wave, { height }]} />)}</View></View>
      <Pressable onPress={record} style={({ pressed }) => [styles.recordButton, phase === 'recording' && styles.recording, pressed && styles.pressed]}><View style={styles.recordDot} /></Pressable>
      <Text style={styles.recordLabel}>{phase === 'recording' ? 'Nhấn để dừng và xem bản demo' : phase === 'result' ? 'Nhấn để thử lại' : 'Nhấn để bắt đầu'}</Text>
      {phase === 'result' && <View style={styles.pronunciationResult}><View style={styles.scoreCircle}><Text style={styles.scoreNumber}>{demoScore}</Text><Text style={styles.scoreLabel}>RÕ RÀNG</Text></View><View style={{ flex: 1, marginLeft: 15 }}><Text style={styles.feedbackTitle}>Tập trung thêm vào /θ/</Text><Text style={styles.feedbackBody}>{PRONUNCIATION_PROMPT.remediationVi}</Text></View><View style={styles.demoNotice}><Text style={styles.demoText}>Kết quả đang mô phỏng UX. App chưa thu hoặc gửi âm thanh cho đến khi backend speech adapter được tích hợp.</Text></View></View>}
      {bestScore !== undefined && <Text style={styles.bestScore}>Điểm tốt nhất đã lưu: {bestScore}/100</Text>}
    </Page>
  );
}

function ProgressScreen({ appState, onBack }: { appState: StoredAppState; onBack: () => void }) {
  return (
    <Page>
      <BackButton onPress={onBack} /><Text style={styles.kicker}>TIẾN ĐỘ CÁ NHÂN</Text><Text style={styles.pageTitle}>Mỗi phần trăm đều có lý do.</Text><Text style={styles.pageBody}>Bản đầu dùng kết quả chẩn đoán; mastery sẽ được cập nhật sau từng lần luyện ở milestone tiếp theo.</Text>
      <View style={styles.statGrid}><Stat value={String(appState.completedSessions)} label="Buổi đã học" /><Stat value={String(appState.completedLessonIds.length)} label="Bài hoàn thành" /><Stat value={String(appState.pronunciationBestScore ?? '—')} label="Phát âm tốt nhất" /></View>
      <Text style={styles.sectionTitle}>Bản đồ kỹ năng</Text><View style={styles.skillList}>{(appState.diagnostic?.skillScores ?? []).map((item) => <SkillRow key={item.skillId} skillId={item.skillId} score={item.score} />)}</View>
    </Page>
  );
}

function PrimaryButton({ label, onPress, disabled = false, inverted = false }: { label: string; onPress: () => void; disabled?: boolean; inverted?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.primaryButton, inverted && styles.invertedButton, disabled && styles.disabled, pressed && styles.pressed]}><Text style={[styles.primaryLabel, inverted && styles.invertedLabel]}>{label}</Text><Text style={[styles.buttonArrow, inverted && styles.invertedLabel]}>→</Text></Pressable>;
}

function BackButton({ onPress }: { onPress: () => void }) { return <Pressable onPress={onPress} style={styles.backButton}><Text style={styles.backArrow}>←</Text><Text style={styles.backLabel}>Quay lại</Text></Pressable>; }
function SectionLabel({ number, label }: { number: string; label: string }) { return <View style={styles.sectionLabelRow}><Text style={styles.sectionNumber}>{number}</Text><Text style={styles.sectionLabel}>{label}</Text></View>; }
function ProgressBar({ value, color = colors.primary }: { value: number; color?: string }) { return <View style={styles.progressTrack}><View style={[styles.progressValue, { width: `${Math.max(4, Math.min(100, value * 100))}%`, backgroundColor: color }]} /></View>; }
function SkillRow({ skillId, score }: { skillId: string; score: number }) { return <View style={styles.skillRow}><View style={styles.splitRow}><View><Text style={styles.skillRowTitle}>{SKILLS[skillId].title}</Text><Text style={styles.mutedSmall}>{SKILLS[skillId].area.toUpperCase()}</Text></View><Text style={styles.skillScore}>{score}%</Text></View><ProgressBar value={score / 100} color={score >= 70 ? colors.success : colors.sun} /></View>; }
function InsightCard({ tone, label, title, icon }: { tone: 'green' | 'yellow'; label: string; title: string; icon: string }) { return <View style={[styles.insightCard, { backgroundColor: tone === 'green' ? colors.successSoft : colors.sunSoft }]}><Text style={styles.insightIcon}>{icon}</Text><Text style={styles.insightLabel}>{label}</Text><Text style={styles.insightTitle}>{title}</Text></View>; }
function MissionStep({ label }: { label: string }) { return <View style={styles.missionStep}><View style={styles.missionDot} /><Text style={styles.missionStepText}>{label}</Text></View>; }
function PracticeCard({ icon, label, title, meta, onPress }: { icon: string; label: string; title: string; meta: string; onPress: () => void }) { return <Pressable onPress={onPress} style={({ pressed }) => [styles.practiceCard, pressed && styles.pressed]}><Text style={styles.practiceIcon}>{icon}</Text><Text style={styles.insightLabel}>{label}</Text><Text style={styles.practiceTitle}>{title}</Text><Text style={styles.practiceMeta}>{meta}</Text></Pressable>; }
function Stat({ value, label }: { value: string; label: string }) { return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>; }

const styles = StyleSheet.create({
  appFrame: { flex: 1, backgroundColor: colors.canvas, paddingTop: Platform.OS === 'android' ? NativeStatusBar.currentHeight : 0 },
  webPreviewStage: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 18, backgroundColor: '#DDE3E1' },
  webPhoneFrame: { width: '100%', maxWidth: 420, height: '100%', maxHeight: 860, borderWidth: 9, borderColor: '#101820', borderRadius: 38, overflow: 'hidden', backgroundColor: colors.canvas, shadowColor: '#172A3A', shadowOffset: { width: 0, height: 18 }, shadowOpacity: 0.25, shadowRadius: 30 },
  webPhoneCamera: { position: 'absolute', zIndex: 10, top: 9, alignSelf: 'center', width: 78, height: 22, borderRadius: 14, backgroundColor: '#101820' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.canvas },
  brandMark: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  brandMarkText: { color: colors.white, fontSize: 34, fontWeight: '900' }, brandTitle: { marginTop: 13, color: colors.ink, fontSize: 28, fontWeight: '900' },
  page: { paddingHorizontal: 22, paddingTop: 22, paddingBottom: 48 },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 }, miniBrand: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary }, miniBrandText: { color: colors.white, fontSize: 18, fontWeight: '900' }, brandName: { marginLeft: 10, color: colors.ink, fontSize: 19, fontWeight: '900' },
  heroTitle: { color: colors.ink, fontSize: 42, lineHeight: 46, fontWeight: '900', letterSpacing: -1.8 }, heroBody: { color: colors.muted, fontSize: 16, lineHeight: 24, marginTop: 14, marginBottom: 34 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 }, sectionNumber: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1.4, marginRight: 9 }, sectionLabel: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  gradeGrid: { flexDirection: 'row', gap: 9, marginBottom: 30 }, gradeCard: { flex: 1, minHeight: 88, borderWidth: 1, borderColor: colors.line, borderRadius: 18, padding: 12, backgroundColor: colors.white }, gradeCardSelected: { backgroundColor: colors.ink, borderColor: colors.ink }, gradeLabel: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1.1 }, gradeNumber: { marginTop: 7, color: colors.ink, fontSize: 33, fontWeight: '900' }, onDark: { color: colors.white }, onDarkMuted: { color: colors.mintSoft },
  stack: { gap: 10, marginBottom: 22 }, goalCard: { minHeight: 84, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: 20, padding: 14, backgroundColor: colors.white }, selectedCard: { borderColor: colors.primary, backgroundColor: colors.primarySoft }, goalIcon: { width: 47, height: 47, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.canvas }, goalIconText: { color: colors.ink, fontSize: 21, fontWeight: '900' }, goalTitle: { color: colors.ink, fontSize: 15, fontWeight: '900' }, goalBody: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 4 }, radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' }, radioSelected: { borderColor: colors.primary }, radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  primaryButton: { minHeight: 58, borderRadius: 18, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.primary, marginTop: 8 }, invertedButton: { backgroundColor: colors.white }, disabled: { opacity: 0.38 }, primaryLabel: { color: colors.white, fontSize: 15, fontWeight: '900' }, invertedLabel: { color: colors.ink }, buttonArrow: { color: colors.white, fontSize: 22 }, privacy: { marginTop: 13, textAlign: 'center', color: colors.muted, fontSize: 11 }, pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  splitRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, kicker: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.4 }, mutedSmall: { color: colors.muted, fontSize: 10, fontWeight: '700', marginTop: 2 }, progressTrack: { height: 7, borderRadius: 99, backgroundColor: colors.line, overflow: 'hidden', marginTop: 11 }, progressValue: { height: 7, borderRadius: 99 },
  questionHead: { marginTop: 42, marginBottom: 27 }, skillLabel: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1.1, textTransform: 'uppercase' }, questionText: { marginTop: 11, color: colors.ink, fontSize: 30, lineHeight: 39, fontWeight: '900', letterSpacing: -0.8 }, body: { marginTop: 11, color: colors.muted, fontSize: 14 }, answerCard: { minHeight: 64, borderWidth: 1, borderColor: colors.line, borderRadius: 18, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white }, answerLetter: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.canvas, marginRight: 13 }, answerLetterSelected: { backgroundColor: colors.primary }, answerLetterText: { color: colors.muted, fontSize: 13, fontWeight: '900' }, answerText: { flex: 1, color: colors.ink, fontSize: 15, fontWeight: '700' }, helper: { marginTop: 14, color: colors.muted, fontSize: 11, textAlign: 'center' },
  pageTitle: { marginTop: 12, color: colors.ink, fontSize: 34, lineHeight: 39, fontWeight: '900', letterSpacing: -1.2 }, pageBody: { marginTop: 11, marginBottom: 25, color: colors.muted, fontSize: 15, lineHeight: 23 }, overall: { height: 165, borderRadius: 28, backgroundColor: colors.ink, padding: 22, flexDirection: 'row', alignItems: 'flex-end', marginBottom: 13 }, overallCaption: { position: 'absolute', left: 22, top: 22, color: colors.mintSoft, fontSize: 10, fontWeight: '900', letterSpacing: 1.1 }, overallScore: { color: colors.white, fontSize: 79, lineHeight: 87, fontWeight: '900', letterSpacing: -4 }, overallUnit: { color: colors.mintSoft, fontSize: 19, fontWeight: '800', paddingBottom: 12, marginLeft: 6 }, insightRow: { flexDirection: 'row', gap: 11, marginBottom: 15 }, insightCard: { flex: 1, minHeight: 143, borderRadius: 22, padding: 16 }, insightIcon: { color: colors.ink, fontSize: 22, fontWeight: '900' }, insightLabel: { marginTop: 17, color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1.1 }, insightTitle: { marginTop: 6, color: colors.ink, fontSize: 15, lineHeight: 19, fontWeight: '900' },
  skillList: { borderWidth: 1, borderColor: colors.line, borderRadius: 22, padding: 17, backgroundColor: colors.white, marginBottom: 21 }, skillRow: { marginBottom: 17 }, skillRowTitle: { color: colors.ink, fontSize: 14, fontWeight: '800' }, skillScore: { color: colors.ink, fontSize: 13, fontWeight: '900' }, homeTitle: { marginTop: 7, color: colors.ink, fontSize: 29, lineHeight: 34, fontWeight: '900', letterSpacing: -0.9, maxWidth: 275 }, streak: { backgroundColor: colors.sunSoft, borderRadius: 14, paddingHorizontal: 11, paddingVertical: 8 }, streakText: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  mission: { borderRadius: 28, padding: 21, backgroundColor: colors.ink, marginTop: 23, marginBottom: 27 }, onDarkKicker: { color: colors.mintSoft, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 }, duration: { color: colors.white, backgroundColor: colors.inkLight, borderRadius: 99, paddingHorizontal: 9, paddingVertical: 6, fontSize: 9, fontWeight: '900' }, missionTitle: { marginTop: 23, color: colors.white, fontSize: 27, lineHeight: 31, fontWeight: '900' }, missionBody: { marginTop: 9, color: colors.inkMuted, fontSize: 13, lineHeight: 20 }, missionSteps: { marginVertical: 21, gap: 10 }, missionStep: { flexDirection: 'row', alignItems: 'center' }, missionDot: { width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: colors.mintSoft, marginRight: 10 }, missionStepText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  sectionTitle: { color: colors.ink, fontSize: 20, fontWeight: '900', marginBottom: 13 }, practiceGrid: { flexDirection: 'row', gap: 11, marginBottom: 24 }, practiceCard: { flex: 1, minHeight: 160, borderWidth: 1, borderColor: colors.line, borderRadius: 22, padding: 16, backgroundColor: colors.white }, practiceIcon: { color: colors.primary, fontSize: 27, fontWeight: '900' }, practiceTitle: { marginTop: 5, color: colors.ink, fontSize: 15, lineHeight: 19, fontWeight: '900' }, practiceMeta: { marginTop: 8, color: colors.primary, fontSize: 11, fontWeight: '800' }, examCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 22, padding: 15, backgroundColor: colors.primarySoft }, examBadge: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary }, examArrow: { color: colors.primary, fontSize: 22, fontWeight: '900' }, textButton: { alignItems: 'center', paddingVertical: 18 }, textButtonLabel: { color: colors.primary, fontSize: 12, fontWeight: '800' },
  backButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 27, paddingVertical: 5 }, backArrow: { color: colors.ink, fontSize: 22, marginRight: 8 }, backLabel: { color: colors.ink, fontSize: 13, fontWeight: '800' }, lessonCard: { borderRadius: 24, padding: 20, backgroundColor: colors.ink, marginBottom: 27 }, lessonExplanation: { marginTop: 13, color: colors.white, fontSize: 17, lineHeight: 25, fontWeight: '700' }, example: { marginTop: 19, padding: 14, borderRadius: 16, backgroundColor: colors.inkLight }, exampleText: { color: colors.white, fontSize: 16, fontWeight: '800' }, exampleSub: { marginTop: 5, color: colors.inkMuted, fontSize: 11, textAlign: 'center' }, lessonQuestion: { color: colors.ink, fontSize: 22, lineHeight: 30, fontWeight: '900', marginBottom: 16 }, correctCard: { borderColor: colors.success, backgroundColor: colors.successSoft }, wrongCard: { borderColor: colors.danger, backgroundColor: colors.dangerSoft }, feedback: { borderRadius: 18, padding: 16, marginBottom: 15 }, feedbackCorrect: { backgroundColor: colors.successSoft }, feedbackWrong: { backgroundColor: colors.dangerSoft }, feedbackTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' }, feedbackBody: { marginTop: 6, color: colors.muted, fontSize: 13, lineHeight: 20 },
  speechCard: { borderRadius: 28, padding: 22, backgroundColor: colors.ink, alignItems: 'center' }, speechText: { color: colors.white, fontSize: 27, lineHeight: 36, fontWeight: '900', textAlign: 'center' }, waveform: { height: 70, marginTop: 23, flexDirection: 'row', alignItems: 'center', gap: 5 }, wave: { width: 4, borderRadius: 4, backgroundColor: colors.mintSoft }, recordButton: { width: 82, height: 82, borderRadius: 41, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: colors.primary, borderWidth: 8, borderColor: colors.primarySoft, marginTop: 29 }, recording: { backgroundColor: colors.danger, borderColor: colors.dangerSoft }, recordDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.white }, recordLabel: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 10, marginBottom: 21 }, pronunciationResult: { borderWidth: 1, borderColor: colors.line, borderRadius: 24, padding: 17, backgroundColor: colors.white, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }, scoreCircle: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' }, scoreNumber: { color: colors.ink, fontSize: 30, fontWeight: '900' }, scoreLabel: { color: colors.success, fontSize: 8, fontWeight: '900', letterSpacing: 0.8 }, demoNotice: { width: '100%', marginTop: 15, borderRadius: 13, padding: 11, backgroundColor: colors.canvas }, demoText: { color: colors.muted, fontSize: 10, lineHeight: 15 }, bestScore: { marginTop: 13, color: colors.primary, fontSize: 12, fontWeight: '800', textAlign: 'center' },
  statGrid: { flexDirection: 'row', gap: 8, marginBottom: 27 }, stat: { flex: 1, minHeight: 108, borderWidth: 1, borderColor: colors.line, borderRadius: 19, padding: 12, justifyContent: 'flex-end', backgroundColor: colors.white }, statValue: { color: colors.ink, fontSize: 27, fontWeight: '900' }, statLabel: { marginTop: 5, color: colors.muted, fontSize: 10, lineHeight: 14, fontWeight: '700' },
});
