import { router } from 'expo-router';
import {
  Alert,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Screen } from '../src/components/ui/Screen';
import { SectionLabel } from '../src/components/ui/SectionLabel';
import { SettingsRow } from '../src/components/settings/SettingsRow';
import { ThemeToggle } from '../src/components/ui/ThemeToggle';
import { NeumorphicSurface } from '../src/components/ui/NeumorphicSurface';
import { useTheme } from '../src/theme/ThemeProvider';
import { useLocalData } from '../src/state/LocalDataProvider';

const rows = [
  { title: 'Anonymous identity', detail: 'Quiet Orbit' },
  { title: 'Privacy', detail: 'Controls and visibility' },
  { title: 'Blocked identities', detail: 'Manage blocked users' },
  { title: 'About LATEO', detail: 'Open-source prototype' },
];

export default function SettingsScreen() {
  const { palette: theme, mode } = useTheme();
  const { conversations, clearAllConversations } = useLocalData();

  const confirmClearAll = () => {
    if (conversations.length === 0) return;

    Alert.alert(
      'Clear all local conversations?',
      `This permanently removes ${conversations.length} ${conversations.length === 1 ? 'conversation' : 'conversations'} and all message history from this device. This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear all',
          style: 'destructive',
          onPress: clearAllConversations,
        },
      ],
    );
  };

  return (
    <Screen padded={false} contentStyle={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          style={styles.back}
        >
          <Animated.Text style={[styles.backText, { color: theme.muted }]}>
            ‹  Back
          </Animated.Text>
        </Pressable>

        <SectionLabel>YOUR CONTROL</SectionLabel>
        <Animated.Text style={[styles.title, { color: theme.text }]}>
          Settings
        </Animated.Text>

        <NeumorphicSurface style={styles.themeCard} raised>
          <View style={styles.themeCopy}>
            <Animated.Text style={[styles.themeTitle, { color: theme.text }]}>
              Appearance
            </Animated.Text>
            <Animated.Text style={[styles.themeDetail, { color: theme.muted }]}>
              {mode === 'dark' ? 'Dark mode' : 'Light mode'}
            </Animated.Text>
          </View>
          <ThemeToggle />
        </NeumorphicSurface>

        <SectionLabel>ACCOUNT & PRIVACY</SectionLabel>
        <NeumorphicSurface style={styles.card}>
          {rows.map((row, index) => (
            <View
              key={row.title}
              style={[
                styles.rowWrap,
                index !== rows.length - 1 && {
                  borderBottomColor: theme.border,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
              ]}
            >
              <SettingsRow title={row.title} detail={row.detail} />
            </View>
          ))}
        </NeumorphicSurface>

        <View style={styles.dangerHeading}>
          <SectionLabel>LOCAL DATA</SectionLabel>
          <Animated.Text style={[styles.count, { color: theme.muted }]}>
            {conversations.length} {conversations.length === 1 ? 'chat' : 'chats'}
          </Animated.Text>
        </View>

        <NeumorphicSurface inset style={styles.dangerCard}>
          <Animated.Text style={[styles.dangerTitle, { color: theme.text }]}>
            Clear all conversations
          </Animated.Text>
          <Animated.Text style={[styles.dangerBody, { color: theme.muted }]}>
            Remove every local conversation and its message history from this device.
          </Animated.Text>
          <Pressable
            onPress={confirmClearAll}
            disabled={conversations.length === 0}
            accessibilityRole="button"
            accessibilityState={{ disabled: conversations.length === 0 }}
            style={styles.clearButtonHit}
          >
            <NeumorphicSurface
              raised
              style={[
                styles.clearButton,
                {
                  backgroundColor: theme.danger,
                  borderTopColor: theme.danger,
                  borderLeftColor: theme.danger,
                  borderRightColor: theme.danger,
                  borderBottomColor: theme.danger,
                  opacity: conversations.length === 0 ? 0.42 : 1,
                },
              ]}
            >
              <Animated.Text style={styles.clearButtonText}>
                Clear all local data
              </Animated.Text>
            </NeumorphicSurface>
          </Pressable>
          {conversations.length === 0 ? (
            <Animated.Text style={[styles.noDataText, { color: theme.muted }]}>
              There are no local conversations to clear.
            </Animated.Text>
          ) : null}
        </NeumorphicSurface>

        <NeumorphicSurface inset style={styles.notice}>
          <Animated.Text style={[styles.noticeTitle, { color: theme.warning }]}>
            Security status
          </Animated.Text>
          <Animated.Text style={[styles.noticeBody, { color: theme.muted }]}>
            This is a local prototype. Conversation data is stored unencrypted on this device. Identity, encryption, and network privacy controls are not active.
          </Animated.Text>
        </NeumorphicSurface>

        <Animated.Text style={[styles.version, { color: theme.muted }]}>
          LATEO · 0.1.0
        </Animated.Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  back: { alignSelf: 'flex-start', paddingVertical: 10, marginBottom: 24 },
  backText: { fontSize: 14 },
  title: {
    fontSize: 30,
    letterSpacing: -1,
    fontWeight: '500',
    marginTop: 7,
    marginBottom: 20,
  },
  themeCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeCopy: { gap: 5 },
  themeTitle: { fontSize: 14, fontWeight: '600' },
  themeDetail: { fontSize: 11 },
  card: { borderRadius: 20, overflow: 'hidden', marginTop: 12 },
  rowWrap: {},
  dangerHeading: {
    marginTop: 30,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: { fontSize: 10 },
  dangerCard: {
    borderRadius: 18,
    padding: 16,
    gap: 9,
  },
  dangerTitle: { fontSize: 14, fontWeight: '700' },
  dangerBody: { fontSize: 11, lineHeight: 17 },
  clearButtonHit: { marginTop: 5 },
  clearButton: {
    minHeight: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  noDataText: { fontSize: 10, lineHeight: 15, textAlign: 'center' },
  notice: {
    marginTop: 22,
    borderRadius: 16,
    padding: 16,
    gap: 7,
  },
  noticeTitle: { fontSize: 12, fontWeight: '600' },
  noticeBody: { fontSize: 11, lineHeight: 17 },
  version: { fontSize: 10, textAlign: 'center', marginTop: 28 },
});
