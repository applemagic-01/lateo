import { PropsWithChildren } from 'react';
import { SafeAreaView, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../../theme/tokens';

type Props = PropsWithChildren<{ contentStyle?: ViewStyle; padded?: boolean }>;

export function Screen({ children, contentStyle, padded = true }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.content, padded && styles.padded, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  padded: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 14 },
});
