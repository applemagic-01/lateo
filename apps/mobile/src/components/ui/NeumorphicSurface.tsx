import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

type Props = PropsWithChildren<{
  style?: ViewStyle;
  inset?: boolean;
  raised?: boolean;
}>;

export function NeumorphicSurface({
  children,
  style,
  inset = false,
  raised = false,
}: Props) {
  const { palette } = useTheme();

  return (
    <View
      style={[
        styles.darkShadow,
        {
          shadowColor: palette.shadow,
          shadowOpacity: inset ? 0.04 : raised ? 0.52 : 0.32,
          shadowOffset: inset
            ? { width: -2, height: -2 }
            : { width: raised ? 8 : 5, height: raised ? 9 : 6 },
          shadowRadius: inset ? 3 : raised ? 13 : 9,
          elevation: inset ? 0 : raised ? 7 : 4,
        },
      ]}
    >
      <View
        style={[
          styles.lightShadow,
          {
            shadowColor: palette.highlight,
            shadowOpacity: inset ? 0.08 : 0.34,
            shadowOffset: inset
              ? { width: 2, height: 2 }
              : { width: -6, height: -6 },
            shadowRadius: inset ? 3 : 10,
          },
        ]}
      >
        <View
          style={[
            styles.face,
            {
              backgroundColor: inset ? palette.inset : palette.surface,
              borderTopColor: inset ? palette.border : palette.highlight,
              borderLeftColor: inset ? palette.border : palette.highlight,
              borderRightColor: inset ? palette.highlight : palette.border,
              borderBottomColor: inset ? palette.highlight : palette.border,
            },
            raised && styles.raised,
            inset && styles.inset,
            style,
          ]}
        >
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  darkShadow: {
    borderRadius: 22,
    overflow: 'visible',
  },
  lightShadow: {
    borderRadius: 22,
    overflow: 'visible',
  },
  face: {
    borderWidth: 1,
    borderRadius: 22,
    overflow: 'hidden',
  },
  raised: {
    borderRadius: 24,
  },
  inset: {
    borderRadius: 18,
  },
});
