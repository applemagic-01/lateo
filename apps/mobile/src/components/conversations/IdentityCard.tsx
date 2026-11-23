import { Animated, StyleSheet, View } from 'react-native';
import { NeumorphicSurface } from '../ui/NeumorphicSurface';
import { useTheme } from '../../theme/ThemeProvider';

type Props = { identityName: string; identityHint?: string };

export function IdentityCard({
  identityName,
  identityHint = 'Your identity is not connected to personal details.',
}: Props) {
  const { palette } = useTheme();

  return (
    <NeumorphicSurface style={styles.card} raised>
      <NeumorphicSurface inset style={styles.mark}>
        <Animated.Text style={[styles.glyph, { color: palette.accent }]}>◈</Animated.Text>
      </NeumorphicSurface>
      <View style={styles.info}>
        <Animated.Text style={[styles.label, { color: palette.muted }]}>
          ANONYMOUS IDENTITY
        </Animated.Text>
        <Animated.Text style={[styles.name, { color: palette.text }]}>
          {identityName}
        </Animated.Text>
        <Animated.Text style={[styles.hint, { color: palette.muted }]}>
          {identityHint}
        </Animated.Text>
      </View>
      <View style={[styles.status, { backgroundColor: palette.success }]} />
    </NeumorphicSurface>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 17,
    gap: 14,
    borderRadius: 24,
  },
  mark: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: { fontSize: 20 },
  info: { flex: 1, gap: 4 },
  label: { fontSize: 9, letterSpacing: 1.7, fontWeight: '700' },
  name: { fontSize: 15, fontWeight: '700' },
  hint: { fontSize: 10, lineHeight: 14 },
  status: { width: 7, height: 7, borderRadius: 4 },
});
