import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './debug';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen name="home" options={{ title: 'Tareas', drawerIcon: ({color, size}) => {
          return <Ionicons name="pencil" color={color} size={size} />;
        }}} />
        <Drawer.Screen name="trophies/index" options={{ title: 'Trofeos', drawerIcon: ({color, size}) =>{
          return <Ionicons name="trophy-sharp" color={color} size={size} />;
        } }} />
        <Drawer.Screen name="charts/index" options={{ title: 'Gráficas', drawerIcon: ({color, size}) =>{
          return <Ionicons name="pie-chart" color={color} size={size} />;
        } }} />
        <Drawer.Screen name="settings/index" options={{ title: 'Configuración', drawerIcon: ({color, size}) =>{
          return <Ionicons name="settings" color={color} size={size} />;
        } }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
