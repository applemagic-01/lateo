import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../src/components/ui/Screen';
import { SectionLabel } from '../src/components/ui/SectionLabel';
import { SettingsRow } from '../src/components/settings/SettingsRow';
import { colors, radius } from '../src/theme/tokens';

const rows = [
  { title: 'Anonymous identity', detail: 'Quiet Orbit' },
  { title: 'Privacy', detail: 'Controls and visibility' },
  { title: 'Blocked identities', detail: 'Manage blocked users' },
  { title: 'About LATEO', detail: 'Open-source prototype' },
];

export default function SettingsScreen() {
  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>‹  Back</Text></Pressable>
      <SectionLabel>YOUR CONTROL</SectionLabel>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.card}>{rows.map((row, index) => <View key={row.title} style={index !== rows.length - 1 && styles.divider}><SettingsRow title={row.title} detail={row.detail} /></View>)}</View>
      <View style={styles.notice}><Text style={styles.noticeTitle}>Security status</Text><Text style={styles.noticeBody}>This UI is a prototype. Identity, encryption, and privacy controls are not active yet.</Text></View>
      <Text style={styles.version}>LATEO · 0.1.0</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', paddingVertical: 10, marginBottom: 24 },
  backText: { color: colors.textMuted, fontSize: 14 },
  title: { color: colors.text, fontSize: 30, letterSpacing: -1, fontWeight: '500', marginTop: 7, marginBottom: 24 },
  card: { borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  divider: { borderBottomWidth: 1, borderBottomColor: '#282530' },
  notice: { marginTop: 22, borderRadius: radius.md, padding: 16, backgroundColor: '#201C24', borderWidth: 1, borderColor: '#45333B', gap: 7 },
  noticeTitle: { color: '#E7B6BE', fontSize: 12, fontWeight: '600' },
  noticeBody: { color: colors.textMuted, fontSize: 11, lineHeight: 17 },
  version: { color: '#5E5B67', fontSize: 10, textAlign: 'center', marginTop: 'auto', paddingTop: 28 },
});
