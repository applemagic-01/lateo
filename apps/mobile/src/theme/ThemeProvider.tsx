import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { Animated, Easing } from 'react-native';

export type ThemeMode = 'dark' | 'light';

const dark = {
  background: '#202127',
  surface: '#25262E',
  raised: '#25262E',
  inset: '#1C1D24',
  text: '#F1F1F3',
  muted: '#A0A1AA',
  accent: '#D94B55',
  accentSoft: '#D94B55',
  accentText: '#FFFFFF',
  border: '#30323B',
  shadow: '#101116',
  highlight: '#383A45',
  success: '#86B99A',
  warning: '#D7B77A',
  danger: '#D96A70',
  surfaceAlt: '#24252D',
};

const light = {
  background: '#E9E8E6',
  surface: '#E9E8E6',
  raised: '#E9E8E6',
  inset: '#DEDDDA',
  text: '#292A30',
  muted: '#74757D',
  accent: '#C83F49',
  accentSoft: '#C83F49',
  accentText: '#FFFFFF',
  border: '#D1D0CE',
  shadow: '#B8B7B4',
  highlight: '#FFFFFF',
  success: '#397A5B',
  warning: '#986B2B',
  danger: '#B45561',
  surfaceAlt: '#E1E0DD',
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

export function useAnimatedTheme() {
  const { palette } = useTheme();
  return palette;
}
