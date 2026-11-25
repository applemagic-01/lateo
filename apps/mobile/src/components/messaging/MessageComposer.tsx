import { useCallback, useEffect, useRef, useState } from 'react';
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

const SEND_LABEL = 'SENDING';
const SCRAMBLE_CHARS = '01<>/{}[]+=~';

type SendPhase = 'idle' | 'sending' | 'sent';

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
  const [phase, setPhase] = useState<SendPhase>('idle');
  const [buttonText, setButtonText] = useState('↑');

  const buttonWidth = useRef(new Animated.Value(46)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonLift = useRef(new Animated.Value(0)).current;
  const buttonRotation = useRef(new Animated.Value(0)).current;
  const sheenPosition = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(0.6)).current;
  const pulseOpacity = useRef(new Animated.Value(0)).current;

  const scrambleTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMessage = value.trim().length > 0;

  const clearTimers = useCallback(() => {
    if (scrambleTimer.current) {
      clearInterval(scrambleTimer.current);
      scrambleTimer.current = null;
    }
    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const animateSend = () => {
    if (!hasMessage || phase !== 'idle') return;

    setPhase('sending');
    setButtonText(SEND_LABEL);
    onSend();

    buttonWidth.stopAnimation();
    buttonScale.stopAnimation();
    buttonLift.stopAnimation();
    buttonRotation.stopAnimation();
    sheenPosition.setValue(0);
    pulseScale.setValue(0.6);
    pulseOpacity.setValue(0.48);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.88,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1.08,
          useNativeDriver: true,
          speed: 18,
          bounciness: 10,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 22,
          bounciness: 7,
        }),
      ]),
      Animated.sequence([
        Animated.timing(buttonLift, {
          toValue: 3,
          duration: 90,
          useNativeDriver: true,
        }),
        Animated.spring(buttonLift, {
          toValue: 0,
          useNativeDriver: true,
          speed: 18,
          bounciness: 8,
        }),
      ]),
      Animated.timing(buttonWidth, {
        toValue: 112,
        duration: 160,
        useNativeDriver: false,
      }),
      Animated.timing(buttonRotation, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
      }),
      Animated.timing(sheenPosition, {
        toValue: 1,
        duration: 540,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(pulseScale, {
          toValue: 1.8,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0,
          duration: 420,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    let position = 0;
    scrambleTimer.current = setInterval(() => {
      position += 1;

      const revealed = Math.floor(position / 2);
      const scrambled = SEND_LABEL.split('')
        .map((character, index) => {
          if (index < revealed) return character;
          return SCRAMBLE_CHARS[
            Math.floor(Math.random() * SCRAMBLE_CHARS.length)
          ];
        })
        .join('');

      setButtonText(scrambled);

      if (position >= SEND_LABEL.length * 2) {
        if (scrambleTimer.current) {
          clearInterval(scrambleTimer.current);
          scrambleTimer.current = null;
        }

        setPhase('sent');
        setButtonText('✓');

        Animated.parallel([
          Animated.timing(buttonRotation, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.spring(buttonWidth, {
            toValue: 46,
            useNativeDriver: false,
            speed: 18,
            bounciness: 7,
          }),
        ]).start();

        resetTimer.current = setTimeout(() => {
          setPhase('idle');
          setButtonText('↑');
          buttonWidth.setValue(46);
          buttonScale.setValue(1);
          buttonLift.setValue(0);
          buttonRotation.setValue(0);
        }, 620);
      }
    }, 42);
  };

  const rotation = buttonRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const sheenTranslate = sheenPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-105, 125],
  });

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

        <Animated.View style={[styles.buttonSlot, { width: buttonWidth } ]}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pulse,
              {
                borderColor: palette.accent,
                opacity: pulseOpacity,
                transform: [{ scale: pulseScale }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.buttonMotion,
              {
                transform: [
                  { translateY: buttonLift },
                  { scale: buttonScale },
                ],
              },
            ]}
          >
            <AnimatedPressable
              onPress={animateSend}
              disabled={!hasMessage || phase !== 'idle'}
              accessibilityRole="button"
              accessibilityLabel="Send message"
              accessibilityState={{
                disabled: !hasMessage || phase !== 'idle',
                busy: phase === 'sending',
              }}
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
                    opacity: hasMessage || phase !== 'idle' ? 1 : 0.72,
                  },
                ]}
              >
                <View style={styles.sendClip}>
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.sheen,
                      {
                        opacity: phase === 'sending' ? 0.65 : 0,
                        transform: [
                          { translateX: sheenTranslate },
                          { rotate: '22deg' },
                        ],
                      },
                    ]}
                  />

                  <Animated.Text
                    numberOfLines={1}
                    style={[
                      styles.sendText,
                      {
                        color: palette.accentText,
                        transform: [{ rotate: rotation }],
                      },
                      phase === 'sending' && styles.sendingText,
                    ]}
                  >
                    {buttonText}
                  </Animated.Text>
                </View>
              </NeumorphicSurface>
            </AnimatedPressable>
          </Animated.View>
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
    paddingRight: 7,
    paddingVertical: 5,
    gap: 8,
  },
  input: {
    flex: 1,
    minWidth: 0,
    maxHeight: 100,
    minHeight: 42,
    fontSize: 14,
    paddingVertical: 10,
  },
  buttonSlot: {
    height: 48,
    flexShrink: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonMotion: {
    width: '100%',
    height: 46,
    alignSelf: 'flex-end',
  },
  send: {
    width: '100%',
    height: 46,
    borderRadius: 24,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendClip: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    fontSize: 23,
    fontWeight: '800',
    fontFamily: 'monospace',
    textAlign: 'center',
    includeFontPadding: false,
  },
  sendingText: {
    fontSize: 11,
    fontFamily: 'monospace',
    letterSpacing: 1.8,
    fontWeight: '800',
  },
  sheen: {
    position: 'absolute',
    top: -14,
    bottom: -14,
    width: 24,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 20,
  },
  pulse: {
    position: 'absolute',
    right: 1,
    top: 2,
    width: 42,
    height: 42,
    borderRadius: 24,
    borderWidth: 2,
  },
});
