import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/tokens';

export function PrivacyOrbit() {
  return (
    <View style={styles.container}>
      <View style={styles.outer} />
      <View style={styles.middle} />
      <View style={styles.core}><View style={styles.dot} /></View>
      <View style={[styles.node, styles.top]} />
      <View style={[styles.node, styles.left]} />
      <View style={[styles.node, styles.right]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignSelf: 'center', width: 230, height: 230, marginTop: 36, alignItems: 'center', justifyContent: 'center' },
  outer: { position: 'absolute', width: 210, height: 210, borderRadius: 110, borderWidth: 1, borderColor: '#292633' },
  middle: { position: 'absolute', width: 160, height: 160, borderRadius: 90, borderWidth: 1, borderColor: '#393447' },
  core: { width: 88, height: 88, borderRadius: 30, borderWidth: 1, borderColor: '#635B83', backgroundColor: '#17151F', alignItems: 'center', justifyContent: 'center' },
  dot: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.accent },
  node: { position: 'absolute', width: 8, height: 8, borderRadius: 5, backgroundColor: '#77718F' },
  top: { top: 15, right: 45 },
  left: { bottom: 35, left: 25 },
  right: { bottom: 40, right: 24 },
});
