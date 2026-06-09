export const colors = {
  background: '#0F1A0F',
  surface: '#1A2B1A',
  surfaceMuted: '#2A3D2A',
  surfaceTranslucent: 'rgba(15, 26, 15, 0.85)',
  accent: '#E8531A',
  accentDark: '#C44312',
  text: '#F0EDE8',
  textMuted: '#A8A49E',
  border: 'rgba(240, 237, 232, 0.12)',
  charcoal: '#1C1C1C',
} as const;

export const letterSpacing = {
  heading: -0.5,
  headingTight: -1,
  label: 1.5,
} as const;

export const fonts = {
  display: 'Oswald-Bold',
  heading: 'Oswald-Bold',
  body: 'Oswald-Regular',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
} as const;
