import { useState } from 'react';
import { router } from 'expo-router';
import {
  Animated,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Screen } from '../src/components/ui/Screen';
import { SectionLabel } from '../src/components/ui/SectionLabel';
import { AppButton } from '../src/components/ui/AppButton';
import { NeumorphicSurface } from '../src/components/ui/NeumorphicSurface';
import { ThemeToggle } from '../src/components/ui/ThemeToggle';
import { useTheme } from '../src/theme/ThemeProvider';
import { useLocalData } from '../src/state/LocalDataProvider';

export default function NewConversationScreen() {
  const [name, setName] = useState('');
  const { palette } = useTheme();
  const { createConversation, isReady } = useLocalData();

  const createLocalChat = () => {
    if (!isReady) return;
    const id = createConversation(name);
    router.replace({
      pathname: '/conversation',
      params: { id },
    });
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <NeumorphicSurface inset style={styles.back}>
            <Animated.Text style={[styles.backText, { color: palette.text }]}>
              ‹
            </Animated.Text>
          </NeumorphicSurface>
        </Pressable>
        <View style={styles.headerCopy}>
          <SectionLabel>ON THIS DEVICE</SectionLabel>
          <Animated.Text style={[styles.title, { color: palette.text }]}>
            New conversation
          </Animated.Text>
        </View>
        <ThemeToggle />
      </View>

      <View style={styles.intro}>
        <NeumorphicSurface raised style={styles.iconOrb}>
          <Animated.Text style={[styles.orbIcon, { color: palette.accent }]}>
            ＋
          </Animated.Text>
        </NeumorphicSurface>
        <Animated.Text style={[styles.heading, { color: palette.text }]}>
          Create a local chat
        </Animated.Text>
        <Animated.Text style={[styles.description, { color: palette.muted }]}>
          Give this conversation a name. You can write messages and your local history will remain on this device.
        </Animated.Text>
      </View>

      <View style={styles.form}>
        <Animated.Text style={[styles.fieldLabel, { color: palette.text }]}>
          Conversation name
        </Animated.Text>
        <NeumorphicSurface inset style={styles.inputSurface}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Kai"
            placeholderTextColor={palette.muted}
            maxLength={40}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={createLocalChat}
            style={[styles.input, { color: palette.text }]}
            accessibilityLabel="Conversation name"
          />
        </NeumorphicSurface>
        <Animated.Text style={[styles.helper, { color: palette.muted }]}>
          Leave this blank to use “New connection”.
        </Animated.Text>
      </View>

      <View style={styles.noticeWrap}>
        <NeumorphicSurface inset style={styles.notice}>
          <Animated.Text style={[styles.noticeTitle, { color: palette.warning }]}>
            Local prototype only
          </Animated.Text>
          <Animated.Text style={[styles.noticeBody, { color: palette.muted }]}>
            This does not invite another person or send messages. There is no server connection or end-to-end encryption yet. Messages are stored unencrypted in this app's local storage.
          </Animated.Text>
        </NeumorphicSurface>
      </View>

      <View style={styles.footer}>
        <AppButton
          label={isReady ? 'Create local chat' : 'Preparing local storage…'}
          rightLabel="→"
          onPress={createLocalChat}
        />
        <Animated.Text style={[styles.footerNote, { color: palette.muted }]}>
          You can delete this local data by clearing app storage or uninstalling the prototype.
        </Animated.Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 28, lineHeight: 30, marginTop: -3 },
  headerCopy: { flex: 1, gap: 5 },
  title: { fontSize: 23, letterSpacing: -0.6, fontWeight: '600' },
  intro: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 14,
    gap: 12,
  },
  iconOrb: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbIcon: { fontSize: 30 },
  heading: {
    fontSize: 23,
    fontWeight: '600',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 300,
  },
  form: { marginTop: 22, gap: 10 },
  fieldLabel: { fontSize: 13, fontWeight: '600' },
  inputSurface: {
    minHeight: 54,
    borderRadius: 18,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: { minHeight: 52, fontSize: 14 },
  helper: { fontSize: 10 },
  noticeWrap: { marginTop: 24 },
  notice: {
    borderRadius: 18,
    padding: 15,
    gap: 7,
  },
  noticeTitle: { fontSize: 11, fontWeight: '700' },
  noticeBody: { fontSize: 11, lineHeight: 17 },
  footer: { marginTop: 'auto', gap: 12, paddingTop: 32 },
  footerNote: { fontSize: 10, lineHeight: 15, textAlign: 'center' },
});
