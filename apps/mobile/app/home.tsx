import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Animated,
  Modal,
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

type ManagementMode = 'menu' | 'rename' | 'delete';
type DeletedNotice = { id: string; name: string };

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
    renameConversation,
    deleteConversation,
    undoDelete,
  } = useLocalData();

  const [query, setQuery] = useState('');
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [managementMode, setManagementMode] =
    useState<ManagementMode>('menu');
  const [renameValue, setRenameValue] = useState('');
  const [deletedNotice, setDeletedNotice] = useState<DeletedNotice | null>(null);

  useEffect(() => {
    if (!deletedNotice) return;
    const timeout = setTimeout(() => setDeletedNotice(null), 6000);
    return () => clearTimeout(timeout);
  }, [deletedNotice]);

  const rows = useMemo<Conversation[]>(() => {
    return conversations.map((conversation): Conversation => {
      const latest = conversation.messages[conversation.messages.length - 1];

      return {
        id: conversation.id,
        initials: conversation.initials,
        name: conversation.name,
        message: latest?.text ?? 'No messages yet. Say hello.',
        time: relativeTime(conversation.updatedAt),
        unread: conversation.unread,
        color: conversation.color,
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

  const closeManagement = () => {
    setSelectedConversation(null);
    setManagementMode('menu');
  };

  const openManagement = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setRenameValue(conversation.name);
    setManagementMode('menu');
  };

  const saveRename = () => {
    if (!selectedConversation || !renameValue.trim()) return;
    renameConversation(selectedConversation.id, renameValue);
    closeManagement();
  };

  const confirmDelete = () => {
    if (!selectedConversation) return;
    deleteConversation(selectedConversation.id);
    setDeletedNotice({
      id: selectedConversation.id,
      name: selectedConversation.name,
    });
    closeManagement();
  };

  const restoreDeleted = () => {
    undoDelete();
    setDeletedNotice(null);
  };

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

      {deletedNotice ? (
        <NeumorphicSurface raised style={styles.undoBanner}>
          <View style={styles.undoCopy}>
            <Animated.Text style={[styles.undoTitle, { color: palette.text }]}>
              Conversation deleted
            </Animated.Text>
            <Animated.Text
              numberOfLines={1}
              style={[styles.undoSubtitle, { color: palette.muted }]}
            >
              {deletedNotice.name}
            </Animated.Text>
          </View>
          <Pressable
            onPress={restoreDeleted}
            accessibilityRole="button"
            accessibilityLabel="Undo conversation deletion"
            hitSlop={8}
          >
            <Animated.Text style={[styles.undoAction, { color: palette.accent }]}>
              UNDO
            </Animated.Text>
          </Pressable>
        </NeumorphicSurface>
      ) : null}

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
                onMore={() => openManagement(item)}
              />
            ))
          ) : (
            <View style={styles.emptyHint}>
              <NeumorphicSurface raised style={styles.emptyOrb}>
                <Animated.Text style={[styles.emptyOrbText, { color: palette.accent }]}>
                  {query ? '⌕' : '◈'}
                </Animated.Text>
              </NeumorphicSurface>
              <Animated.Text style={[styles.emptyTitle, { color: palette.text }]}>
                {query ? 'No conversations found' : 'Your chat list is empty'}
              </Animated.Text>
              <Animated.Text style={[styles.emptyBody, { color: palette.muted }]}>
                {query
                  ? 'Try another name or message.'
                  : 'Start a new local conversation. You can rename or delete it at any time.'}
              </Animated.Text>
              {query ? (
                <Pressable onPress={() => setQuery('')}>
                  <Animated.Text style={[styles.clearFilter, { color: palette.accent }]}>
                    Clear search
                  </Animated.Text>
                </Pressable>
              ) : null}
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

      <Modal
        visible={selectedConversation !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeManagement}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={styles.backdrop}
            onPress={closeManagement}
            accessibilityLabel="Close conversation actions"
          />
          <NeumorphicSurface raised style={styles.sheet}>
            <View style={[styles.handle, { backgroundColor: palette.muted }]} />
            {managementMode === 'menu' ? (
              <>
                <Animated.Text style={[styles.sheetTitle, { color: palette.text }]}>
                  {selectedConversation?.name}
                </Animated.Text>
                <Animated.Text style={[styles.sheetSubtitle, { color: palette.muted }]}>
                  Manage this conversation on this device.
                </Animated.Text>
                <Pressable
                  onPress={() => setManagementMode('rename')}
                  style={styles.sheetAction}
                >
                  <NeumorphicSurface inset style={styles.sheetIcon}>
                    <Animated.Text style={[styles.sheetIconText, { color: palette.text }]}>
                      ✎
                    </Animated.Text>
                  </NeumorphicSurface>
                  <Animated.Text style={[styles.sheetActionText, { color: palette.text }]}>
                    Rename conversation
                  </Animated.Text>
                  <Animated.Text style={[styles.chevron, { color: palette.muted }]}>
                    ›
                  </Animated.Text>
                </Pressable>
                <Pressable
                  onPress={() => setManagementMode('delete')}
                  style={styles.sheetAction}
                >
                  <NeumorphicSurface inset style={styles.sheetIcon}>
                    <Animated.Text style={[styles.sheetIconText, { color: palette.danger }]}>
                      ×
                    </Animated.Text>
                  </NeumorphicSurface>
                  <Animated.Text style={[styles.sheetActionText, { color: palette.danger }]}>
                    Delete conversation
                  </Animated.Text>
                  <Animated.Text style={[styles.chevron, { color: palette.muted }]}>
                    ›
                  </Animated.Text>
                </Pressable>
                <Pressable onPress={closeManagement} style={styles.cancelAction}>
                  <Animated.Text style={[styles.cancelText, { color: palette.muted }]}>
                    Cancel
                  </Animated.Text>
                </Pressable>
              </>
            ) : managementMode === 'rename' ? (
              <>
                <Animated.Text style={[styles.sheetTitle, { color: palette.text }]}>
                  Rename conversation
                </Animated.Text>
                <Animated.Text style={[styles.sheetSubtitle, { color: palette.muted }]}>
                  Choose a name that helps you recognize this chat.
                </Animated.Text>
                <NeumorphicSurface inset style={styles.renameInputShell}>
                  <TextInput
                    value={renameValue}
                    onChangeText={setRenameValue}
                    autoFocus
                    maxLength={40}
                    returnKeyType="done"
                    onSubmitEditing={saveRename}
                    placeholder="Conversation name"
                    placeholderTextColor={palette.muted}
                    style={[styles.renameInput, { color: palette.text }]}
                    accessibilityLabel="New conversation name"
                  />
                </NeumorphicSurface>
                <View style={styles.sheetButtons}>
                  <Pressable onPress={() => setManagementMode('menu')} style={styles.halfButton}>
                    <NeumorphicSurface inset style={styles.secondaryButton}>
                      <Animated.Text style={[styles.buttonText, { color: palette.text }]}>
                        Back
                      </Animated.Text>
                    </NeumorphicSurface>
                  </Pressable>
                  <Pressable
                    onPress={saveRename}
                    disabled={!renameValue.trim()}
                    style={styles.halfButton}
                  >
                    <NeumorphicSurface
                      raised
                      style={[
                        styles.primaryButton,
                        { backgroundColor: palette.accent, opacity: renameValue.trim() ? 1 : 0.5 },
                      ]}
                    >
                      <Animated.Text style={[styles.buttonText, { color: palette.accentText }]}>
                        Save name
                      </Animated.Text>
                    </NeumorphicSurface>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Animated.Text style={[styles.sheetTitle, { color: palette.text }]}>
                  Delete this conversation?
                </Animated.Text>
                <Animated.Text style={[styles.sheetSubtitle, { color: palette.muted }]}>
                  “{selectedConversation?.name}” and its local message history will be removed from this device. You can undo this briefly after deleting.
                </Animated.Text>
                <View style={styles.sheetButtons}>
                  <Pressable onPress={() => setManagementMode('menu')} style={styles.halfButton}>
                    <NeumorphicSurface inset style={styles.secondaryButton}>
                      <Animated.Text style={[styles.buttonText, { color: palette.text }]}>
                        Keep chat
                      </Animated.Text>
                    </NeumorphicSurface>
                  </Pressable>
                  <Pressable onPress={confirmDelete} style={styles.halfButton}>
                    <NeumorphicSurface
                      raised
                      style={[
                        styles.primaryButton,
                        { backgroundColor: palette.danger, borderColor: palette.danger },
                      ]}
                    >
                      <Animated.Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                        Delete
                      </Animated.Text>
                    </NeumorphicSurface>
                  </Pressable>
                </View>
              </>
            )}
          </NeumorphicSurface>
        </View>
      </Modal>
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
  undoBanner: {
    marginTop: 14,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  undoCopy: { flex: 1, gap: 3 },
  undoTitle: { fontSize: 12, fontWeight: '700' },
  undoSubtitle: { fontSize: 10 },
  undoAction: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
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
  emptyHint: { paddingVertical: 30, paddingHorizontal: 12, alignItems: 'center', gap: 9 },
  emptyOrb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  emptyOrbText: { fontSize: 22 },
  emptyTitle: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  emptyBody: { fontSize: 11, textAlign: 'center', lineHeight: 17, maxWidth: 270 },
  clearFilter: { fontSize: 11, fontWeight: '700', padding: 6 },
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
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 18,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.62)',
  },
  sheet: {
    borderRadius: 28,
    padding: 20,
    paddingTop: 12,
    gap: 12,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    opacity: 0.35,
    marginBottom: 7,
  },
  sheetTitle: { fontSize: 18, fontWeight: '700' },
  sheetSubtitle: { fontSize: 12, lineHeight: 18, marginBottom: 4 },
  sheetAction: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  sheetIcon: {
    width: 36,
    height: 36,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetIconText: { fontSize: 18, fontWeight: '600' },
  sheetActionText: { flex: 1, fontSize: 13, fontWeight: '600' },
  chevron: { fontSize: 22 },
  cancelAction: { alignItems: 'center', paddingTop: 8, paddingBottom: 2 },
  cancelText: { fontSize: 12, fontWeight: '600' },
  renameInputShell: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  renameInput: { minHeight: 48, fontSize: 14 },
  sheetButtons: { flexDirection: 'row', gap: 10, marginTop: 6 },
  halfButton: { flex: 1 },
  secondaryButton: {
    minHeight: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontSize: 12, fontWeight: '700' },
});
