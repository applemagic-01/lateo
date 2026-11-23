import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { useAnimatedTheme } from '../../theme/ThemeProvider';
import { radius } from '../../theme/tokens';

type Props = { label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'ghost'; rightLabel?: string; style?: ViewStyle };
export function AppButton({ label, onPress, variant = 'primary', rightLabel, style }: Props) {
  const theme = useAnimatedTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const animate = (to: number) => Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 24, bounciness: 4 }).start();
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable accessibilityRole="button" onPress={onPress} onPressIn={() => animate(0.975)} onPressOut={() => animate(1)} style={[styles.base, { backgroundColor: variant === 'primary' ? theme.accentSoft : variant === 'secondary' ? theme.surface : 'transparent', borderColor: theme.border, shadowColor: theme.shadow }, variant === 'secondary' && styles.secondary, variant === 'primary' && styles.primary, variant === 'ghost' && styles.ghost]}>
        <Animated.Text style={[styles.label, { color: variant === 'primary' ? theme.accentText : theme.text }]}>{label}</Animated.Text>
        {rightLabel ? <Animated.Text style={[styles.right, { color: variant === 'primary' ? theme.accentText : theme.text }]}>{rightLabel}</Animated.Text> : null}
      </Pressable>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  base: { minHeight: 54, borderRadius: radius.md, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, shadowOffset: { width: 3, height: 4 }, shadowOpacity: 0.16, shadowRadius: 6, elevation: 2 },
  primary: { borderColor: 'transparent' }, secondary: {}, ghost: { borderWidth: 0, shadowOpacity: 0, elevation: 0 },
  label: { fontSize: 15, fontWeight: '600' }, right: { fontSize: 20 },
});
