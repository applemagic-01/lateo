import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [started, setStarted] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.brandRow}>
          <View style={styles.mark}>
            <View style={styles.markInner} />
          </View>
          <Text style={styles.wordmark}>LATEO</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>PRIVATE BY DESIGN</Text>
          <Text style={styles.title}>Remain unseen.{ '\n' }Stay connected.</Text>
          <Text style={styles.subtitle}>
            Conversations without the need to expose who you are.
          </Text>

          <View style={styles.orbit}>
            <View style={styles.orbitRing} />
            <View style={styles.orbitCore}>
              <View style={styles.orbitDot} />
            </View>
            <View style={[styles.smallNode, styles.nodeOne]} />
            <View style={[styles.smallNode, styles.nodeTwo]} />
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setStarted(true)}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>{started ? 'Prototype started' : 'Begin anonymously'}</Text>
            <Text style={styles.arrow}>↗</Text>
          </Pressable>
          <Text style={styles.footnote}>
            {started
              ? 'Identity creation is not implemented yet.'
              : 'No phone number. No email. No public profile.'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#09090D' },
  container: { flex: 1, paddingHorizontal: 28, paddingTop: 24, paddingBottom: 18 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  mark: {
    width: 30, height: 30, borderRadius: 10, borderWidth: 1,
    borderColor: '#77728F', alignItems: 'center', justifyContent: 'center',
  },
  markInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#B8A9F4' },
  wordmark: { color: '#F5F3FA', fontSize: 15, letterSpacing: 4, fontWeight: '600' },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'flex-start' },
  eyebrow: { color: '#9B91C7', letterSpacing: 3, fontSize: 10, fontWeight: '600', marginBottom: 18 },
  title: { color: '#F6F4FB', fontSize: 43, lineHeight: 49, letterSpacing: -1.8, fontWeight: '500' },
  subtitle: { color: '#9694A3', fontSize: 15, lineHeight: 23, marginTop: 18, maxWidth: 300 },
  orbit: { alignSelf: 'center', width: 230, height: 230, marginTop: 42, alignItems: 'center', justifyContent: 'center' },
  orbitRing: { position: 'absolute', width: 190, height: 190, borderRadius: 100, borderWidth: 1, borderColor: '#34313F' },
  orbitCore: { width: 94, height: 94, borderRadius: 32, borderWidth: 1, borderColor: '#635B83', backgroundColor: '#17151F', alignItems: 'center', justifyContent: 'center' },
  orbitDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#B8A9F4', shadowColor: '#B8A9F4', shadowOpacity: 0.5, shadowRadius: 20 },
  smallNode: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: '#77718F' },
  nodeOne: { top: 26, right: 38 },
  nodeTwo: { bottom: 30, left: 35 },
  footer: { gap: 14 },
  button: { height: 58, borderRadius: 18, backgroundColor: '#E9E4F8', paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  buttonPressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  buttonText: { color: '#17141F', fontSize: 15, fontWeight: '600' },
  arrow: { color: '#17141F', fontSize: 20 },
  footnote: { color: '#777582', textAlign: 'center', fontSize: 11 },
});
