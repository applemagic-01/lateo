import { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
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

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const conversationId = Array.isArray(id) ? id[0] : id;
  const {
    conversations,
    isReady,
    appendMessage,
    markRead,
  } = useLocalData();
  const { palette } = useTheme();
  const [draft, setDraft] = useState('');
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

  const send = () => {
    if (!conversationId || !draft.trim()) return;
    appendMessage(conversationId, draft);
    setDraft('');
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
            />
          </View>

          <View style={styles.disclaimer}>
            <NeumorphicSurface inset style={styles.notice}>
              <Animated.Text style={[styles.noticeText, { color: palette.muted }]}>
                Local prototype · Stored on this device only. Messages are not encrypted or sent over a network.
              </Animated.Text>
            </NeumorphicSurface>
          </View>

          {messages.length === 0 ? (
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

          <View style={styles.composer}>
            <MessageComposer
              value={draft}
              onChangeText={setDraft}
              onSend={send}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  layout: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 4,
  },
  top: {
    flexShrink: 0,
  },
  disclaimer: {
    flexShrink: 0,
    paddingBottom: 8,
  },
  notice: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  noticeText: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 15,
  },
  messageList: {
    flex: 1,
  },
  list: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyBody: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  composer: {
    flexShrink: 0,
    paddingTop: 4,
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 24,
  },
  stateText: {
    fontSize: 12,
    textAlign: 'center',
  },
  missingTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});
