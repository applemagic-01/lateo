import { router } from 'expo-router';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useTheme } from '../../theme/ThemeProvider';
import { NeumorphicSurface } from '../ui/NeumorphicSurface';

export function ConversationHeader({
  name,
  initials,
  color,
}: {
  name: string;
  initials: string;
  color: string;
}) {
  const { palette } = useTheme();

  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} accessibilityLabel="Go back">
        <NeumorphicSurface inset style={styles.back}>
          <Animated.Text style={[styles.backText, { color: palette.text }]}>
            ‹
          </Animated.Text>
        </NeumorphicSurface>
      </Pressable>

      <NeumorphicSurface raised style={styles.avatar}>
        <View style={[styles.avatarInner, { backgroundColor: color }]}>
          <Animated.Text style={styles.initials}>{initials}</Animated.Text>
        </View>
      </NeumorphicSurface>

      <View style={styles.info}>
        <Animated.Text style={[styles.name, { color: palette.text }]}>
          {name}
        </Animated.Text>
        <Animated.Text style={[styles.status, { color: palette.muted }]}>
          Anonymous connection
        </Animated.Text>
      </View>
      <ThemeToggle />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingBottom: 14,
  },
  back: {
    width: 39,
    height: 39,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 27, marginTop: -3 },
  avatar: {
    width: 43,
    height: 43,
    borderRadius: 16,
    padding: 3,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  info: { flex: 1, gap: 3 },
  name: { fontSize: 14, fontWeight: '700' },
  status: { fontSize: 10 },
});
