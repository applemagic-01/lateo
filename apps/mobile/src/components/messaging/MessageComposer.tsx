import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, TextInput, View } from 'react-native';
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

  const press = (to: number) =>
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      speed: 22,
      bounciness: 3,
    }).start();

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
          onSubmitEditing={onSend}
        />
        <Animated.View style={{ transform: [{ scale }] }}>
          <AnimatedPressable
            onPress={onSend}
            onPressIn={() => press(0.9)}
            onPressOut={() => press(1)}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <NeumorphicSurface
              raised
              style={[
                styles.send,
                {
                  backgroundColor: palette.accent,
                  borderTopColor: '#FA858A',
                  borderLeftColor: '#FA858A',
                  borderRightColor: '#B83D46',
                  borderBottomColor: '#B83D46',
                },
              ]}
            >
              <Animated.Text style={[styles.sendIcon, { color: palette.accentText }]}>
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
  wrap: { paddingTop: 10, paddingBottom: 6 },
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
  send: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: { fontSize: 24, fontWeight: '700', marginTop: -2 },
});
