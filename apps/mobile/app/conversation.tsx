import { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NeumorphicSurface } from '../src/components/ui/NeumorphicSurface';
import { ConversationHeader } from '../src/components/messaging/ConversationHeader';
import { MessageBubble } from '../src/components/messaging/MessageBubble';
import { MessageComposer } from '../src/components/messaging/MessageComposer';
import { AppButton } from '../src/components/ui/AppButton';
import { useTheme } from '../src/theme/ThemeProvider';
import {
  LocalChatMessage,
  useLocalData,
} from '../src/state/LocalDataProvider';

type ActionPanel = 'menu' | 'block' | 'report';

const reportReasons = [
  'Spam or unwanted messages',
  'Harassment or bullying',
  'Threats or violence',
  'Impersonation',
  'Inappropriate content',
  'Something else',
];

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const conversationId = Array.isArray(id) ? id[0] : id;
  const {
    conversations,
    isReady,
    appendMessage,
    markRead,
    setConversationMuted,
    setConversationBlocked,
    submitLocalReport,
  } = useLocalData();
  const { palette } = useTheme();
  const [draft, setDraft] = useState('');
  const [actionsVisible, setActionsVisible] = useState(false);
  const [actionPanel, setActionPanel] = useState<ActionPanel>('menu');
  const [reportReason, setReportReason] = useState(reportReasons[0]);
  const listRef = useRef<FlatList<LocalChatMessage>>(null);

  const conversation = conversations.find(
    (item) => item.id === conversationId,
  );
  const messages = conversation?.messages ?? [];

  useEffect(() => {
    if (isReady && conversationId) {
      markRead(conversationId);
    }
  }, [conversationId, isReady, markRead]);

  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [messages.length]);

  const closeActions = () => {
    setActionsVisible(false);
    setActionPanel('menu');
  };

  const openActions = () => {
    setActionPanel('menu');
    setActionsVisible(true);
  };

  const send = () => {
    if (!conversationId || !draft.trim() || conversation?.isBlocked) return;
    appendMessage(conversationId, draft);
    setDraft('');
  };

  const toggleMute = () => {
    if (!conversationId || !conversation) return;
    setConversationMuted(conversationId, !conversation.isMuted);
  };

  const confirmBlock = () => {
    if (!conversationId) return;
    setConversationBlocked(conversationId, true);
    setDraft('');
    closeActions();
  };

  const unblock = () => {
    if (!conversationId) return;
    setConversationBlocked(conversationId, false);
    closeActions();
  };

  const submitReport = () => {
    if (!conversationId || conversation?.reportedAt) return;
    submitLocalReport(conversationId, reportReason);
    closeActions();
  };

  if (!isReady) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
        <View style={styles.state}>
          <ActivityIndicator color={palette.accent} />
          <Animated.Text style={[styles.stateText, { color: palette.muted }]}>
            Opening local chat…
          </Animated.Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!conversation) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
        <View style={styles.state}>
          <Animated.Text style={[styles.missingTitle, { color: palette.text }]}>
            Conversation not found
          </Animated.Text>
          <Animated.Text style={[styles.stateText, { color: palette.muted }]}>
            This chat may have been removed from local storage.
          </Animated.Text>
          <AppButton
            label="Back to chats"
            onPress={() => router.replace('/home')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: palette.background }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.layout}>
          <View style={styles.top}>
            <ConversationHeader
              name={conversation.name}
              initials={conversation.initials}
              color={conversation.color}
              onAvatarPress={openActions}
              statusLabel={
                conversation.isBlocked
                  ? 'Blocked on this device'
                  : conversation.isMuted
                    ? 'Muted on this device'
                    : 'Anonymous connection'
              }
            />
          </View>

          <View style={styles.disclaimer}>
            <NeumorphicSurface inset style={styles.notice}>
              <Animated.Text style={[styles.noticeText, { color: palette.muted }]}>
                Local prototype · Stored on this device only. Messages are not encrypted or sent over a network.
              </Animated.Text>
            </NeumorphicSurface>
          </View>

          {conversation.isBlocked ? (
            <View style={styles.blockedState}>
              <NeumorphicSurface raised style={styles.blockedIcon}>
                <Animated.Text style={[styles.blockedGlyph, { color: palette.danger }]}>
                  ⊘
                </Animated.Text>
              </NeumorphicSurface>
              <Animated.Text style={[styles.blockedTitle, { color: palette.text }]}>
                This identity is blocked
              </Animated.Text>
              <Animated.Text style={[styles.blockedBody, { color: palette.muted }]}>
                Sending is disabled for this local conversation. Open the avatar menu to unblock.
              </Animated.Text>
              <Pressable onPress={openActions} hitSlop={8}>
                <Animated.Text style={[styles.unblockLink, { color: palette.accent }]}>
                  Conversation options
                </Animated.Text>
              </Pressable>
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.empty}>
              <Animated.Text style={[styles.emptyTitle, { color: palette.text }]}>
                Start the conversation
              </Animated.Text>
              <Animated.Text style={[styles.emptyBody, { color: palette.muted }]}>
                Messages you write here are saved locally on this device.
              </Animated.Text>
            </View>
          ) : (
            <FlatList
              ref={listRef}
              style={styles.messageList}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <MessageBubble message={item} />}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
            />
          )}

          {!conversation.isBlocked ? (
            <View style={styles.composer}>
              <MessageComposer
                value={draft}
                onChangeText={setDraft}
                onSend={send}
              />
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={actionsVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={closeActions}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={styles.backdrop}
            onPress={closeActions}
            accessibilityLabel="Close conversation options"
          />
          <NeumorphicSurface raised style={styles.sheet}>
            <View style={[styles.handle, { backgroundColor: palette.muted }]} />

            {actionPanel === 'menu' ? (
              <>
                <View style={styles.sheetHeading}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Animated.Text style={[styles.sheetTitle, { color: palette.text }]}>
                      {conversation.name}
                    </Animated.Text>
                    <Animated.Text style={[styles.sheetSubtitle, { color: palette.muted }]}>
                      Conversation options
                    </Animated.Text>
                  </View>
                  <NeumorphicSurface raised style={styles.sheetAvatar}>
                    <Animated.Text style={[styles.sheetAvatarText, { color: palette.text }]}>
                      {conversation.initials}
                    </Animated.Text>
                  </NeumorphicSurface>
                </View>

                <Pressable onPress={toggleMute} style={styles.actionRow}>
                  <NeumorphicSurface inset style={styles.actionIcon}>
                    <Animated.Text style={[styles.actionGlyph, { color: palette.text }]}>
                      {conversation.isMuted ? '◖' : '◗'}
                    </Animated.Text>
                  </NeumorphicSurface>
                  <View style={styles.actionCopy}>
                    <Animated.Text style={[styles.actionTitle, { color: palette.text }]}>
                      {conversation.isMuted ? 'Unmute conversation' : 'Mute conversation'}
                    </Animated.Text>
                    <Animated.Text style={[styles.actionDetail, { color: palette.muted }]}>
                      {conversation.isMuted
                        ? 'Remove the local muted marker'
                        : 'Mark this chat as muted on this device'}
                    </Animated.Text>
                  </View>
                  <Animated.Text style={[styles.actionChevron, { color: palette.muted }]}>
                    {conversation.isMuted ? 'ON' : 'OFF'}
                  </Animated.Text>
                </Pressable>

                <Pressable
                  onPress={() => conversation.isBlocked ? unblock() : setActionPanel('block')}
                  style={styles.actionRow}
                >
                  <NeumorphicSurface inset style={styles.actionIcon}>
                    <Animated.Text style={[styles.actionGlyph, { color: palette.danger }]}>
                      ⊘
                    </Animated.Text>
                  </NeumorphicSurface>
                  <View style={styles.actionCopy}>
                    <Animated.Text style={[styles.actionTitle, { color: palette.danger }]}>
                      {conversation.isBlocked ? 'Unblock identity' : 'Block identity'}
                    </Animated.Text>
                    <Animated.Text style={[styles.actionDetail, { color: palette.muted }]}>
                      {conversation.isBlocked
                        ? 'Allow composing in this local chat again'
                        : 'Disable composing in this local chat'}
                    </Animated.Text>
                  </View>
                  <Animated.Text style={[styles.actionChevron, { color: palette.muted }]}>
                    ›
                  </Animated.Text>
                </Pressable>

                <Pressable
                  onPress={() => setActionPanel('report')}
                  disabled={Boolean(conversation.reportedAt)}
                  style={[styles.actionRow, conversation.reportedAt && styles.disabledRow]}
                >
                  <NeumorphicSurface inset style={styles.actionIcon}>
                    <Animated.Text style={[styles.actionGlyph, { color: palette.warning }]}>
                      !
                    </Animated.Text>
                  </NeumorphicSurface>
                  <View style={styles.actionCopy}>
                    <Animated.Text style={[styles.actionTitle, { color: palette.text }]}>
                      {conversation.reportedAt ? 'Report recorded locally' : 'Report identity'}
                    </Animated.Text>
                    <Animated.Text style={[styles.actionDetail, { color: palette.muted }]}>
                      {conversation.reportedAt
                        ? `Reason: ${conversation.reportReason}`
                        : 'Choose a reason for this prototype report'}
                    </Animated.Text>
                  </View>
                  <Animated.Text style={[styles.actionChevron, { color: palette.muted }]}>
                    ›
                  </Animated.Text>
                </Pressable>

                <NeumorphicSurface inset style={styles.localNote}>
                  <Animated.Text style={[styles.localNoteText, { color: palette.muted }]}>
                    These are local prototype controls. Mute has no notification effect, block affects only this device, and reports are not sent to a moderation team.
                  </Animated.Text>
                </NeumorphicSurface>

                <Pressable onPress={closeActions} style={styles.cancelAction}>
                  <Animated.Text style={[styles.cancelText, { color: palette.muted }]}>
                    Close
                  </Animated.Text>
                </Pressable>
              </>
            ) : actionPanel === 'block' ? (
              <>
                <Animated.Text style={[styles.sheetTitle, { color: palette.text }]}>
                  Block {conversation.name}?
                </Animated.Text>
                <Animated.Text style={[styles.sheetSubtitle, { color: palette.muted }]}>
                  This disables message composing in this local chat. There is no network connection, so this does not block incoming messages from a server.
                </Animated.Text>
                <View style={styles.sheetButtons}>
                  <Pressable onPress={() => setActionPanel('menu')} style={styles.halfButton}>
                    <NeumorphicSurface inset style={styles.secondaryButton}>
                      <Animated.Text style={[styles.buttonText, { color: palette.text }]}>
                        Cancel
                      </Animated.Text>
                    </NeumorphicSurface>
                  </Pressable>
                  <Pressable onPress={confirmBlock} style={styles.halfButton}>
                    <NeumorphicSurface
                      raised
                      style={[styles.primaryButton, { backgroundColor: palette.danger, borderColor: palette.danger }]}
                    >
                      <Animated.Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                        Block identity
                      </Animated.Text>
                    </NeumorphicSurface>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Animated.Text style={[styles.sheetTitle, { color: palette.text }]}>
                  Report {conversation.name}
                </Animated.Text>
                <Animated.Text style={[styles.sheetSubtitle, { color: palette.muted }]}>
                  Select the closest reason. This report will only be recorded locally and will not be sent.
                </Animated.Text>
                <View style={styles.reasonList}>
                  {reportReasons.map((reason) => {
                    const selected = reportReason === reason;
                    return (
                      <Pressable
                        key={reason}
                        onPress={() => setReportReason(reason)}
                        style={[
                          styles.reasonRow,
                          {
                            backgroundColor: selected ? palette.surfaceAlt : 'transparent',
                            borderColor: selected ? palette.accent : palette.border,
                          },
                        ]}
                      >
                        <Animated.Text style={[styles.reasonText, { color: palette.text }]}>
                          {reason}
                        </Animated.Text>
                        <Animated.Text style={[styles.reasonCheck, { color: palette.accent }]}>
                          {selected ? '✓' : ''}
                        </Animated.Text>
                      </Pressable>
                    );
                  })}
                </View>
                <View style={styles.sheetButtons}>
                  <Pressable onPress={() => setActionPanel('menu')} style={styles.halfButton}>
                    <NeumorphicSurface inset style={styles.secondaryButton}>
                      <Animated.Text style={[styles.buttonText, { color: palette.text }]}>
                        Back
                      </Animated.Text>
                    </NeumorphicSurface>
                  </Pressable>
                  <Pressable onPress={submitReport} style={styles.halfButton}>
                    <NeumorphicSurface
                      raised
                      style={[styles.primaryButton, { backgroundColor: palette.accent }]}
                    >
                      <Animated.Text style={[styles.buttonText, { color: palette.accentText }]}>
                        Record report
                      </Animated.Text>
                    </NeumorphicSurface>
                  </Pressable>
                </View>
              </>
            )}
          </NeumorphicSurface>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  keyboard: { flex: 1 },
  layout: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 4,
  },
  top: { flexShrink: 0 },
  disclaimer: { flexShrink: 0, paddingBottom: 8 },
  notice: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: 15 },
  noticeText: { fontSize: 10, textAlign: 'center', lineHeight: 15 },
  messageList: { flex: 1 },
  list: { paddingVertical: 12, flexGrow: 1 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 30,
  },
  emptyTitle: { fontSize: 16, fontWeight: '600' },
  emptyBody: { fontSize: 12, lineHeight: 18, textAlign: 'center' },
  composer: { flexShrink: 0, paddingTop: 4 },
  blockedState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 10,
  },
  blockedIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  blockedGlyph: { fontSize: 27 },
  blockedTitle: { fontSize: 16, fontWeight: '700' },
  blockedBody: { fontSize: 12, lineHeight: 18, textAlign: 'center' },
  unblockLink: { fontSize: 12, fontWeight: '700', padding: 8 },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 24,
  },
  stateText: { fontSize: 12, textAlign: 'center' },
  missingTitle: { fontSize: 18, fontWeight: '600' },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 18,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.58)',
  },
  sheet: {
    borderRadius: 26,
    paddingHorizontal: 19,
    paddingTop: 12,
    paddingBottom: 18,
    gap: 11,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    opacity: 0.35,
    marginBottom: 6,
  },
  sheetHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 4,
  },
  sheetAvatar: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetAvatarText: { fontSize: 14, fontWeight: '700' },
  sheetTitle: { fontSize: 18, fontWeight: '700' },
  sheetSubtitle: { fontSize: 11, lineHeight: 17 },
  actionRow: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 5,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionGlyph: { fontSize: 17, fontWeight: '700' },
  actionCopy: { flex: 1, gap: 3 },
  actionTitle: { fontSize: 12, fontWeight: '700' },
  actionDetail: { fontSize: 10, lineHeight: 14 },
  actionChevron: { fontSize: 11, fontWeight: '700' },
  disabledRow: { opacity: 0.55 },
  localNote: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 3,
  },
  localNoteText: { fontSize: 9, lineHeight: 14 },
  cancelAction: { alignItems: 'center', paddingTop: 7 },
  cancelText: { fontSize: 12, fontWeight: '600' },
  sheetButtons: { flexDirection: 'row', gap: 10, marginTop: 7 },
  halfButton: { flex: 1 },
  secondaryButton: {
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontSize: 11, fontWeight: '700' },
  reasonList: { gap: 6, marginTop: 3 },
  reasonRow: {
    minHeight: 40,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reasonText: { flex: 1, fontSize: 11 },
  reasonCheck: { fontSize: 14, fontWeight: '800' },
});
