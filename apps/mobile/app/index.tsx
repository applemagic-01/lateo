import { useState } from 'react';
import { router } from 'expo-router';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../src/components/ui/AppButton';
import { BrandMark } from '../src/components/ui/BrandMark';
import { ProgressIndicator } from '../src/components/onboarding/ProgressIndicator';
import { PrivacyOrbit } from '../src/components/onboarding/PrivacyOrbit';
import { useAnimatedTheme } from '../src/theme/ThemeProvider';
import { spacing } from '../src/theme/tokens';

const steps = [
  { eyebrow: 'PRIVATE BY DESIGN', title: 'Remain unseen.\nStay connected.', body: 'Conversations without the need to expose who you are.', action: 'Continue' },
  { eyebrow: 'YOUR PRIVACY', title: 'No phone.\nNo email.', body: 'LATEO is designed around anonymous identity—not your personal details, contacts, or public profile.', action: 'I understand' },
  { eyebrow: 'A NEW IDENTITY', title: 'You decide\nwhat to reveal.', body: 'Your anonymous identity is yours. This prototype does not create cryptographic keys yet.', action: 'Explore LATEO' },
] as const;

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const theme = useAnimatedTheme();
  return (
    <Animated.View style={[styles.safe, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safe} edges={['top', 'right', 'bottom', 'left']}>
        <View style={styles.container}>
          <View style={styles.header}><BrandMark /><View style={styles.spacer} /><Animated.Text style={[styles.stepLabel, { color: theme.muted }]}>{step + 1} / 3</Animated.Text></View>
          <ProgressIndicator total={steps.length} activeIndex={step} />
          <View style={styles.hero}>
            <Animated.Text style={[styles.eyebrow, { color: theme.accent }]}>{current.eyebrow}</Animated.Text>
            <Animated.Text style={[styles.title, { color: theme.text }]}>{current.title}</Animated.Text>
            <Animated.Text style={[styles.body, { color: theme.muted }]}>{current.body}</Animated.Text>
            <PrivacyOrbit />
          </View>
          <View style={styles.footer}>
            <AppButton label={current.action} rightLabel="↗" onPress={() => step === 2 ? router.replace('/home') : setStep(step + 1)} />
            {step < 2 ? <Animated.Text onPress={() => router.replace('/home')} style={[styles.skip, { color: theme.muted }]}>Skip introduction</Animated.Text> : <Animated.Text style={[styles.disclaimer, { color: theme.muted }]}>Prototype only · Security features are not implemented</Animated.Text>}
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}
const styles = StyleSheet.create({ safe: { flex: 1 }, container: { flex: 1, paddingHorizontal: 28, paddingTop: spacing.lg, paddingBottom: spacing.md }, header: { flexDirection: 'row', alignItems: 'center' }, spacer: { flex: 1 }, stepLabel: { fontSize: 12 }, hero: { flex: 1, justifyContent: 'center' }, eyebrow: { letterSpacing: 3, fontSize: 10, fontWeight: '600', marginBottom: 18 }, title: { fontSize: 43, lineHeight: 49, letterSpacing: -1.8, fontWeight: '500' }, body: { fontSize: 15, lineHeight: 23, marginTop: 18, maxWidth: 310 }, footer: { gap: 14 }, skip: { fontSize: 12, textAlign: 'center', paddingVertical: 10 }, disclaimer: { fontSize: 10, textAlign: 'center' } });
