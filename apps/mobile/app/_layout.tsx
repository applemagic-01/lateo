import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LocalDataProvider } from '../src/state/LocalDataProvider';
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider';

function AppStack() {
  const { mode, palette } = useTheme();

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} animated />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: palette.background },
          animation: 'fade',
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LocalDataProvider>
        <AppStack />
      </LocalDataProvider>
    </ThemeProvider>
  );
}
