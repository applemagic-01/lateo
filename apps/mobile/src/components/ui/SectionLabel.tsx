import { StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/tokens';

export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({ label: { color: '#9B91C7', fontSize: 10, letterSpacing: 2.6, fontWeight: '600' } });
