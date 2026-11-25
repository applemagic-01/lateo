import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { NeumorphicSurface } from '../ui/NeumorphicSurface';

export type Conversation = {
  id: string;
  initials: string;
  name: string;
  message: string;
  time: string;
  unread: number;
  color: string;
};

export function ConversationItem({
  item,
  onPress,
  onMore,
}: {
  item: Conversation;
  onPress?: () => void;
  onMore?: () => void;
}) {
  const { palette } = useTheme();

  return (
    <View style={[styles.row, { borderBottomColor: palette.border }]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Open conversation with ${item.name}`}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
      >
        <NeumorphicSurface raised style={styles.avatar}>
          <Text style={[styles.initial, { color: palette.text }]}>
            {item.initials}
          </Text>
        </NeumorphicSurface>

        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Animated.Text
              numberOfLines={1}
              style={[styles.name, { color: palette.text }]}
            >
              {item.name}
            </Animated.Text>
            <Animated.Text style={[styles.time, { color: palette.muted }]}>
              {item.time}
            </Animated.Text>
          </View>
          <Animated.Text
            style={[styles.message, { color: palette.muted }]}
            numberOfLines={1}
          >
            {item.message}
          </Animated.Text>
        </View>

        {item.unread > 0 ? (
          <View style={[styles.unread, { backgroundColor: palette.accent }]}>
            <Text style={[styles.unreadText, { color: palette.accentText }]}>
              {item.unread}
            </Text>
          </View>
        ) : null}
      </Pressable>

      <Pressable
        onPress={onMore}
        accessibilityRole="button"
        accessibilityLabel={`Manage conversation with ${item.name}`}
        hitSlop={8}
        style={styles.moreHit}
      >
        <Animated.Text style={[styles.moreText, { color: palette.muted }]}>
          ···
        </Animated.Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingRight: 2,
  },
  main: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 2,
    gap: 13,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { fontSize: 15, fontWeight: '700' },
  content: { flex: 1, minWidth: 0, gap: 5 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: { flex: 1, minWidth: 0, fontSize: 14, fontWeight: '600' },
  time: { fontSize: 10 },
  message: { fontSize: 12 },
  unread: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: { fontSize: 10, fontWeight: '700' },
  moreHit: {
    width: 32,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButton: {
    width: 32,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: 'center',
  },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
});
