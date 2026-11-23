import { PropsWithChildren } from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
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
  const flattenedStyle = StyleSheet.flatten(style);
  const borderRadius =
    flattenedStyle?.borderRadius ?? (inset ? 18 : raised ? 24 : 22);

  return (
    <View
      style={[
        styles.shadow,
        {
          borderRadius,
          backgroundColor: inset ? palette.inset : palette.surface,
          shadowColor: palette.shadow,
          shadowOpacity: inset ? 0.05 : raised ? 0.52 : 0.32,
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
          styles.highlight,
          {
            borderRadius,
            backgroundColor: inset ? palette.inset : palette.surface,
            shadowColor: palette.highlight,
            shadowOpacity: inset ? 0.1 : 0.34,
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
              borderRadius,
              backgroundColor: inset ? palette.inset : palette.surface,
              borderTopColor: inset ? palette.border : palette.highlight,
              borderLeftColor: inset ? palette.border : palette.highlight,
              borderRightColor: inset ? palette.highlight : palette.border,
              borderBottomColor: inset ? palette.highlight : palette.border,
            },
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
  shadow: {
    overflow: 'visible',
  },
  highlight: {
    overflow: 'visible',
  },
  face: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});
