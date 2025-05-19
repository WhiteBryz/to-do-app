import { Stack } from 'expo-router';
import '@/utils/debug';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        animation: 'slide_from_right',
        headerShown: false
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Tareas', headerTitle: "Tareas" }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalle de Tarea', headerTitle: "Detalles de la tarea" }} />
      <Stack.Screen name="newTask" options={{ presentation: 'modal', headerShown: true, animation:'slide_from_bottom'}} />
    </Stack>
  );
}
