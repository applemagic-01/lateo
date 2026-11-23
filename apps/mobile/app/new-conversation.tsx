import { useState } from 'react';
import { router } from 'expo-router';
import { Share, Animated, Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '../src/components/ui/Screen';
import { SectionLabel } from '../src/components/ui/SectionLabel';
import { AppButton } from '../src/components/ui/AppButton';
import { NeumorphicSurface } from '../src/components/ui/NeumorphicSurface';
import { useTheme } from '../src/theme/ThemeProvider';
import { radius } from '../src/theme/tokens';
import { ThemeToggle } from '../src/components/ui/ThemeToggle';

type Expiry = "1 hour" | "24 hours" | "7 days";
type IdentityMode = "Persistent" | "Disposable";
const expiryOptions: { label: Expiry; detail: string }[] = [
  { label: "1 hour", detail: "Short-lived" },
  { label: "24 hours", detail: "Recommended" },
  { label: "7 days", detail: "Longer access" },
];

export default function NewConversationScreen() {
  const [expiry, setExpiry] = useState<Expiry>("24 hours");
  const [identity, setIdentity] = useState<IdentityMode>("Persistent");
  const [created, setCreated] = useState(false);
  const [inviteCode] = useState(() =>
    Math.random().toString(36).slice(2, 10).toUpperCase(),
  );
  const inviteUrl = `https://lateo.example/invite/${inviteCode}`;
  const { palette: theme } = useTheme();

  const shareInvite = async () =>
    Share.share({
      message: `Join me on LATEO. This prototype invitation is not secure or functional yet: ${inviteUrl}`,
      url: inviteUrl,
    });

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Go back">
          <NeumorphicSurface inset style={styles.back}>
            <Animated.Text style={[styles.backText, { color: theme.text }]}>
              ‹
            </Animated.Text>
          </NeumorphicSurface>
        </Pressable>
        <View style={styles.headerCopy}>
          <SectionLabel>PRIVATE CONNECTION</SectionLabel>
          <Animated.Text style={[styles.title, { color: theme.text }]}>
            New conversation
          </Animated.Text>
        </View>
        <ThemeToggle />
      </View>
      {!created ? (
        <>
          <View style={styles.intro}>
            <NeumorphicSurface style={styles.iconOrb} raised>
              <Animated.Text style={[styles.orbIcon, { color: theme.accent }]}>
                ↗
              </Animated.Text>
            </NeumorphicSurface>
            <Animated.Text style={[styles.heading, { color: theme.text }]}>
              Create an invitation
            </Animated.Text>
            <Animated.Text style={[styles.description, { color: theme.muted }]}>
              Share a link with someone to start a private conversation. You
              don't need to know who they are.
            </Animated.Text>
          </View>
          <View style={styles.section}>
            <Animated.Text style={[styles.sectionTitle, { color: theme.text }]}>
              Invitation expires
            </Animated.Text>
            <View style={styles.options}>
              {expiryOptions.map((option) => {
                const selected = expiry === option.label;
                return (
                  <Pressable
                    key={option.label}
                    onPress={() => setExpiry(option.label)}
                    style={styles.optionPressable}
                  >
                    <NeumorphicSurface raised={!selected} inset={selected} style={styles.option}>
                    <View style={styles.optionTop}>
                      <Animated.Text
                        style={[
                          styles.optionLabel,
                          { color: selected ? theme.accent : theme.text },
                        ]}
                      >
                        {option.label}
                      </Animated.Text>
                      {selected ? (
                        <Animated.Text
                          style={[styles.check, { color: theme.accent }]}
                        >
                          ✓
                        </Animated.Text>
                      ) : null}
                    </View>
                    <Animated.Text
                      style={[styles.optionDetail, { color: theme.muted }]}
                    >
                      {option.detail}
                    </Animated.Text>
                    </NeumorphicSurface>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <View style={styles.section}>
            <Animated.Text style={[styles.sectionTitle, { color: theme.text }]}>
              Your identity
            </Animated.Text>
            <View style={styles.identityOptions}>
              {(["Persistent", "Disposable"] as const).map((mode) => {
                const selected = identity === mode;
                return (
                  <Pressable
                    key={mode}
                    onPress={() => setIdentity(mode)}
                    style={styles.identityPressable}
                  >
                    <NeumorphicSurface raised={!selected} inset={selected} style={styles.identityOption}>
                    <Animated.Text
                      style={[styles.identityIcon, { color: theme.accent }]}
                    >
                      {mode === "Persistent" ? "◈" : "◇"}
                    </Animated.Text>
                    <Animated.Text
                      style={[
                        styles.identityLabel,
                        { color: selected ? theme.accent : theme.text },
                      ]}
                    >
                      {mode}
                    </Animated.Text>
                    <Animated.Text
                      style={[styles.identityDetail, { color: theme.muted }]}
                    >
                      {mode === "Persistent"
                        ? "Keep the same anonymous identity"
                        : "Use a fresh identity for this chat"}
                    </Animated.Text>
                    {selected ? (
                      <Animated.Text
                        style={[styles.check, { color: theme.accent }]}
                      >
                        ✓
                      </Animated.Text>
                    ) : null}
                    </NeumorphicSurface>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <NeumorphicSurface inset style={styles.notice}>
            <Animated.Text
              style={[styles.noticeTitle, { color: theme.warning }]}
            >
              Prototype notice
            </Animated.Text>
            <Animated.Text style={[styles.noticeBody, { color: theme.muted }]}>
              This creates a mock invitation. Real invitation security, expiry
              enforcement, and identity cryptography are not implemented.
            </Animated.Text>
          </NeumorphicSurface>
          <AppButton
            label="Create invitation"
            rightLabel="→"
            onPress={() => setCreated(true)}
          />
        </>
      ) : (
        <View style={styles.preview}>
          <NeumorphicSurface style={styles.successOrb} raised>
            <Animated.Text
              style={[styles.successIcon, { color: theme.success }]}
            >
              ✓
            </Animated.Text>
          </NeumorphicSurface>
          <SectionLabel>INVITATION PREVIEW</SectionLabel>
          <Animated.Text style={[styles.heading, { color: theme.text }]}>
            Your link is ready
          </Animated.Text>
          <Animated.Text style={[styles.description, { color: theme.muted }]}>
            Share this link with the person you want to connect with.
          </Animated.Text>
          <NeumorphicSurface style={styles.linkCard} raised>
            <Animated.Text style={[styles.linkLabel, { color: theme.muted }]}>
              MOCK INVITATION LINK
            </Animated.Text>
            <Animated.Text
              selectable
              style={[styles.link, { color: theme.accent }]}
            >
              {inviteUrl}
            </Animated.Text>
            <View style={[styles.linkMeta, { borderTopColor: theme.border }]}>
              <Animated.Text style={[styles.metaText, { color: theme.muted }]}>
                Expires in {expiry}
              </Animated.Text>
              <Animated.Text style={[styles.metaText, { color: theme.muted }]}>
                {identity} identity
              </Animated.Text>
            </View>
          </NeumorphicSurface>
          <NeumorphicSurface inset style={styles.notice}>
            <Animated.Text
              style={[styles.noticeTitle, { color: theme.warning }]}
            >
              Not a real invitation
            </Animated.Text>
            <Animated.Text style={[styles.noticeBody, { color: theme.muted }]}>
              This prototype link will not open a conversation. Do not use it
              for sensitive communication.
            </Animated.Text>
          </NeumorphicSurface>
          <AppButton
            label="Share invitation"
            rightLabel="↗"
            onPress={shareInvite}
          />
          <AppButton
            label="Done"
            variant="secondary"
            onPress={() => router.replace("/home")}
          />
          <Pressable onPress={() => setCreated(false)}>
            <Animated.Text style={[styles.editText, { color: theme.muted }]}>
              Edit invitation settings
            </Animated.Text>
          </Pressable>
        </View>
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 22,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { fontSize: 28, lineHeight: 30, marginTop: -3 },
  headerCopy: { flex: 1 },
  title: { fontSize: 24, letterSpacing: -0.6, fontWeight: "500", marginTop: 5 },
  intro: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  iconOrb: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  orbIcon: { fontSize: 30 },
  heading: {
    fontSize: 24,
    fontWeight: "500",
    letterSpacing: -0.7,
    textAlign: "center",
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 300,
  },
  section: { marginTop: 24, gap: 12 },
  sectionTitle: { fontSize: 14, fontWeight: "600" },
  options: { flexDirection: "row", gap: 8 },
  optionPressable: { flex: 1 },
  option: {
    padding: 12,
    borderRadius: radius.md,
    minHeight: 76,
  },
  optionTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionLabel: { fontSize: 13, fontWeight: "600" },
  optionDetail: { fontSize: 10, marginTop: 8 },
  check: { fontSize: 13, fontWeight: "700" },
  identityOptions: { gap: 12 },
  identityPressable: { width: '100%' },
  identityOption: {
    position: "relative",
    padding: 14,
    paddingRight: 36,
    borderRadius: radius.md,
  },
  identityIcon: { fontSize: 18, marginBottom: 8 },
  identityLabel: { fontSize: 13, fontWeight: "600" },
  identityDetail: { fontSize: 11, marginTop: 4 },
  notice: {
    borderRadius: radius.md,
    padding: 13,
    marginVertical: 20,
    gap: 5,
  },
  noticeTitle: { fontSize: 11, fontWeight: "600" },
  noticeBody: { fontSize: 11, lineHeight: 16 },
  preview: { flex: 1, alignItems: "center", gap: 14, paddingTop: 32 },
  successOrb: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  successIcon: { fontSize: 26 },
  linkCard: {
    width: "100%",
    borderRadius: radius.lg,
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  linkLabel: { fontSize: 9, letterSpacing: 1.2 },
  link: { fontSize: 14, fontWeight: "600" },
  linkMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 12,
  },
  metaText: { fontSize: 10 },
  editText: { fontSize: 12, padding: 12 },
});
