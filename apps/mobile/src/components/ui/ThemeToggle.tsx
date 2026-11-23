import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export function ThemeToggle() {
  const { mode, toggle, palette, progress } = useTheme();
  const position = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 34] });
  return (
    <Pressable accessibilityRole="switch" accessibilityLabel="Toggle light and dark appearance" accessibilityState={{ checked: mode === 'light' }} onPress={toggle} style={[styles.track, { backgroundColor: palette.raised, borderColor: palette.border }]}>
      <Animated.View style={[styles.thumb, { backgroundColor: palette.surface, borderColor: palette.border, transform: [{ translateX: position }] }]} />
      <Text style={[styles.icon, styles.left, { color: mode === 'dark' ? palette.accent : palette.muted }]}>☾</Text>
      <Text style={[styles.icon, styles.right, { color: mode === 'light' ? palette.accent : palette.muted }]}>☀</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({ track: { width: 68, height: 34, borderRadius: 17, borderWidth: 1, justifyContent: 'center', padding: 3 }, thumb: { position: 'absolute', width: 26, height: 26, borderRadius: 13, borderWidth: 1, left: 3, top: 3 }, icon: { position: 'absolute', top: 8, fontSize: 12 }, left: { left: 10 }, right: { right: 10 } });
