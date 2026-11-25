import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const STORAGE_KEY = '@lateo/local-prototype-v1';

export type LocalChatMessage = {
  id: string;
  text: string;
  time: string;
  mine: boolean;
  status?: 'sent' | 'delivered';
};

export type LocalConversation = {
  id: string;
  name: string;
  initials: string;
  color: string;
  unread: number;
  updatedAt: number;
  messages: LocalChatMessage[];
};

type LocalDataContextValue = {
  conversations: LocalConversation[];
  isReady: boolean;
  persistenceWarning: boolean;
  createConversation: (name: string) => string;
  appendMessage: (conversationId: string, text: string) => void;
  markRead: (conversationId: string) => void;
};

const LocalDataContext = createContext<LocalDataContextValue | null>(null);

function makeSeedConversations(): LocalConversation[] {
  const now = Date.now();

  return [
    {
      id: 'demo-mira',
      name: 'Mira',
      initials: 'M',
      color: '#424653',
      unread: 2,
      updatedAt: now - 2 * 60_000,
      messages: [
        { id: 'mira-1', text: 'Hey, good to hear from you.', time: '9:41', mine: false },
        { id: 'mira-2', text: 'I was hoping we could talk.', time: '9:42', mine: true, status: 'delivered' },
        { id: 'mira-3', text: 'Of course. What’s on your mind?', time: '9:42', mine: false },
        { id: 'mira-4', text: 'Just wanted to check in. No pressure.', time: '9:43', mine: true, status: 'sent' },
      ],
    },
    {
      id: 'demo-kai',
      name: 'Kai',
      initials: 'K',
      color: '#4A4E59',
      unread: 0,
      updatedAt: now - 60 * 60_000,
      messages: [
        { id: 'kai-1', text: 'The invite expires tonight.', time: '8:54', mine: false },
        { id: 'kai-2', text: 'Got it. I’ll be there.', time: '8:56', mine: true, status: 'delivered' },
      ],
    },
    {
      id: 'demo-nocturne',
      name: 'Nocturne',
      initials: 'N',
      color: '#50515A',
      unread: 0,
      updatedAt: now - 24 * 60 * 60_000,
      messages: [
        { id: 'nocturne-1', text: 'Message received.', time: 'Yesterday', mine: false },
      ],
    },
  ];
}

function isLocalMessage(value: unknown): value is LocalChatMessage {
  if (!value || typeof value !== 'object') return false;
  const message = value as Record<string, unknown>;
  return (
    typeof message.id === 'string' &&
    typeof message.text === 'string' &&
    typeof message.time === 'string' &&
    typeof message.mine === 'boolean'
  );
}

function isLocalConversationArray(value: unknown): value is LocalConversation[] {
  return (
    Array.isArray(value) &&
    value.every((entry) => {
      if (!entry || typeof entry !== 'object') return false;
      const conversation = entry as Record<string, unknown>;
      return (
        typeof conversation.id === 'string' &&
        typeof conversation.name === 'string' &&
        typeof conversation.initials === 'string' &&
        typeof conversation.color === 'string' &&
        typeof conversation.unread === 'number' &&
        typeof conversation.updatedAt === 'number' &&
        Array.isArray(conversation.messages) &&
        conversation.messages.every(isLocalMessage)
      );
    })
  );
}

function clockTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function LocalDataProvider({ children }: PropsWithChildren) {
  const [conversations, setConversations] = useState<LocalConversation[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [persistenceWarning, setPersistenceWarning] = useState(false);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!active) return;

        if (stored) {
          const parsed: unknown = JSON.parse(stored);
          setConversations(
            isLocalConversationArray(parsed) ? parsed : makeSeedConversations(),
          );
        } else {
          setConversations(makeSeedConversations());
        }
      } catch {
        if (!active) return;
        setConversations(makeSeedConversations());
        setPersistenceWarning(true);
      } finally {
        if (active) setIsReady(true);
      }
    };

    void hydrate();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const snapshot = JSON.stringify(conversations);
    writeQueue.current = writeQueue.current
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(STORAGE_KEY, snapshot))
      .catch(() => setPersistenceWarning(true));
  }, [conversations, isReady]);

  const createConversation = useCallback((rawName: string) => {
    const name = rawName.trim() || 'New connection';
    const initials =
      name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || 'L';
    const id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const conversation: LocalConversation = {
      id,
      name,
      initials,
      color: '#454954',
      unread: 0,
      updatedAt: Date.now(),
      messages: [],
    };

    setConversations((current) => [conversation, ...current]);
    return id;
  }, []);

  const appendMessage = useCallback((conversationId: string, rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    const createdAt = Date.now();
    const message: LocalChatMessage = {
      id: `message-${createdAt}-${Math.random().toString(36).slice(2, 7)}`,
      text,
      time: clockTime(new Date(createdAt)),
      mine: true,
      status: 'sent',
    };

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, message],
              updatedAt: createdAt,
              unread: 0,
            }
          : conversation,
      ),
    );
  }, []);

  const markRead = useCallback((conversationId: string) => {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId && conversation.unread > 0
          ? { ...conversation, unread: 0 }
          : conversation,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({
      conversations,
      isReady,
      persistenceWarning,
      createConversation,
      appendMessage,
      markRead,
    }),
    [
      conversations,
      isReady,
      persistenceWarning,
      createConversation,
      appendMessage,
      markRead,
    ],
  );

  return (
    <LocalDataContext.Provider value={value}>
      {children}
    </LocalDataContext.Provider>
  );
}

export function useLocalData() {
  const value = useContext(LocalDataContext);
  if (!value) {
    throw new Error('useLocalData must be used within LocalDataProvider');
  }
  return value;
}
