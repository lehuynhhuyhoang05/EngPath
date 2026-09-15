export const colors = {
  canvas: '#F6F7F4',
  surface: '#FFFEFB',
  surfaceMuted: '#ECEFEB',
  ink: '#18201F',
  inkSoft: '#3D4946',
  muted: '#68736F',
  line: '#D7DDD8',
  lineStrong: '#AEBAB5',
  primary: '#176B62',
  primaryPressed: '#10534C',
  primarySoft: '#E2F0EC',
  accent: '#C7472B',
  accentSoft: '#F9E9E3',
  success: '#267457',
  successSoft: '#E0F1E8',
  warning: '#875A13',
  warningSoft: '#F8EED8',
  danger: '#A8343E',
  dangerSoft: '#F8E7E8',
  scrim: '#18312D',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  hero: 16,
  round: 999,
} as const;

export const type = {
  display: { fontSize: 30, lineHeight: 37, fontWeight: '700' as const },
  title: { fontSize: 23, lineHeight: 30, fontWeight: '700' as const },
  heading: { fontSize: 18, lineHeight: 25, fontWeight: '700' as const },
  body: { fontSize: 15, lineHeight: 23, fontWeight: '400' as const },
  bodyStrong: { fontSize: 15, lineHeight: 23, fontWeight: '600' as const },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
  caption: { fontSize: 12, lineHeight: 17, fontWeight: '500' as const },
} as const;
