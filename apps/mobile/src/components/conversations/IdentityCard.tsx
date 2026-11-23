import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../theme/tokens';

type Props = { identityName: string; identityHint?: string };

export function IdentityCard({ identityName, identityHint = 'Your identity is not connected to personal details.' }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.mark}><Text style={styles.glyph}>◈</Text></View>
      <View style={styles.info}>
        <Text style={styles.label}>ANONYMOUS IDENTITY</Text>
        <Text style={styles.name}>{identityName}</Text>
        <Text style={styles.hint}>{identityHint}</Text>
      </View>
      <View style={styles.status} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, gap: 13 },
  mark: { width: 42, height: 42, borderRadius: 15, backgroundColor: '#242130', alignItems: 'center', justifyContent: 'center' },
  glyph: { color: colors.accent, fontSize: 19 },
  info: { flex: 1, gap: 4 },
  label: { color: colors.textMuted, fontSize: 9, letterSpacing: 1.6, fontWeight: '600' },
  name: { color: colors.text, fontSize: 15, fontWeight: '600' },
  hint: { color: colors.textMuted, fontSize: 10, lineHeight: 14 },
  status: { width: 7, height: 7, borderRadius: 5, backgroundColor: colors.success },
});
