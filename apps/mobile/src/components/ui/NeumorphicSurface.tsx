import { PropsWithChildren } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { useAnimatedTheme } from '../../theme/ThemeProvider';

type Props = PropsWithChildren<{ style?: ViewStyle; inset?: boolean; raised?: boolean }>;
export function NeumorphicSurface({ children, style, inset = false, raised = false }: Props) {
  const theme = useAnimatedTheme();
  return <Animated.View style={[styles.base, { backgroundColor: inset ? theme.background : theme.surface, borderColor: theme.border, shadowColor: theme.shadow }, raised ? styles.raised : inset ? styles.inset : styles.flat, style]}>{children}</Animated.View>;
}
const styles = StyleSheet.create({
  base: { borderWidth: 1, borderRadius: 22, shadowOffset: { width: 5, height: 6 }, shadowOpacity: 0.24, shadowRadius: 10, elevation: 4, overflow: 'visible' },
  raised: { shadowOffset: { width: 7, height: 8 }, shadowOpacity: 0.22, shadowRadius: 12, elevation: 5 },
  inset: { shadowOffset: { width: -3, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 0 },
  flat: { shadowOffset: { width: 2, height: 3 }, shadowOpacity: 0.12, shadowRadius: 5, elevation: 2 },
});
