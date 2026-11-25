import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

// Native reimplementation inspired by Praashoo7's Uiverse switch (MIT).
export function ThemeToggle() {
  const { mode, toggle, palette, progress } = useTheme();

  const position = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });
  const trackColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['#171717', '#CCCCCC'],
  });
  const thumbRotation = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-18deg', '0deg', '18deg'],
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
    outputRange: [1, 0.92, 1],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel="Toggle light and dark appearance"
      accessibilityState={{ checked: mode === 'light' }}
      onPress={toggle}
      hitSlop={8}
      style={styles.touchTarget}
    >
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor: trackColor,
            borderColor: mode === 'dark' ? '#35363D' : '#C4C4C4',
            shadowColor: mode === 'dark' ? '#0D0E12' : '#B7B7B7',
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: '#E8E8E8',
              borderColor: mode === 'dark' ? '#FFFFFF' : '#F7F7F7',
              shadowColor: mode === 'dark' ? '#090A0E' : '#A6A6A6',
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
              { color: '#292A30', opacity: moonOpacity },
            ]}
          >
            ☾
          </Animated.Text>
          <Animated.Text
            style={[
              styles.thumbIcon,
              { color: '#9A6A16', opacity: sunOpacity },
            ]}
          >
            ☀
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchTarget: {
    minWidth: 68,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    width: 64,
    height: 36,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    padding: 3,
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.24,
    shadowRadius: 4,
    elevation: 1,
  },
  thumb: {
    position: 'absolute',
    left: 3,
    top: 3,
    width: 28,
    height: 28,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.32,
    shadowRadius: 5,
    elevation: 3,
  },
  thumbIcon: {
    position: 'absolute',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
});
