import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Slot />
      <Toast />
    </PaperProvider>
  );
}
