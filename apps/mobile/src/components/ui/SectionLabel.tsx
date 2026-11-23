import { Animated, StyleSheet } from 'react-native';
import { useAnimatedTheme } from '../../theme/ThemeProvider';
export function SectionLabel({ children }: { children: string }) {
  const theme = useAnimatedTheme();
  return <Animated.Text style={[styles.label, { color: theme.accent }]}>{children}</Animated.Text>;
}
const styles = StyleSheet.create({ label: { fontSize: 10, letterSpacing: 2.6, fontWeight: '600' } });
