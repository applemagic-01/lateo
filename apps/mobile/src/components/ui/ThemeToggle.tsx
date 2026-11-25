import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export function ThemeToggle() {
  const { mode, toggle, palette, progress } = useTheme();

  const position = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 38],
  });
  const thumbRotation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['-24deg', '24deg'],
  });
  const moonOpacity = progress.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [1, 0, 0],
  });
  const sunOpacity = progress.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [0, 0, 1],
  });
  const thumbScale = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.94, 1],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel="Toggle light and dark appearance"
      accessibilityState={{ checked: mode === 'light' }}
      onPress={toggle}
      hitSlop={7}
      style={[
        styles.track,
        {
          backgroundColor: palette.inset,
          borderTopColor: palette.border,
          borderLeftColor: palette.border,
          borderRightColor: palette.highlight,
          borderBottomColor: palette.highlight,
          shadowColor: palette.shadow,
        },
      ]}
    >
      <Text
        style={[
          styles.trackIcon,
          styles.moonTrack,
          { color: mode === 'dark' ? palette.accent : palette.muted },
        ]}
      >
        ☾
      </Text>
      <Text
        style={[
          styles.trackIcon,
          styles.sunTrack,
          { color: mode === 'light' ? palette.accent : palette.muted },
        ]}
      >
        ☀
      </Text>

      <Animated.View
        style={[
          styles.thumb,
          {
            backgroundColor: palette.surface,
            borderTopColor: palette.highlight,
            borderLeftColor: palette.highlight,
            borderRightColor: palette.border,
            borderBottomColor: palette.border,
            shadowColor: palette.shadow,
            transform: [
              { translateX: position },
              { rotate: thumbRotation },
              { scale: thumbScale },
            ],
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.thumbIcon,
            styles.moon,
            { color: palette.accent, opacity: moonOpacity },
          ]}
        >
          ☾
        </Animated.Text>
        <Animated.Text
          style={[
            styles.thumbIcon,
            styles.sun,
            { color: palette.accent, opacity: sunOpacity },
          ]}
        >
          ☀
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 76,
    height: 38,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    padding: 3,
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 1,
  },
  trackIcon: {
    position: 'absolute',
    top: 9,
    fontSize: 14,
    lineHeight: 18,
  },
  moonTrack: { left: 11 },
  sunTrack: { right: 10 },
  thumb: {
    position: 'absolute',
    left: 3,
    top: 3,
    width: 30,
    height: 30,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 6,
    elevation: 4,
  },
  thumbIcon: {
    position: 'absolute',
    fontSize: 15,
    lineHeight: 19,
    textAlign: 'center',
  },
  moon: { top: 5, left: 7 },
  sun: { top: 5, left: 6 },
});
