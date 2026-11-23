import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export function ThemeToggle() {
  const { mode, toggle, palette } = useTheme();
  return (
    <Pressable accessibilityRole="switch" accessibilityState={{ checked: mode === 'light' }} onPress={toggle} style={[styles.track, { backgroundColor: palette.raised, borderColor: palette.border }]}>
      <View style={[styles.thumb, { backgroundColor: palette.surface, borderColor: palette.border }, mode === 'light' && styles.thumbLight]} />
      <Text style={[styles.icon, styles.left, { color: mode === 'dark' ? palette.accent : palette.muted }]}>☾</Text>
      <Text style={[styles.icon, styles.right, { color: mode === 'light' ? palette.accent : palette.muted }]}>☀</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  track: { width: 68, height: 34, borderRadius: 17, borderWidth: 1, justifyContent: 'center', padding: 3 },
  thumb: { position: 'absolute', width: 26, height: 26, borderRadius: 13, borderWidth: 1, left: 3, top: 3 },
  thumbLight: { left: 37 },
  icon: { position: 'absolute', top: 8, fontSize: 12 },
  left: { left: 10 },
  right: { right: 10 },
});
