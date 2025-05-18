import { CustomDrawer } from '@/components/CustomDrawer';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import '../../utils/debug';


export default function DrawerLayout() {
  const theme = useTheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          drawerActiveTintColor: theme.primary,
          drawerInactiveTintColor: theme.text,
          drawerStyle: { backgroundColor: theme.background },
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {
            color: theme.text,
            fontWeight: 'bold',
          },
          headerTintColor: theme.text,
        }}
      >
        <Drawer.Screen name="home" options={{
          title: 'Tareas', drawerIcon: ({ color, size, focused }) => {
            return <Ionicons name="pencil-outline" color={focused ? theme.primary : theme.text} size={size} />;
          }
        }} />
        <Drawer.Screen name="trophies/index" options={{
          title: 'Trofeos', drawerIcon: ({ color, size, focused }) => {
            return <Ionicons name="trophy-outline" color={focused ? theme.primary : theme.text} size={size} />;
          }
        }} />
        <Drawer.Screen name="charts/index" options={{
          title: 'Gráficas', drawerIcon: ({ color, size, focused }) => {
            return <Ionicons name="pie-chart-outline" color={focused ? theme.primary : theme.text} size={size} />;
          }
        }} />
        <Drawer.Screen name="history/index" options={{
          title: 'Historial', drawerIcon: ({ color, size, focused }) => {
            return <Ionicons name="time-outline" color={focused ? theme.primary : theme.text} size={size} />;
          }
        }} />
        <Drawer.Screen name="settings/index" options={{
          title: 'Configuración', drawerIcon: ({ color, size, focused }) => {
            return <Ionicons name="settings-outline" color={focused ? theme.primary : theme.text} size={size} />;
          }
        }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
