import { SettingsProvider } from '@/context/SettingsContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <PaperProvider>
      <SettingsProvider>
        <ThemeProvider>
          <Slot />
          <Toast />
        </ThemeProvider>
      </SettingsProvider>
    </PaperProvider>
  );
}
