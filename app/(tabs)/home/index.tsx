import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Chip, FAB, ProgressBar } from 'react-native-paper';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("Hoy");

  const filters = ["Hoy", "Mañana", "Esta semana", "Todas"];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Tareas de {selectedFilter}</Text>

      {/* Barra de Progreso */}
      <ProgressBar progress={0.3} color="green" style={{ marginVertical: 8 }} />

      {/* Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8, height: 20 }}>
        {filters.map(f => (
          <Chip
            key={f}
            style={{ marginRight: 8 }}
            selected={selectedFilter === f}
            onPress={() => setSelectedFilter(f)}
          >
            {f}
          </Chip>
        ))}
      </ScrollView>

      {/* Lista de tareas (simulada) */}
      <ScrollView style={{ flex: 1 }}>
        {[1, 2, 3].map(i => (
          <Pressable
            key={i}
            onPress={() => router.push(`./${i}`)}
            style={{ padding: 16, backgroundColor: '#eee', borderRadius: 8, marginBottom: 8 }}
          >
            <Text>Tarea #{i}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          bottom: 80,
          right: 16,
        }}
        onPress={() => router.push('../modals/new-task')} // Open modal
      />
    </View>
  );
}
