import { useLocalSearchParams } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function TaskDetail() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20 }}>Detalle de Tarea #{id}</Text>
      <Button title="Editar" onPress={() => {}} />
      <Button title="Eliminar" onPress={() => {}} color="red" />
    </View>
  );
}