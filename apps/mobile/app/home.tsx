import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import {
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

const conversations: Conversation[] = [
  {
    initials: 'M',
    name: 'Mira',
    message: 'That stays between us.',
    time: '2m',
    unread: 2,
    color: '#3E4856',
  },
  {
    initials: 'K',
    name: 'Kai',
    message: 'The invite expires tonight.',
    time: '1h',
    unread: 0,
    color: '#46505D',
  },
  {
    initials: 'N',
    name: 'Nocturne',
    message: 'Message received.',
    time: 'Yesterday',
    unread: 0,
    color: '#50515B',
  },
];

export default function HomeScreen() {
  const { palette } = useTheme();
  const [query, setQuery] = useState('');

  const filteredConversations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return conversations;
    return conversations.filter(
      (item) =>
        item.name.toLowerCase().includes(normalized) ||
        item.message.toLowerCase().includes(normalized),
    );
  }, [query]);

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
          <Pressable onPress={() => setQuery('')} accessibilityLabel="Clear search">
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
          {String(filteredConversations.length).padStart(2, '0')}
        </Animated.Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <NeumorphicSurface inset style={styles.listSurface}>
          {filteredConversations.length > 0 ? (
            filteredConversations.map((item) => (
              <ConversationItem
                key={item.name}
                item={item}
                onPress={() =>
                  router.push({
                    pathname: '/conversation',
                    params: {
                      name: item.name,
                      initials: item.initials,
                      color: item.color,
                    },
                  })
                }
              />
            ))
          ) : (
            <View style={styles.emptyHint}>
              <Animated.Text style={[styles.emptyTitle, { color: palette.text }]}>
                No conversations found
              </Animated.Text>
              <Animated.Text style={[styles.emptyBody, { color: palette.muted }]}>
                Try another name or message.
              </Animated.Text>
            </View>
          )}
        </NeumorphicSurface>
        <View style={styles.quietHint}>
          <Animated.Text style={[styles.quietTitle, { color: palette.muted }]}>
            Quiet by default
          </Animated.Text>
          <Animated.Text style={[styles.quietBody, { color: palette.muted }]}>
            New conversations begin with an invitation link.
          </Animated.Text>
        </View>
      </ScrollView>

      <AppButton
        label="New conversation"
        rightLabel="＋"
        onPress={() => router.push('/new-conversation')}
      />

      <View style={styles.bottomNote}>
        <View style={[styles.lockDot, { backgroundColor: palette.warning }]} />
        <Animated.Text style={[styles.bottomText, { color: palette.muted }]}>
          Prototype · Messages are not encrypted yet
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
  emptyHint: { paddingVertical: 30, alignItems: 'center', gap: 7 },
  emptyTitle: { fontSize: 13, fontWeight: '600' },
  emptyBody: { fontSize: 11, textAlign: 'center', lineHeight: 16 },
  quietHint: { alignItems: 'center', paddingVertical: 18, gap: 5 },
  quietTitle: { fontSize: 11, fontWeight: '600' },
  quietBody: { fontSize: 10 },
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
