export const colors = {
  background: '#252B35',
  surface: '#252B35',
  surfaceRaised: '#252B35',
  surfaceInset: '#202630',
  border: '#303946',
  text: '#F1F3F6',
  textMuted: '#9AA4B1',
  accent: '#F05A60',
  accentSoft: '#F05A60',
  accentText: '#FFFFFF',
  highlight: '#46515F',
  shadow: '#111720',
  success: '#8EC7A2',
  warning: '#E4B66F',
  danger: '#E8787E',
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
