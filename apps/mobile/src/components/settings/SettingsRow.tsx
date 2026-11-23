import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useAnimatedTheme } from '../../theme/ThemeProvider';

type Props = { title: string; detail: string; onPress?: () => void };
export function SettingsRow({ title, detail, onPress }: Props) {
  const theme = useAnimatedTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.text}><Animated.Text style={[styles.title, { color: theme.text }]}>{title}</Animated.Text><Animated.Text style={[styles.detail, { color: theme.muted }]}>{detail}</Animated.Text></View>
      <Animated.Text style={[styles.trailing, { color: theme.muted }]}>›</Animated.Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({ row: { minHeight: 68, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, justifyContent: 'space-between' }, text: { gap: 5 }, title: { fontSize: 14, fontWeight: '500' }, detail: { fontSize: 11 }, trailing: { fontSize: 22 }, pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] } });
