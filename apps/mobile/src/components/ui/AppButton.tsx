import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { NeumorphicSurface } from './NeumorphicSurface';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  rightLabel?: string;
  style?: ViewStyle;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  rightLabel,
  style,
}: Props) {
  const { palette } = useTheme();
  const [pressed, setPressed] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const animate = (to: number) =>
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      speed: 24,
      bounciness: 3,
    }).start();

  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';

  const labelColor = isPrimary ? '#FFFFFF' : palette.text;

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }, style]}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        onPressIn={() => {
          setPressed(true);
          animate(0.98);
        }}
        onPressOut={() => {
          setPressed(false);
          animate(1);
        }}
      >
        {isGhost ? (
          <Animated.Text style={[styles.ghostLabel, { color: palette.accent }]}>
            {label}{rightLabel ? `  ${rightLabel}` : ''}
          </Animated.Text>
        ) : (
          <NeumorphicSurface
            raised={!pressed}
            inset={pressed}
            style={[
              styles.surface,
              isPrimary && {
                backgroundColor: palette.accent,
                borderTopColor: '#FA858A',
                borderLeftColor: '#FA858A',
                borderRightColor: '#B83D46',
                borderBottomColor: '#B83D46',
              },
            ]}
          >
            <Animated.Text style={[styles.label, { color: labelColor }]}>
              {label}
            </Animated.Text>
            {rightLabel ? (
              <Animated.Text style={[styles.right, { color: labelColor }]}>
                {rightLabel}
              </Animated.Text>
            ) : null}
          </NeumorphicSurface>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  surface: {
    minHeight: 50,
    borderRadius: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: { fontSize: 13, fontWeight: '700', letterSpacing: 0.1 },
  right: { fontSize: 19, fontWeight: '500' },
  ghostLabel: {
    minHeight: 42,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
});
