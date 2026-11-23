import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../src/components/ui/AppButton';
import { BrandMark } from '../src/components/ui/BrandMark';
import { ProgressIndicator } from '../src/components/onboarding/ProgressIndicator';
import { PrivacyOrbit } from '../src/components/onboarding/PrivacyOrbit';
import { colors, spacing } from '../src/theme/tokens';

const steps = [
  { eyebrow: 'PRIVATE BY DESIGN', title: 'Remain unseen.\\nStay connected.', body: 'Conversations without the need to expose who you are.', action: 'Continue' },
  { eyebrow: 'YOUR PRIVACY', title: 'No phone.\\nNo email.', body: 'LATEO is designed around anonymous identity—not your personal details, contacts, or public profile.', action: 'I understand' },
  { eyebrow: 'A NEW IDENTITY', title: 'You decide\\nwhat to reveal.', body: 'Your anonymous identity is yours. This prototype does not create cryptographic keys yet.', action: 'Explore LATEO' },
] as const;

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'right', 'bottom', 'left']}>
      <View style={styles.container}>
        <View style={styles.header}><BrandMark /><View style={styles.spacer} /><Text style={styles.stepLabel}>{step + 1} / 3</Text></View>
        <ProgressIndicator total={steps.length} activeIndex={step} />
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>{current.eyebrow}</Text>
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.body}>{current.body}</Text>
          <PrivacyOrbit />
        </View>
        <View style={styles.footer}>
          <AppButton label={current.action} rightLabel="↗" onPress={() => step === 2 ? router.replace('/home') : setStep(step + 1)} />
          {step < 2 ? <Text onPress={() => router.replace('/home')} style={styles.skip}>Skip introduction</Text> : <Text style={styles.disclaimer}>Prototype only · Security features are not implemented</Text>}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: 28, paddingTop: spacing.lg, paddingBottom: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center' },
  spacer: { flex: 1 },
  stepLabel: { color: colors.textMuted, fontSize: 12 },
  hero: { flex: 1, justifyContent: 'center' },
  eyebrow: { color: '#9B91C7', letterSpacing: 3, fontSize: 10, fontWeight: '600', marginBottom: 18 },
  title: { color: colors.text, fontSize: 43, lineHeight: 49, letterSpacing: -1.8, fontWeight: '500' },
  body: { color: colors.textMuted, fontSize: 15, lineHeight: 23, marginTop: 18, maxWidth: 310 },
  footer: { gap: 14 },
  skip: { color: colors.textMuted, fontSize: 12, textAlign: 'center', paddingVertical: 10 },
  disclaimer: { color: colors.textMuted, fontSize: 10, textAlign: 'center' },
});
