import { useState } from 'react';
import { router } from 'expo-router';
import { Share, StyleSheet, Text, View, Pressable } from 'react-native';
import { Screen } from '../src/components/ui/Screen';
import { SectionLabel } from '../src/components/ui/SectionLabel';
import { AppButton } from '../src/components/ui/AppButton';
import { colors, radius } from '../src/theme/tokens';

type Expiry = '1 hour' | '24 hours' | '7 days';
type IdentityMode = 'Persistent' | 'Disposable';

const expiryOptions: { label: Expiry; detail: string }[] = [
  { label: '1 hour', detail: 'Short-lived' },
  { label: '24 hours', detail: 'Recommended' },
  { label: '7 days', detail: 'Longer access' },
];

export default function NewConversationScreen() {
  const [expiry, setExpiry] = useState<Expiry>('24 hours');
  const [identity, setIdentity] = useState<IdentityMode>('Persistent');
  const [created, setCreated] = useState(false);
  const [inviteCode] = useState(() => Math.random().toString(36).slice(2, 10).toUpperCase());
  const inviteUrl = `https://lateo.example/invite/${inviteCode}`;

  const shareInvite = async () => {
    await Share.share({
      message: `Join me on LATEO. This prototype invitation is not secure or functional yet: ${inviteUrl}`,
      url: inviteUrl,
    });
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>‹</Text></Pressable>
        <View style={styles.headerCopy}><SectionLabel>PRIVATE CONNECTION</SectionLabel><Text style={styles.title}>New conversation</Text></View>
      </View>

      {!created ? (
        <>
          <View style={styles.intro}>
            <View style={styles.iconOrb}><Text style={styles.orbIcon}>↗</Text></View>
            <Text style={styles.heading}>Create an invitation</Text>
            <Text style={styles.description}>Share a link with someone to start a private conversation. You don't need to know who they are.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Invitation expires</Text>
            <View style={styles.options}>
              {expiryOptions.map((option) => {
                const selected = expiry === option.label;
                return (
                  <Pressable key={option.label} onPress={() => setExpiry(option.label)} style={[styles.option, selected && styles.optionSelected]}>
                    <View style={styles.optionTop}><Text style={[styles.optionLabel, selected && styles.selectedText]}>{option.label}</Text>{selected ? <Text style={styles.check}>✓</Text> : null}</View>
                    <Text style={styles.optionDetail}>{option.detail}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your identity</Text>
            <View style={styles.identityOptions}>
              {(['Persistent', 'Disposable'] as const).map((mode) => {
                const selected = identity === mode;
                return (
                  <Pressable key={mode} onPress={() => setIdentity(mode)} style={[styles.identityOption, selected && styles.optionSelected]}>
                    <Text style={styles.identityIcon}>{mode === 'Persistent' ? '◈' : '◇'}</Text>
                    <Text style={[styles.identityLabel, selected && styles.selectedText]}>{mode}</Text>
                    <Text style={styles.identityDetail}>{mode === 'Persistent' ? 'Keep the same anonymous identity' : 'Use a fresh identity for this chat'}</Text>
                    {selected ? <Text style={styles.check}>✓</Text> : null}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.notice}><Text style={styles.noticeTitle}>Prototype notice</Text><Text style={styles.noticeBody}>This creates a mock invitation. Real invitation security, expiry enforcement, and identity cryptography are not implemented.</Text></View>
          <AppButton label="Create invitation" rightLabel="→" onPress={() => setCreated(true)} />
        </>
      ) : (
        <View style={styles.preview}>
          <View style={styles.successOrb}><Text style={styles.successIcon}>✓</Text></View>
          <SectionLabel>INVITATION PREVIEW</SectionLabel>
          <Text style={styles.heading}>Your link is ready</Text>
          <Text style={styles.description}>Share this link with the person you want to connect with.</Text>
          <View style={styles.linkCard}>
            <Text style={styles.linkLabel}>MOCK INVITATION LINK</Text>
            <Text selectable style={styles.link}>{inviteUrl}</Text>
            <View style={styles.linkMeta}><Text style={styles.metaText}>Expires in {expiry}</Text><Text style={styles.metaText}>{identity} identity</Text></View>
          </View>
          <View style={styles.notice}><Text style={styles.noticeTitle}>Not a real invitation</Text><Text style={styles.noticeBody}>This prototype link will not open a conversation. Do not use it for sensitive communication.</Text></View>
          <AppButton label="Share invitation" rightLabel="↗" onPress={shareInvite} />
          <AppButton label="Done" variant="secondary" onPress={() => router.replace('/home')} />
          <Pressable onPress={() => setCreated(false)}><Text style={styles.editText}>Edit invitation settings</Text></Pressable>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 22 },
  back: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  backText: { color: colors.text, fontSize: 28, lineHeight: 30, marginTop: -3 },
  headerCopy: { flex: 1 },
  title: { color: colors.text, fontSize: 24, letterSpacing: -0.6, fontWeight: '500', marginTop: 5 },
  intro: { alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, gap: 10 },
  iconOrb: { width: 76, height: 76, borderRadius: 38, borderWidth: 1, borderColor: '#5A526E', backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  orbIcon: { color: colors.accent, fontSize: 30 },
  heading: { color: colors.text, fontSize: 24, fontWeight: '500', letterSpacing: -0.7, textAlign: 'center' },
  description: { color: colors.textMuted, fontSize: 13, lineHeight: 20, textAlign: 'center', maxWidth: 300 },
  section: { marginTop: 24, gap: 12 },
  sectionTitle: { color: colors.text, fontSize: 14, fontWeight: '600' },
  options: { flexDirection: 'row', gap: 8 },
  option: { flex: 1, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, minHeight: 76 },
  optionSelected: { borderColor: colors.accent, backgroundColor: '#211D2D' },
  optionTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionLabel: { color: colors.text, fontSize: 13, fontWeight: '600' },
  optionDetail: { color: colors.textMuted, fontSize: 10, marginTop: 8 },
  selectedText: { color: colors.accent },
  check: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  identityOptions: { gap: 8 },
  identityOption: { position: 'relative', padding: 14, paddingRight: 36, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.surface },
  identityIcon: { color: colors.accent, fontSize: 18, marginBottom: 8 },
  identityLabel: { color: colors.text, fontSize: 13, fontWeight: '600' },
  identityDetail: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
  notice: { backgroundColor: '#17151B', borderWidth: 1, borderColor: '#39323E', borderRadius: radius.md, padding: 13, marginVertical: 20, gap: 5 },
  noticeTitle: { color: colors.warning, fontSize: 11, fontWeight: '600' },
  noticeBody: { color: colors.textMuted, fontSize: 11, lineHeight: 16 },
  preview: { flex: 1, alignItems: 'center', gap: 14, paddingTop: 32 },
  successOrb: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#1D2C26', borderWidth: 1, borderColor: '#466B58', alignItems: 'center', justifyContent: 'center' },
  successIcon: { color: colors.success, fontSize: 26 },
  linkCard: { width: '100%', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, gap: 12, marginTop: 8 },
  linkLabel: { color: colors.textMuted, fontSize: 9, letterSpacing: 1.2 },
  link: { color: colors.accent, fontSize: 14, fontWeight: '600' },
  linkMeta: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  metaText: { color: colors.textMuted, fontSize: 10 },
  editText: { color: colors.textMuted, fontSize: 12, padding: 12 },
});
