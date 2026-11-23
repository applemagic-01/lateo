import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { Animated, Easing } from 'react-native';

export type ThemeMode = 'dark' | 'light';

const dark = {
  background: '#09090D', surface: '#13121A', raised: '#1B1923', text: '#F6F4FB',
  muted: '#9694A3', accent: '#B8A9F4', accentSoft: '#E9E4F8', accentText: '#17141F',
  border: '#302D3A', shadow: '#000000', highlight: '#25232D', success: '#8BD5B0',
  warning: '#D6B67C', danger: '#E7A1A9', surfaceAlt: '#211D2D',
};
const light = {
  background: '#F0EFF5', surface: '#F4F3F8', raised: '#E8E6EF', text: '#24212D',
  muted: '#777382', accent: '#7766B5', accentSoft: '#DCD5F5', accentText: '#231C3B',
  border: '#D7D4E0', shadow: '#B9B6C4', highlight: '#FFFFFF', success: '#397A5B',
  warning: '#986B2B', danger: '#B45561', surfaceAlt: '#E5E1EF',
};

type Palette = typeof dark;
type ThemeContextValue = { mode: ThemeMode; palette: Palette; progress: Animated.Value; toggle: () => void; setMode: (mode: ThemeMode) => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const progress = useMemo(() => new Animated.Value(0), []);
  const setMode = (next: ThemeMode) => {
    setModeState(next);
    Animated.timing(progress, { toValue: next === 'light' ? 1 : 0, duration: 360, easing: Easing.inOut(Easing.ease), useNativeDriver: false }).start();
  };
  const value = useMemo(() => ({ mode, palette: mode === 'light' ? light : dark, progress, toggle: () => setMode(mode === 'dark' ? 'light' : 'dark'), setMode }), [mode, progress]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used within ThemeProvider');
  return value;
}

export function useAnimatedTheme() {
  const { progress } = useTheme();
  const color = (from: string, to: string) => progress.interpolate({ inputRange: [0, 1], outputRange: [from, to] });
  return {
    background: color(dark.background, light.background),
    surface: color(dark.surface, light.surface),
    raised: color(dark.raised, light.raised),
    text: color(dark.text, light.text),
    muted: color(dark.muted, light.muted),
    accent: color(dark.accent, light.accent),
    accentSoft: color(dark.accentSoft, light.accentSoft),
    accentText: color(dark.accentText, light.accentText),
    border: color(dark.border, light.border),
    shadow: color(dark.shadow, light.shadow),
    highlight: color(dark.highlight, light.highlight),
    surfaceAlt: color(dark.surfaceAlt, light.surfaceAlt),
  };
}
