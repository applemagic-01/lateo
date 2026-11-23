import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/tokens';

export type Conversation = { initials: string; name: string; message: string; time: string; unread: number; color: string };

export function ConversationItem({ item, onPress }: { item: Conversation; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.avatar, { backgroundColor: item.color }]}><Text style={styles.initial}>{item.initials}</Text></View>
      <View style={styles.content}>
        <View style={styles.nameRow}><Text style={styles.name}>{item.name}</Text><Text style={styles.time}>{item.time}</Text></View>
        <Text style={styles.message} numberOfLines={1}>{item.message}</Text>
      </View>
      {item.unread > 0 && <View style={styles.unread}><Text style={styles.unreadText}>{item.unread}</Text></View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#211F29', gap: 13 },
  avatar: { width: 48, height: 48, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  initial: { color: '#F8F6FB', fontSize: 17, fontWeight: '600' },
  content: { flex: 1, gap: 5 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { color: colors.text, fontSize: 14, fontWeight: '600' },
  time: { color: colors.textMuted, fontSize: 10 },
  message: { color: colors.textMuted, fontSize: 12 },
  unread: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  unreadText: { color: colors.accentText, fontSize: 10, fontWeight: '700' },
  pressed: { opacity: 0.78 },
});
