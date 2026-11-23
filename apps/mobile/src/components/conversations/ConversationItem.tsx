import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { NeumorphicSurface } from '../ui/NeumorphicSurface';

export type Conversation = {
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
}: {
  item: Conversation;
  onPress?: () => void;
}) {
  const { palette } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: palette.border },
        pressed && styles.pressed,
      ]}
    >
      <NeumorphicSurface raised style={[styles.avatar, { backgroundColor: item.color }]}>
        <Text style={[styles.initial, { color: palette.text }]}>{item.initials}</Text>
      </NeumorphicSurface>
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Animated.Text style={[styles.name, { color: palette.text }]}>
            {item.name}
          </Animated.Text>
          <Animated.Text style={[styles.time, { color: palette.muted }]}>
            {item.time}
          </Animated.Text>
        </View>
        <Animated.Text style={[styles.message, { color: palette.muted }]} numberOfLines={1}>
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
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 13,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { fontSize: 15, fontWeight: '700' },
  content: { flex: 1, gap: 5 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: { fontSize: 14, fontWeight: '600' },
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
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
});
