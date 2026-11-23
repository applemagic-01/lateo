import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { Animated, Easing } from 'react-native';

export type ThemeMode = 'dark' | 'light';

const dark = {
  background: '#252B35',
  surface: '#252B35',
  raised: '#252B35',
  inset: '#202630',
  text: '#F1F3F6',
  muted: '#9AA4B1',
  accent: '#F05A60',
  accentSoft: '#F05A60',
  accentText: '#FFFFFF',
  border: '#303946',
  shadow: '#111720',
  highlight: '#46515F',
  success: '#8EC7A2',
  warning: '#E4B66F',
  danger: '#E8787E',
  surfaceAlt: '#29313C',
};

const light = {
  background: '#E7EBF0',
  surface: '#E7EBF0',
  raised: '#E7EBF0',
  inset: '#DDE3EA',
  text: '#29313C',
  muted: '#697583',
  accent: '#CE4851',
  accentSoft: '#D94E57',
  accentText: '#FFFFFF',
  border: '#D4DBE4',
  shadow: '#B7C0CC',
  highlight: '#FFFFFF',
  success: '#397A5B',
  warning: '#986B2B',
  danger: '#B45561',
  surfaceAlt: '#E1E6ED',
};

type Palette = typeof dark;
type ThemeContextValue = {
  mode: ThemeMode;
  palette: Palette;
  progress: Animated.Value;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const progress = useMemo(() => new Animated.Value(0), []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    Animated.timing(progress, {
      toValue: next === 'light' ? 1 : 0,
      duration: 320,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const value = useMemo(
    () => ({
      mode,
      palette: mode === 'light' ? light : dark,
      progress,
      toggle: () => setMode(mode === 'dark' ? 'light' : 'dark'),
      setMode,
    }),
    [mode, progress],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used within ThemeProvider');
  return value;
}

// Kept as a compatibility alias while components migrate to the static palette.
export function useAnimatedTheme() {
  const { palette } = useTheme();
  return palette;
}
