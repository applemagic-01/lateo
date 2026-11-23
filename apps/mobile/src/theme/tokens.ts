export const colors = {
  background: '#202127',
  surface: '#25262E',
  surfaceRaised: '#25262E',
  surfaceInset: '#1C1D24',
  border: '#30323B',
  highlight: '#383A45',
  shadow: '#101116',
  text: '#F1F1F3',
  textMuted: '#A0A1AA',
  accent: '#D94B55',
  accentSoft: '#D94B55',
  accentText: '#FFFFFF',
  success: '#86B99A',
  warning: '#D7B77A',
  danger: '#D96A70',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  huge: 48,
} as const;

export const radius = { sm: 10, md: 16, lg: 22, pill: 999 } as const;
export const typography = {
  small: 10,
  caption: 12,
  body: 15,
  title: 30,
  display: 43,
} as const;
