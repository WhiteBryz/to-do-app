import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function Trophies() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22 }}>Página: Trophies</Text>
      <Button title="Agregar nueva tarea" onPress={() => router.push('../../modals/newTask')} />
    </View>
  );
}
