import { router } from 'expo-router';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../src/components/ui/Screen';
import { SectionLabel } from '../src/components/ui/SectionLabel';
import { IdentityCard } from '../src/components/conversations/IdentityCard';
import { ConversationItem, Conversation } from '../src/components/conversations/ConversationItem';
import { AppButton } from '../src/components/ui/AppButton';
import { ThemeToggle } from '../src/components/ui/ThemeToggle';
import { NeumorphicSurface } from '../src/components/ui/NeumorphicSurface';
import { useAnimatedTheme } from '../src/theme/ThemeProvider';

const conversations: Conversation[] = [
  { initials: 'M', name: 'Mira', message: 'That stays between us.', time: '2m', unread: 2, color: '#8E83C5' },
  { initials: 'K', name: 'Kai', message: 'The invite expires tonight.', time: '1h', unread: 0, color: '#567F83' },
  { initials: 'N', name: 'Nocturne', message: 'Message received.', time: 'Yesterday', unread: 0, color: '#9A746B' },
];

export default function HomeScreen() {
  const theme = useAnimatedTheme();
  return (
    <Screen>
      <View style={styles.header}>
        <View><SectionLabel>YOUR SPACE</SectionLabel><Animated.Text style={[styles.title, { color: theme.text }]}>Conversations</Animated.Text></View>
        <View style={styles.actions}><ThemeToggle /><Pressable style={[styles.settings, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={() => router.push('/settings')}><Animated.Text style={[styles.settingsText, { color: theme.accent }]}>◈</Animated.Text></Pressable></View>
      </View>
      <IdentityCard identityName="Quiet Orbit" />
      <View style={styles.section}><Animated.Text style={[styles.sectionTitle, { color: theme.text }]}>Recent</Animated.Text><Animated.Text style={[styles.count, { color: theme.muted }]}>03</Animated.Text></View>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <NeumorphicSurface style={styles.listSurface}>
          {conversations.map((item) => <ConversationItem key={item.name} item={item} onPress={() => router.push({ pathname: '/conversation', params: { name: item.name, initials: item.initials, color: item.color } })} />)}
        <View style={styles.emptyHint}><Animated.Text style={[styles.emptyTitle, { color: theme.muted }]}>Quiet by default</Animated.Text><Animated.Text style={[styles.emptyBody, { color: theme.muted }]}>New conversations appear here. Start one with an invitation link.</Animated.Text></View>
        </NeumorphicSurface>
      </ScrollView>
      <AppButton label="New conversation" rightLabel="＋" onPress={() => router.push('/new-conversation')} />
      <View style={styles.bottomNote}><View style={[styles.lockDot, { backgroundColor: theme.warning }]} /><Animated.Text style={[styles.bottomText, { color: theme.muted }]}>Prototype · Messages are not encrypted yet</Animated.Text></View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 30, letterSpacing: -1, fontWeight: '500', marginTop: 7 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  settings: { width: 42, height: 42, borderRadius: 15, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  settingsText: { fontSize: 20 },
  section: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 26, marginBottom: 13 },
  sectionTitle: { fontSize: 16, fontWeight: '600' }, count: { fontSize: 11 },
  list: { flexGrow: 1, paddingBottom: 10 },
  listSurface: { borderRadius: 22, paddingHorizontal: 12, paddingTop: 2 },
  emptyHint: { paddingVertical: 26, alignItems: 'center', gap: 7 },
  emptyTitle: { fontSize: 12, fontWeight: '600' }, emptyBody: { fontSize: 11, textAlign: 'center', maxWidth: 230, lineHeight: 16 },
  bottomNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingTop: 14 },
  lockDot: { width: 5, height: 5, borderRadius: 3 }, bottomText: { fontSize: 9 },
});
