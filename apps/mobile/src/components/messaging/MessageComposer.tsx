import { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { NeumorphicSurface } from '../ui/NeumorphicSurface';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MessageComposer({
  value,
  onChangeText,
  onSend,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}) {
  const { palette } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(0)).current;
  const hasMessage = value.trim().length > 0;

  const animateSend = () => {
    if (!hasMessage) return;

    scale.stopAnimation();
    lift.stopAnimation();

    Animated.sequence([
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0.88,
          duration: 85,
          useNativeDriver: true,
        }),
        Animated.timing(lift, {
          toValue: 2,
          duration: 85,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 25,
          bounciness: 8,
        }),
        Animated.spring(lift, {
          toValue: 0,
          useNativeDriver: true,
          speed: 25,
          bounciness: 7,
        }),
      ]),
    ]).start();

    onSend();
  };

  return (
    <View style={styles.wrap}>
      <NeumorphicSurface inset style={styles.shell}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Write a message…"
          placeholderTextColor={palette.muted}
          multiline
          maxLength={4000}
          style={[styles.input, { color: palette.text }]}
          returnKeyType="send"
          blurOnSubmit={false}
          onSubmitEditing={animateSend}
          accessibilityLabel="Write a message"
        />

        <Animated.View
          style={[
            styles.sendMotion,
            {
              opacity: hasMessage ? 1 : 0.72,
              transform: [
                { translateY: lift },
                { scale },
              ],
            },
          ]}
        >
          <AnimatedPressable
            onPress={animateSend}
            disabled={!hasMessage}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            accessibilityState={{ disabled: !hasMessage }}
            hitSlop={6}
          >
            <NeumorphicSurface
              raised
              style={[
                styles.send,
                {
                  backgroundColor: palette.accent,
                  borderTopColor: '#F0787F',
                  borderLeftColor: '#F0787F',
                  borderRightColor: '#A9343E',
                  borderBottomColor: '#A9343E',
                },
              ]}
            >
              <Animated.Text
                style={[styles.sendIcon, { color: palette.accentText }]}
              >
                ↑
              </Animated.Text>
            </NeumorphicSurface>
          </AnimatedPressable>
        </Animated.View>
      </NeumorphicSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 10,
    paddingBottom: 6,
  },
  shell: {
    minHeight: 58,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 17,
    paddingRight: 8,
    paddingVertical: 5,
    gap: 10,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 42,
    fontSize: 14,
    paddingVertical: 10,
  },
  sendMotion: {
    flexShrink: 0,
  },
  send: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: -2,
  },
});
