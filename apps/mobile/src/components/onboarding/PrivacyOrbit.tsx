import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { NeumorphicSurface } from '../ui/NeumorphicSurface';

export function PrivacyOrbit() {
  const { palette } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.outer,
          { borderColor: palette.border, shadowColor: palette.shadow },
        ]}
      />
      <View
        style={[
          styles.middle,
          { borderColor: palette.highlight, shadowColor: palette.shadow },
        ]}
      />
      <NeumorphicSurface raised style={styles.core}>
        <View style={[styles.dot, { backgroundColor: palette.accent }]} />
      </NeumorphicSurface>
      <View style={[styles.node, styles.top, { backgroundColor: palette.surface, borderColor: palette.highlight, shadowColor: palette.shadow }]} />
      <View style={[styles.node, styles.left, { backgroundColor: palette.surface, borderColor: palette.highlight, shadowColor: palette.shadow }]} />
      <View style={[styles.node, styles.right, { backgroundColor: palette.surface, borderColor: palette.highlight, shadowColor: palette.shadow }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: 230,
    height: 230,
    marginTop: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outer: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 110,
    borderWidth: 1,
    opacity: 0.65,
  },
  middle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 90,
    borderWidth: 1,
    opacity: 0.8,
  },
  core: {
    width: 88,
    height: 88,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 22, height: 22, borderRadius: 11 },
  node: {
    position: 'absolute',
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 1,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 3,
  },
  top: { top: 15, right: 45 },
  left: { bottom: 35, left: 25 },
  right: { bottom: 40, right: 24 },
});
