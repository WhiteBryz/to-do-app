import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function Charts() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22 }}>Página: Charts</Text>
      <Button title="Agregar nueva tarea" onPress={() => router.push('../../modals/new-task')} />
    </View>
  );
}
