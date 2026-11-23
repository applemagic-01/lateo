import { Animated, StyleSheet, Text, View } from 'react-native';
import { NeumorphicSurface } from '../ui/NeumorphicSurface';
import { useAnimatedTheme } from '../../theme/ThemeProvider';

type Props = { identityName: string; identityHint?: string };
export function IdentityCard({ identityName, identityHint = 'Your identity is not connected to personal details.' }: Props) {
  const theme = useAnimatedTheme();
  return (
    <NeumorphicSurface style={styles.card} raised>
      <View style={styles.mark}><Animated.Text style={[styles.glyph, { color: theme.accent }]}>◈</Animated.Text></View>
      <View style={styles.info}>
        <Animated.Text style={[styles.label, { color: theme.muted }]}>ANONYMOUS IDENTITY</Animated.Text>
        <Animated.Text style={[styles.name, { color: theme.text }]}>{identityName}</Animated.Text>
        <Animated.Text style={[styles.hint, { color: theme.muted }]}>{identityHint}</Animated.Text>
      </View>
      <View style={styles.status} />
    </NeumorphicSurface>
  );
}
const styles = StyleSheet.create({ card: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 13 }, mark: { width: 42, height: 42, borderRadius: 15, backgroundColor: '#242130', alignItems: 'center', justifyContent: 'center' }, glyph: { fontSize: 19 }, info: { flex: 1, gap: 4 }, label: { fontSize: 9, letterSpacing: 1.6, fontWeight: '600' }, name: { fontSize: 15, fontWeight: '600' }, hint: { fontSize: 10, lineHeight: 14 }, status: { width: 7, height: 7, borderRadius: 5, backgroundColor: '#8BD5B0' } });
