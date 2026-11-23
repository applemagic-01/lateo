import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/tokens';

type Props = { title: string; detail: string; onPress?: () => void };

export function SettingsRow({ title, detail, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.text}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View>
      <Text style={styles.trailing}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 68, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, justifyContent: 'space-between' },
  text: { gap: 5 },
  title: { color: colors.text, fontSize: 14, fontWeight: '500' },
  detail: { color: colors.textMuted, fontSize: 11 },
  trailing: { color: '#6F6A7A', fontSize: 22 },
  pressed: { opacity: 0.75 },
});
