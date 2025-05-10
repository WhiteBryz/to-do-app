import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function Settings() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22 }}>Página: Settings</Text>
      <Button title="Agregar nueva tarea" onPress={() => router.push('../../modals/new-task')} />
    </View>
  );
}
