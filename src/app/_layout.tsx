import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '@/ui/theme/ThemeProvider';

function StatusBarForTheme() {
  const theme = useTheme();
  return <StatusBar style={theme.dark ? 'light' : 'dark'} />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBarForTheme />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="game" />
          <Stack.Screen name="settings" />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
