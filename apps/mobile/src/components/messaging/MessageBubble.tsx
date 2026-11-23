import { Animated, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { NeumorphicSurface } from '../ui/NeumorphicSurface';

export type ChatMessage = {
  id: string;
  text: string;
  time: string;
  mine: boolean;
  status?: 'sent' | 'delivered';
};

export function MessageBubble({ message }: { message: ChatMessage }) {
  const { palette } = useTheme();

  return (
    <View style={[styles.row, message.mine && styles.mineRow]}>
      <NeumorphicSurface
        inset={!message.mine}
        raised={message.mine}
        style={[
          styles.bubble,
          message.mine && {
            backgroundColor: palette.accent,
            borderTopColor: '#FA858A',
            borderLeftColor: '#FA858A',
            borderRightColor: '#B83D46',
            borderBottomColor: '#B83D46',
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.text,
            { color: message.mine ? palette.accentText : palette.text },
          ]}
        >
          {message.text}
        </Animated.Text>
        <View style={styles.meta}>
          <Animated.Text
            style={[
              styles.time,
              { color: message.mine ? '#FFE5E6' : palette.muted },
            ]}
          >
            {message.time}
          </Animated.Text>
          {message.mine ? (
            <Animated.Text style={[styles.status, { color: '#FFFFFF' }]}>
              {message.status === 'delivered' ? '✓✓' : '✓'}
            </Animated.Text>
          ) : null}
        </View>
      </NeumorphicSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 7,
    paddingHorizontal: 2,
  },
  mineRow: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 19,
  },
  text: { fontSize: 14, lineHeight: 20 },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
    marginTop: 5,
  },
  time: { fontSize: 9 },
  status: { fontSize: 10, fontWeight: '700' },
});
