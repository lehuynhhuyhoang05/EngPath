export const colors = {
  canvas: '#F4F7FC',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF3FA',
  ink: '#172033',
  inkSoft: '#3F4A5F',
  muted: '#667085',
  line: '#D8E0EC',
  lineStrong: '#B9C4D4',
  primary: '#3659D9',
  primaryPressed: '#2947BC',
  primarySoft: '#E9EEFF',
  success: '#137A5A',
  successSoft: '#DDF5EB',
  warning: '#9A6200',
  warningSoft: '#FFF0CC',
  danger: '#B4232E',
  dangerSoft: '#FDE8EA',
  scrim: '#101828',
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
  sm: 10,
  md: 14,
  lg: 18,
  hero: 24,
  round: 999,
} as const;

export const type = {
  display: { fontSize: 32, lineHeight: 39, fontWeight: '700' as const },
  title: { fontSize: 24, lineHeight: 31, fontWeight: '700' as const },
  heading: { fontSize: 18, lineHeight: 25, fontWeight: '700' as const },
  body: { fontSize: 15, lineHeight: 23, fontWeight: '400' as const },
  bodyStrong: { fontSize: 15, lineHeight: 23, fontWeight: '600' as const },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
  caption: { fontSize: 12, lineHeight: 17, fontWeight: '500' as const },
} as const;
