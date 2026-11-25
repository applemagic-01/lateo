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
      <NeumorphicSurface raised style={styles.mark}>
        <Animated.Text style={[styles.glyph, { color: palette.accent }]}>
          ◈
        </Animated.Text>
      </NeumorphicSurface>

      <View style={styles.info}>
        <Animated.Text style={[styles.label, { color: palette.muted }]}>
          ANONYMOUS IDENTITY
        </Animated.Text>
        <Animated.Text style={[styles.name, { color: palette.text }]}>
          {identityName}
        </Animated.Text>
        <Animated.Text
          numberOfLines={1}
          style={[styles.hint, { color: palette.muted }]}
        >
          {identityHint}
        </Animated.Text>
      </View>

      <View style={styles.statusWrap}>
        <View style={[styles.status, { backgroundColor: palette.success }]} />
        <Animated.Text style={[styles.statusText, { color: palette.muted }]}>
          ACTIVE
        </Animated.Text>
      </View>
    </NeumorphicSurface>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    borderRadius: 20,
  },
  mark: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: { fontSize: 19 },
  info: { flex: 1, minWidth: 0, gap: 3 },
  label: { fontSize: 8, letterSpacing: 1.4, fontWeight: '700' },
  name: { fontSize: 14, fontWeight: '700' },
  hint: { fontSize: 9, lineHeight: 12 },
  statusWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 34,
  },
  status: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 7, letterSpacing: 0.7, fontWeight: '700' },
});
