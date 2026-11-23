import { PropsWithChildren } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnimatedTheme } from '../../theme/ThemeProvider';

type Props = PropsWithChildren<{ contentStyle?: ViewStyle; padded?: boolean }>;
export function Screen({ children, contentStyle, padded = true }: Props) {
  const theme = useAnimatedTheme();
  return (
    <Animated.View style={[styles.safe, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safe} edges={['top', 'right', 'bottom', 'left']}>
        <Animated.View style={[styles.content, padded && styles.padded, { backgroundColor: theme.background }, contentStyle]}>{children}</Animated.View>
      </SafeAreaView>
    </Animated.View>
  );
}
const styles = StyleSheet.create({ safe: { flex: 1 }, content: { flex: 1 }, padded: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 14 } });
