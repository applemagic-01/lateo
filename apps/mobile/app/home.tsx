import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../src/components/ui/Screen';
import { SectionLabel } from '../src/components/ui/SectionLabel';
import { IdentityCard } from '../src/components/conversations/IdentityCard';
import { ConversationItem, Conversation } from '../src/components/conversations/ConversationItem';
import { AppButton } from '../src/components/ui/AppButton';
import { colors } from '../src/theme/tokens';

const conversations: Conversation[] = [
  { initials: 'M', name: 'Mira', message: 'That stays between us.', time: '2m', unread: 2, color: '#8E83C5' },
  { initials: 'K', name: 'Kai', message: 'The invite expires tonight.', time: '1h', unread: 0, color: '#567F83' },
  { initials: 'N', name: 'Nocturne', message: 'Message received.', time: 'Yesterday', unread: 0, color: '#9A746B' },
];

export default function HomeScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <View><SectionLabel>YOUR SPACE</SectionLabel><Text style={styles.title}>Conversations</Text></View>
        <Pressable style={styles.settings} onPress={() => router.push('/settings')}><Text style={styles.settingsText}>◈</Text></Pressable>
      </View>
      <IdentityCard identityName="Quiet Orbit" />
      <View style={styles.section}><Text style={styles.sectionTitle}>Recent</Text><Text style={styles.count}>03</Text></View>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {conversations.map((item) => <ConversationItem key={item.name} item={item} />)}
        <View style={styles.emptyHint}><Text style={styles.emptyTitle}>Quiet by default</Text><Text style={styles.emptyBody}>New conversations appear here. Start one with an invitation link.</Text></View>
      </ScrollView>
      <AppButton label="New conversation" rightLabel="＋" onPress={() => {}} />
      <View style={styles.bottomNote}><View style={styles.lockDot} /><Text style={styles.bottomText}>Prototype · Messages are not encrypted yet</Text></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { color: colors.text, fontSize: 30, letterSpacing: -1, fontWeight: '500', marginTop: 7 },
  settings: { width: 42, height: 42, borderRadius: 15, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  settingsText: { color: colors.accent, fontSize: 20 },
  section: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 30, marginBottom: 13 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '600' },
  count: { color: colors.textMuted, fontSize: 11 },
  list: { flexGrow: 1 },
  emptyHint: { paddingVertical: 30, alignItems: 'center', gap: 7 },
  emptyTitle: { color: '#777582', fontSize: 12, fontWeight: '600' },
  emptyBody: { color: '#66636F', fontSize: 11, textAlign: 'center', maxWidth: 230, lineHeight: 16 },
  bottomNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingTop: 14 },
  lockDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#D6B67C' },
  bottomText: { color: '#706D79', fontSize: 9 },
});
