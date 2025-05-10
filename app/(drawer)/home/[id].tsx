import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function TaskDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
        <View style={styles.container}>
          <Text style={styles.title}>Detalle de la tarea con ID: {id}</Text>
          <Button title="Regresar" onPress={() => router.back()} />
        </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 20 }
});
