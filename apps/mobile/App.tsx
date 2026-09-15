import { useEffect, useMemo, useState } from 'react';
import { Platform, StatusBar as NativeStatusBar, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { diagnosticQuestionsForGrade, LESSONS_BY_SKILL, PRONUNCIATION_PROMPT } from './src/data/seed';
import { scoreDiagnostic } from './src/domain/diagnostic';
import type { LearnerProfile, StoredAppState } from './src/domain/models';
import type { AppRoute, MainTab } from './src/navigation/routes';
import { DiagnosticResultScreen, DiagnosticScreen } from './src/screens/DiagnosticScreens';
import { LessonScreen, PronunciationScreen } from './src/screens/LearningScreens';
import { ExamScreen, LearnScreen, PracticeScreen, ProfileScreen, ProgressScreen, TodayScreen } from './src/screens/MainScreens';
import { DiagnosticIntroScreen, OnboardingScreen } from './src/screens/OnboardingScreens';
import { clearAppState, loadAppState, saveAppState } from './src/services/storage';
import { BottomTabs } from './src/ui/components';
import { colors, type } from './src/ui/theme';

const EMPTY_STATE: StoredAppState = {
  completedLessonIds: [],
  completedSessions: 0,
};

export default function App() {
  const [hydrated, setHydrated] = useState(false);
  const [route, setRoute] = useState<AppRoute>('onboarding');
  const [activeTab, setActiveTab] = useState<MainTab>('today');
  const [state, setState] = useState<StoredAppState>(EMPTY_STATE);
  const [selectedLessonId, setSelectedLessonId] = useState<string>();

  useEffect(() => {
    loadAppState().then((stored) => {
      if (stored) {
        setState({ ...EMPTY_STATE, ...stored });
        setRoute(stored.profile ? (stored.diagnostic ? 'main' : 'diagnostic-intro') : 'onboarding');
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) void saveAppState(state);
  }, [hydrated, state]);

  const questions = useMemo(() => diagnosticQuestionsForGrade(state.profile?.grade ?? 9), [state.profile?.grade]);
  const priorityLesson = useMemo(() => {
    const skillId = state.diagnostic?.weakestSkillId ?? 'present-simple';
    return LESSONS_BY_SKILL[skillId] ?? LESSONS_BY_SKILL['present-simple'];
  }, [state.diagnostic?.weakestSkillId]);
  const selectedLesson = useMemo(
    () => Object.values(LESSONS_BY_SKILL).find((lesson) => lesson.id === selectedLessonId) ?? priorityLesson,
    [priorityLesson, selectedLessonId],
  );

  const openPriorityLesson = () => {
    setSelectedLessonId(undefined);
    setRoute('lesson');
  };

  const finishOnboarding = (profile: LearnerProfile) => {
    setState((current) => ({ ...current, profile, diagnostic: current.profile?.grade === profile.grade ? current.diagnostic : undefined }));
    setRoute('diagnostic-intro');
  };

  const completeDiagnostic = (answers: Record<string, number>) => {
    const diagnostic = scoreDiagnostic(questions, answers);
    setState((current) => ({ ...current, diagnostic }));
    setRoute('result');
  };

  const completeLesson = () => {
    setState((current) => ({
      ...current,
      completedLessonIds: current.completedLessonIds.includes(selectedLesson.id) ? current.completedLessonIds : [...current.completedLessonIds, selectedLesson.id],
      completedSessions: current.completedSessions + 1,
    }));
    setSelectedLessonId(undefined);
    setActiveTab('today');
    setRoute('main');
  };

  const completePronunciation = () => {
    setState((current) => ({ ...current, completedSessions: current.completedSessions + 1 }));
    setActiveTab('practice');
    setRoute('main');
  };

  const resetPrototype = async () => {
    await clearAppState();
    setState(EMPTY_STATE);
    setActiveTab('today');
    setRoute('onboarding');
  };

  const renderMain = () => {
    if (!state.profile) return <OnboardingScreen onContinue={finishOnboarding} />;
    const openProfile = () => setRoute('profile');
    if (activeTab === 'learn') return <LearnScreen state={state} onLesson={(lesson) => { setSelectedLessonId(lesson.id); setRoute('lesson'); }} onProfile={openProfile} />;
    if (activeTab === 'practice') return <PracticeScreen profile={state.profile} onPronunciation={() => setRoute('pronunciation')} onExam={() => setRoute('exam')} onProfile={openProfile} />;
    if (activeTab === 'progress') return <ProgressScreen state={state} onProfile={openProfile} />;
    return <TodayScreen state={state} onLesson={openPriorityLesson} onPronunciation={() => setRoute('pronunciation')} onExam={() => setRoute('exam')} onProfile={openProfile} />;
  };

  const renderRoute = () => {
    if (!hydrated) return <View style={styles.loading}><View style={styles.loadingBrand}><View style={styles.loadingRule} /><Text style={styles.loadingName}>EngPath</Text><Text style={styles.loadingDot}>.</Text></View><Text style={styles.loadingText}>Đang mở lộ trình…</Text></View>;
    if (route === 'onboarding') return <OnboardingScreen initialProfile={state.profile} onContinue={finishOnboarding} />;
    if (!state.profile) return <OnboardingScreen onContinue={finishOnboarding} />;
    if (route === 'diagnostic-intro') return <DiagnosticIntroScreen grade={state.profile.grade} onStart={() => setRoute('diagnostic')} onBack={() => setRoute('onboarding')} />;
    if (route === 'diagnostic') return <DiagnosticScreen questions={questions} onComplete={completeDiagnostic} onExit={() => setRoute(state.diagnostic ? 'main' : 'diagnostic-intro')} />;
    if (route === 'result' && state.diagnostic) return <DiagnosticResultScreen result={state.diagnostic} onStart={openPriorityLesson} />;
    if (route === 'lesson') return <LessonScreen lesson={selectedLesson} onBack={() => setRoute('main')} onComplete={completeLesson} />;
    if (route === 'pronunciation') return <PronunciationScreen prompt={PRONUNCIATION_PROMPT} bestScore={state.pronunciationBestScore} onBack={() => setRoute('main')} onScore={(score) => setState((current) => ({ ...current, pronunciationBestScore: Math.max(current.pronunciationBestScore ?? 0, score) }))} onComplete={completePronunciation} />;
    if (route === 'exam') return <ExamScreen onBack={() => { setActiveTab('practice'); setRoute('main'); }} />;
    if (route === 'profile') return <ProfileScreen profile={state.profile} onBack={() => setRoute('main')} onReset={resetPrototype} />;
    return (
      <View style={styles.mainShell}>
        {renderMain()}
        <BottomTabs active={activeTab} onChange={setActiveTab} />
      </View>
    );
  };

  const app = <View style={styles.appFrame}>{renderRoute()}<StatusBar style="dark" /></View>;
  if (Platform.OS !== 'web') return app;

  return (
    <View style={styles.webStage}>
      <View style={[styles.phone, phoneShadow]}>
        <View style={styles.camera} />
        {app}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appFrame: { flex: 1, backgroundColor: colors.canvas, paddingTop: Platform.OS === 'android' ? NativeStatusBar.currentHeight : 0 },
  mainShell: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.canvas },
  loadingBrand: { flexDirection: 'row', alignItems: 'center' },
  loadingRule: { width: 4, height: 28, backgroundColor: colors.primary, marginRight: 8 },
  loadingName: { color: colors.ink, fontSize: 22, fontWeight: '700', letterSpacing: -0.4 },
  loadingDot: { color: colors.accent, fontSize: 24, lineHeight: 28, fontWeight: '700' },
  loadingText: { ...type.bodyStrong, color: colors.muted, marginTop: 14 },
  webStage: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: '#DDE5F1' },
  phone: { width: '100%', maxWidth: 420, height: '100%', maxHeight: 860, borderWidth: 8, borderColor: '#121826', borderRadius: 38, overflow: 'hidden', backgroundColor: colors.canvas },
  camera: { position: 'absolute', zIndex: 20, top: 8, alignSelf: 'center', width: 76, height: 21, borderRadius: 12, backgroundColor: '#121826' },
});

const phoneShadow = Platform.select({
  web: { boxShadow: '0 18px 30px rgba(23, 32, 51, 0.22)' },
  default: { shadowColor: '#172033', shadowOffset: { width: 0, height: 18 }, shadowOpacity: 0.22, shadowRadius: 30, elevation: 10 },
});
