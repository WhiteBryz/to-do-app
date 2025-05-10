import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{
        tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />
      }} />
      <Tabs.Screen name="trophies" options={{
        tabBarIcon: ({ color, size }) => <MaterialIcons name="emoji-events" size={size} color={color} />
      }} />
      <Tabs.Screen name="charts" options={{
        tabBarIcon: ({ color, size }) => <MaterialIcons name="bar-chart" size={size} color={color} />
      }} />
      <Tabs.Screen name="settings" options={{
        tabBarIcon: ({ color, size }) => <MaterialIcons name="settings" size={size} color={color} />
      }} />
    </Tabs>
  );
}
