import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { NeumorphicSurface } from '../ui/NeumorphicSurface';

type Props = { title: string; detail: string; onPress?: () => void };

export function SettingsRow({ title, detail, onPress }: Props) {
  const { palette } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.text}>
        <Animated.Text style={[styles.title, { color: palette.text }]}>
          {title}
        </Animated.Text>
        <Animated.Text style={[styles.detail, { color: palette.muted }]}>
          {detail}
        </Animated.Text>
      </View>
      <NeumorphicSurface inset style={styles.trailingSurface}>
        <Animated.Text style={[styles.trailing, { color: palette.muted }]}>
          ›
        </Animated.Text>
      </NeumorphicSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  text: { gap: 5 },
  title: { fontSize: 14, fontWeight: '500' },
  detail: { fontSize: 11 },
  trailingSurface: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailing: { fontSize: 20, lineHeight: 24, marginTop: -2 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
});
