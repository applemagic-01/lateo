import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius } from '../../theme/tokens';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  rightLabel?: string;
  style?: ViewStyle;
};

export function AppButton({ label, onPress, variant = 'primary', rightLabel, style }: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.base, styles[variant], pressed && styles.pressed, style]}>
      <Text style={[styles.label, variant !== 'primary' && styles.secondaryLabel]}>{label}</Text>
      {rightLabel ? <Text style={[styles.right, variant !== 'primary' && styles.secondaryLabel]}>{rightLabel}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 54, borderRadius: radius.md, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  primary: { backgroundColor: colors.accentSoft },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  ghost: { backgroundColor: 'transparent' },
  label: { color: colors.accentText, fontSize: 15, fontWeight: '600' },
  secondaryLabel: { color: colors.text },
  right: { color: colors.accentText, fontSize: 20 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
});
