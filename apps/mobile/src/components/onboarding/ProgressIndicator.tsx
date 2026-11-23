import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/tokens';

export function ProgressIndicator({ total, activeIndex }: { total: number; activeIndex: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, index) => <View key={index} style={[styles.segment, index <= activeIndex && styles.active]} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, marginTop: 26 },
  segment: { height: 3, flex: 1, borderRadius: 3, backgroundColor: colors.border },
  active: { backgroundColor: colors.accent },
});
