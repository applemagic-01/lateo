import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Screen } from '../src/components/ui/Screen';
import { SectionLabel } from '../src/components/ui/SectionLabel';
import { IdentityCard } from '../src/components/conversations/IdentityCard';
import {
  ConversationItem,
  Conversation,
} from '../src/components/conversations/ConversationItem';
import { AppButton } from '../src/components/ui/AppButton';
import { ThemeToggle } from '../src/components/ui/ThemeToggle';
import { NeumorphicSurface } from '../src/components/ui/NeumorphicSurface';
import { useTheme } from '../src/theme/ThemeProvider';
import { useLocalData } from '../src/state/LocalDataProvider';

function relativeTime(timestamp: number): string {
  const elapsed = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(elapsed / 60_000);
  const hours = Math.floor(elapsed / 3_600_000);
  const days = Math.floor(elapsed / 86_400_000);

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days === 1) return 'Yesterday';
  return new Date(timestamp).toLocaleDateString([], {
    day: 'numeric',
    month: 'short',
  });
}

export default function HomeScreen() {
  const { palette } = useTheme();
  const {
    conversations,
    isReady,
    persistenceWarning,
  } = useLocalData();
  const [query, setQuery] = useState('');

  const rows = useMemo<Conversation[]>(() => {
    return conversations.map((conversation): Conversation => {
      const latest = conversation.messages[conversation.messages.length - 1];

      return {
        initials: conversation.initials,
        name: conversation.name,
        message: latest?.text ?? 'No messages yet. Say hello.',
        time: relativeTime(conversation.updatedAt),
        unread: conversation.unread,
        color: conversation.color,
        id: conversation.id,
      };
    });
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter(
      (item) =>
        item.name.toLowerCase().includes(normalized) ||
        item.message.toLowerCase().includes(normalized),
    );
  }, [query, rows]);

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.heading}>
          <SectionLabel>YOUR SPACE</SectionLabel>
          <Animated.Text style={[styles.title, { color: palette.text }]}>
            Chats
          </Animated.Text>
        </View>
        <View style={styles.actions}>
          <ThemeToggle />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open settings"
            onPress={() => router.push('/settings')}
          >
            <NeumorphicSurface inset style={styles.settings}>
              <Animated.Text style={[styles.settingsText, { color: palette.muted }]}>
                ⚙
              </Animated.Text>
            </NeumorphicSurface>
          </Pressable>
        </View>
      </View>

      <IdentityCard identityName="Quiet Orbit" />

      <NeumorphicSurface inset style={styles.search}>
        <Animated.Text style={[styles.searchIcon, { color: palette.muted }]}>
          ⌕
        </Animated.Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search conversations"
          placeholderTextColor={palette.muted}
          returnKeyType="search"
          style={[styles.searchInput, { color: palette.text }]}
          accessibilityLabel="Search conversations"
        />
        {query.length > 0 ? (
          <Pressable
            onPress={() => setQuery('')}
            accessibilityLabel="Clear search"
          >
            <Animated.Text style={[styles.clearSearch, { color: palette.muted }]}>
              ×
            </Animated.Text>
          </Pressable>
        ) : null}
      </NeumorphicSurface>

      <View style={styles.section}>
        <Animated.Text style={[styles.sectionTitle, { color: palette.text }]}>
          Recent
        </Animated.Text>
        <Animated.Text style={[styles.count, { color: palette.muted }]}>
          {isReady ? String(filteredConversations.length).padStart(2, '0') : '··'}
        </Animated.Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <NeumorphicSurface inset style={styles.listSurface}>
          {!isReady ? (
            <View style={styles.loading}>
              <ActivityIndicator color={palette.accent} />
              <Animated.Text style={[styles.emptyBody, { color: palette.muted }]}>
                Restoring local chats…
              </Animated.Text>
            </View>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((item) => (
              <ConversationItem
                key={item.id}
                item={item}
                onPress={() =>
                  router.push({
                    pathname: '/conversation',
                    params: { id: item.id },
                  })
                }
              />
            ))
          ) : (
            <View style={styles.emptyHint}>
              <Animated.Text style={[styles.emptyTitle, { color: palette.text }]}>
                {query ? 'No conversations found' : 'No chats yet'}
              </Animated.Text>
              <Animated.Text style={[styles.emptyBody, { color: palette.muted }]}>
                {query
                  ? 'Try another name or message.'
                  : 'Create a local chat to start writing messages on this device.'}
              </Animated.Text>
            </View>
          )}
        </NeumorphicSurface>
        <View style={styles.quietHint}>
          <Animated.Text style={[styles.quietTitle, { color: palette.muted }]}>
            Quiet by default
          </Animated.Text>
          <Animated.Text style={[styles.quietBody, { color: palette.muted }]}>
            {persistenceWarning
              ? 'Local storage could not be read. Changes may not survive a restart.'
              : 'Your prototype chats stay on this device. They are not sent to anyone.'}
          </Animated.Text>
        </View>
      </ScrollView>

      <AppButton
        label="New conversation"
        rightLabel="＋"
        onPress={() => router.push('/new-conversation')}
      />

      <View style={styles.bottomNote}>
        <View
          style={[
            styles.lockDot,
            { backgroundColor: persistenceWarning ? palette.warning : palette.success },
          ]}
        />
        <Animated.Text style={[styles.bottomText, { color: palette.muted }]}>
          Local prototype · Not encrypted or synced
        </Animated.Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  heading: { gap: 7 },
  title: { fontSize: 31, letterSpacing: -1, fontWeight: '600' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settings: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsText: { fontSize: 17 },
  search: {
    minHeight: 48,
    borderRadius: 24,
    marginTop: 19,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchIcon: { fontSize: 21, lineHeight: 25 },
  searchInput: { flex: 1, minHeight: 44, fontSize: 12 },
  clearSearch: { fontSize: 22, paddingHorizontal: 2 },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 25,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  count: { fontSize: 10, letterSpacing: 1 },
  list: { flexGrow: 1, paddingBottom: 12 },
  listSurface: {
    borderRadius: 23,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  loading: { minHeight: 150, alignItems: 'center', justifyContent: 'center', gap: 10 },
  emptyHint: { paddingVertical: 30, alignItems: 'center', gap: 7 },
  emptyTitle: { fontSize: 13, fontWeight: '600' },
  emptyBody: { fontSize: 11, textAlign: 'center', lineHeight: 16, maxWidth: 260 },
  quietHint: { alignItems: 'center', paddingVertical: 18, gap: 5 },
  quietTitle: { fontSize: 11, fontWeight: '600' },
  quietBody: { fontSize: 10, textAlign: 'center', lineHeight: 15, maxWidth: 280 },
  bottomNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingTop: 13,
  },
  lockDot: { width: 5, height: 5, borderRadius: 3 },
  bottomText: { fontSize: 9 },
});
