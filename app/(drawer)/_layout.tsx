import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen name="home" options={{ title: 'Tareas' }} />
        <Drawer.Screen name="trophies" options={{ title: 'Trofeos' }} />
        <Drawer.Screen name="charts" options={{ title: 'Gráficas' }} />
        <Drawer.Screen name="settings" options={{ title: 'Configuración' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
