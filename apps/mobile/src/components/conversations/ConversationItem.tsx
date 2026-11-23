import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAnimatedTheme } from '../../theme/ThemeProvider';

export type Conversation = { initials: string; name: string; message: string; time: string; unread: number; color: string };
export function ConversationItem({ item, onPress }: { item: Conversation; onPress?: () => void }) {
  const theme = useAnimatedTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { borderBottomColor: theme.border }, pressed && styles.pressed]}>
      <View style={[styles.avatar, { backgroundColor: item.color }]}><Text style={styles.initial}>{item.initials}</Text></View>
      <View style={styles.content}>
        <View style={styles.nameRow}><Animated.Text style={[styles.name, { color: theme.text }]}>{item.name}</Animated.Text><Animated.Text style={[styles.time, { color: theme.muted }]}>{item.time}</Animated.Text></View>
        <Animated.Text style={[styles.message, { color: theme.muted }]} numberOfLines={1}>{item.message}</Animated.Text>
      </View>
      {item.unread > 0 && <View style={[styles.unread, { backgroundColor: theme.accent }]}><Text style={[styles.unreadText, { color: theme.accentText }]}>{item.unread}</Text></View>}
    </Pressable>
  );
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, gap: 13 }, avatar: { width: 48, height: 48, borderRadius: 17, alignItems: 'center', justifyContent: 'center' }, initial: { color: '#F8F6FB', fontSize: 17, fontWeight: '600' }, content: { flex: 1, gap: 5 }, nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, name: { fontSize: 14, fontWeight: '600' }, time: { fontSize: 10 }, message: { fontSize: 12 }, unread: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, unreadText: { fontSize: 10, fontWeight: '700' }, pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] } });
