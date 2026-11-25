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
  const { palette, mode } = useTheme();
  const flattenedStyle = StyleSheet.flatten(style);
  const borderRadius =
    flattenedStyle?.borderRadius ?? (inset ? 18 : raised ? 24 : 22);

  return (
    <View
      style={[
        styles.surface,
        {
          borderRadius,
          backgroundColor: inset ? palette.inset : palette.surface,
          borderTopColor: inset ? palette.border : palette.highlight,
          borderLeftColor: inset ? palette.border : palette.highlight,
          borderRightColor: inset ? palette.highlight : palette.border,
          borderBottomColor: inset ? palette.highlight : palette.border,
          shadowColor: palette.shadow,
          shadowOpacity: mode === 'light'
            ? inset ? 0.18 : raised ? 0.58 : 0.32
            : inset ? 0.08 : raised ? 0.28 : 0.17,
          shadowOffset: inset
            ? { width: mode === 'light' ? -2 : -1, height: mode === 'light' ? -2 : -1 }
            : { width: mode === 'light' ? 7 : 4, height: mode === 'light' ? 8 : 5 },
          shadowRadius: mode === 'light'
            ? inset ? 5 : raised ? 13 : 9
            : inset ? 3 : raised ? 8 : 6,
          elevation: inset ? 0 : mode === 'light' ? raised ? 7 : 4 : raised ? 4 : 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    borderWidth: 1,
    overflow: 'visible',
  },
});
