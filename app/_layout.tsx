import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    //<SafeAreaView>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    //</SafeAreaView>
  );
}
