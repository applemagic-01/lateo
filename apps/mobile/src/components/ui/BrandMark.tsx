import { Animated, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { NeumorphicSurface } from './NeumorphicSurface';

export function BrandMark() {
  const { palette } = useTheme();

  return (
    <View style={styles.row}>
      <NeumorphicSurface raised style={styles.mark}>
        <View style={[styles.dot, { backgroundColor: palette.accent }]} />
      </NeumorphicSurface>
      <Animated.Text style={[styles.wordmark, { color: palette.text }]}>
        LATEO
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  mark: {
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 9, height: 9, borderRadius: 5 },
  wordmark: { fontSize: 15, letterSpacing: 4, fontWeight: '700' },
});
