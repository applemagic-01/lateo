import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/tokens';

export function BrandMark() {
  return (
    <View style={styles.row}>
      <View style={styles.mark}><View style={styles.dot} /></View>
      <Text style={styles.wordmark}>LATEO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  mark: { width: 30, height: 30, borderRadius: 10, borderWidth: 1, borderColor: '#77728F', alignItems: 'center', justifyContent: 'center' },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.accent },
  wordmark: { color: colors.text, fontSize: 15, letterSpacing: 4, fontWeight: '600' },
});
