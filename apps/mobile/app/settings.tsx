import { router } from 'expo-router';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../src/components/ui/Screen';
import { SectionLabel } from '../src/components/ui/SectionLabel';
import { SettingsRow } from '../src/components/settings/SettingsRow';
import { ThemeToggle } from '../src/components/ui/ThemeToggle';
import { NeumorphicSurface } from '../src/components/ui/NeumorphicSurface';
import { useTheme } from '../src/theme/ThemeProvider';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const rows = [
  { title: 'Anonymous identity', detail: 'Quiet Orbit' },
  { title: 'Privacy', detail: 'Controls and visibility' },
  { title: 'Blocked identities', detail: 'Manage blocked users' },
  { title: 'About LATEO', detail: 'Open-source prototype' },
];

export default function SettingsScreen() {
  const { palette: theme, mode } = useTheme();
  return (
    <Screen>
      <AnimatedPressable onPress={() => router.back()} style={styles.back}><Animated.Text style={[styles.backText, { color: theme.muted }]}>‹  Back</Animated.Text></AnimatedPressable>
      <SectionLabel>YOUR CONTROL</SectionLabel>
      <Animated.Text style={[styles.title, { color: theme.text }]}>Settings</Animated.Text>
      <NeumorphicSurface style={styles.themeCard} raised>
        <View style={styles.themeCopy}><Animated.Text style={[styles.themeTitle, { color: theme.text }]}>Appearance</Animated.Text><Animated.Text style={[styles.themeDetail, { color: theme.muted }]}>{mode === 'dark' ? 'Dark mode' : 'Light mode'}</Animated.Text></View>
        <ThemeToggle />
      </NeumorphicSurface>
      <NeumorphicSurface style={styles.card}>
        {rows.map((row, index) => <View key={row.title} style={index !== rows.length - 1 && [styles.divider, { borderBottomColor: theme.border }]}><SettingsRow title={row.title} detail={row.detail} /></View>)}
      </NeumorphicSurface>
      <View style={[styles.notice, { backgroundColor: theme.surfaceAlt, borderColor: palette.border }]}><Animated.Text style={[styles.noticeTitle, { color: theme.warning }]}>Security status</Animated.Text><Animated.Text style={[styles.noticeBody, { color: theme.muted }]}>This UI is a prototype. Identity, encryption, and privacy controls are not active yet.</Animated.Text></View>
      <Animated.Text style={[styles.version, { color: theme.muted }]}>LATEO · 0.1.0</Animated.Text>
    </Screen>
  );
}
const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', paddingVertical: 10, marginBottom: 24 },
  backText: { fontSize: 14 },
  title: { fontSize: 30, letterSpacing: -1, fontWeight: '500', marginTop: 7, marginBottom: 20 },
  themeCard: { borderRadius: 20, padding: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  themeCopy: { gap: 5 }, themeTitle: { fontSize: 14, fontWeight: '600' }, themeDetail: { fontSize: 11 },
  card: { borderRadius: 20, overflow: 'hidden' },
  divider: { borderBottomWidth: 1 },
  notice: { marginTop: 22, borderRadius: 16, padding: 16, borderWidth: 1, gap: 7 },
  noticeTitle: { fontSize: 12, fontWeight: '600' }, noticeBody: { fontSize: 11, lineHeight: 17 },
  version: { fontSize: 10, textAlign: 'center', marginTop: 'auto', paddingTop: 28 },
});
