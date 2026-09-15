import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { MainTab } from '../navigation/routes';
import { Icon, type IconName } from './Icon';
import { colors, radii, spacing, type } from './theme';

export { Icon } from './Icon';

export function Screen({ children, footer, testID }: PropsWithChildren<{ footer?: ReactNode; testID?: string }>) {
  return (
    <View style={styles.screen} testID={testID}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

export function Brand() {
  return (
    <View style={styles.brand} accessible accessibilityLabel="EngPath">
      <View style={styles.brandMark}><Text style={styles.brandLetter}>E</Text></View>
      <Text style={styles.brandName}>EngPath</Text>
    </View>
  );
}

export function Eyebrow({ children }: PropsWithChildren) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function Button({ label, onPress, icon = 'arrow-right', disabled = false, tone = 'primary' }: {
  label: string;
  onPress: () => void;
  icon?: IconName | null;
  disabled?: boolean;
  tone?: 'primary' | 'secondary' | 'danger';
}) {
  const foreground = tone === 'primary' ? colors.white : tone === 'danger' ? colors.danger : colors.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, styles[`button_${tone}`], disabled && styles.disabled, pressed && styles.pressed]}
    >
      <Text style={[styles.buttonText, { color: foreground }]}>{label}</Text>
      {icon ? <Icon name={icon} size={20} color={foreground} /> : null}
    </Pressable>
  );
}

export function TextButton({ label, onPress, tone = 'primary' }: { label: string; onPress: () => void; tone?: 'primary' | 'danger' }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}>
      <Text style={[styles.textButtonLabel, tone === 'danger' && { color: colors.danger }]}>{label}</Text>
    </Pressable>
  );
}

export function BackButton({ onPress, label = 'Quay lại' }: { onPress: () => void; label?: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
      <Icon name="arrow-left" size={20} color={colors.ink} />
      <Text style={styles.backText}>{label}</Text>
    </Pressable>
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const percentage = Math.max(0, Math.min(100, value * 100));
  return (
    <View accessible accessibilityLabel={label ?? `Tiến độ ${Math.round(percentage)} phần trăm`}>
      <View style={styles.track}><View style={[styles.fill, { width: `${percentage}%` }]} /></View>
    </View>
  );
}

export function Pill({ children, tone = 'neutral' }: PropsWithChildren<{ tone?: 'neutral' | 'primary' | 'success' | 'warning' }>) {
  return <View style={[styles.pill, styles[`pill_${tone}`]]}><Text style={[styles.pillText, styles[`pillText_${tone}`]]}>{children}</Text></View>;
}

const tabs: { id: MainTab; label: string; icon: IconName }[] = [
  { id: 'today', label: 'Hôm nay', icon: 'home' },
  { id: 'learn', label: 'Học', icon: 'book' },
  { id: 'practice', label: 'Luyện', icon: 'mic' },
  { id: 'progress', label: 'Tiến độ', icon: 'chart' },
];

export function BottomTabs({ active, onChange }: { active: MainTab; onChange: (tab: MainTab) => void }) {
  return (
    <View style={styles.tabs} accessibilityRole="tablist">
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <Pressable
            key={tab.id}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected }}
            onPress={() => onChange(tab.id)}
            style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
          >
            <Icon name={tab.icon} size={22} color={selected ? colors.primary : colors.muted} />
            <Text style={[styles.tabLabel, selected && styles.tabLabelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function EmptyState({ icon, title, body }: { icon: IconName; title: string; body: string }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}><Icon name={icon} color={colors.primary} /></View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xxl },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.surface },
  brand: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  brandMark: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  brandLetter: { color: colors.white, fontSize: 20, fontWeight: '700' },
  brandName: { marginLeft: spacing.xs, color: colors.ink, fontSize: 18, fontWeight: '700' },
  eyebrow: { ...type.caption, color: colors.primary, textTransform: 'uppercase', letterSpacing: 1.1 },
  button: { minHeight: 52, borderRadius: radii.md, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1 },
  button_primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  button_secondary: { backgroundColor: colors.surface, borderColor: colors.lineStrong },
  button_danger: { backgroundColor: colors.dangerSoft, borderColor: colors.dangerSoft },
  buttonText: { ...type.bodyStrong },
  disabled: { opacity: 0.42 },
  pressed: { opacity: 0.72 },
  textButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.sm },
  textButtonLabel: { ...type.label, color: colors.primary },
  back: { minHeight: 48, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: spacing.xs, marginBottom: spacing.md },
  backText: { ...type.label, color: colors.ink },
  track: { height: 8, borderRadius: radii.round, backgroundColor: colors.line, overflow: 'hidden' },
  fill: { height: 8, borderRadius: radii.round, backgroundColor: colors.primary },
  pill: { alignSelf: 'flex-start', borderRadius: radii.round, paddingHorizontal: 10, paddingVertical: 5 },
  pill_neutral: { backgroundColor: colors.surfaceMuted },
  pill_primary: { backgroundColor: colors.primarySoft },
  pill_success: { backgroundColor: colors.successSoft },
  pill_warning: { backgroundColor: colors.warningSoft },
  pillText: { ...type.caption },
  pillText_neutral: { color: colors.inkSoft },
  pillText_primary: { color: colors.primary },
  pillText_success: { color: colors.success },
  pillText_warning: { color: colors.warning },
  tabs: { minHeight: 70, flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: spacing.xs, paddingBottom: 4 },
  tab: { flex: 1, minHeight: 64, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabLabel: { fontSize: 11, lineHeight: 15, fontWeight: '500', color: colors.muted },
  tabLabelActive: { color: colors.primary, fontWeight: '700' },
  empty: { paddingVertical: 36, paddingHorizontal: spacing.lg, alignItems: 'center' },
  emptyIcon: { width: 52, height: 52, borderRadius: 18, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { ...type.heading, color: colors.ink, marginTop: spacing.md, textAlign: 'center' },
  emptyBody: { ...type.body, color: colors.muted, marginTop: spacing.xs, textAlign: 'center' },
});
