import { router } from 'expo-router';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useTheme } from '../../theme/ThemeProvider';
import { NeumorphicSurface } from '../ui/NeumorphicSurface';

export function ConversationHeader({
  name,
  initials,
  color,
  onAvatarPress,
  statusLabel = 'Anonymous connection',
}: {
  name: string;
  initials: string;
  color: string;
  onAvatarPress?: () => void;
  statusLabel?: string;
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

      <Pressable
        onPress={onAvatarPress}
        accessibilityRole="button"
        accessibilityLabel={`Conversation options for ${name}`}
        accessibilityHint="Opens mute, block and report options"
        hitSlop={6}
      >
        <NeumorphicSurface raised style={styles.avatar}>
          <View style={[styles.avatarInner, { backgroundColor: palette.surfaceAlt, borderColor: palette.highlight }]}>
            <Animated.Text style={[styles.initials, { color: palette.text }]}>
              {initials}
            </Animated.Text>
          </View>
        </NeumorphicSurface>
      </Pressable>

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
    width: 48,
    height: 48,
    borderRadius: 17,
    padding: 3,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontSize: 14, fontWeight: '700' },
  info: { flex: 1, gap: 3 },
  name: { fontSize: 14, fontWeight: '700' },
  status: { fontSize: 10 },
});
