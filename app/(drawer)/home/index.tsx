import ChipFilter from "@/components/ChipFilter";
import ProgressBarComponent from "@/components/ProgressBar";
import useTasks from "@/hooks/UseTasks";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { FAB } from 'react-native-paper';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("Hoy");
  const { filter, setFilter, tasks, completedTasks } = useTasks();

  const filters = ["Hoy", "Mañana", "Esta semana", "Todas"];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{selectedFilter}</Text>

      {/* Barra de Progreso */}
      <ProgressBarComponent
        completed={completedTasks}
        total={tasks.length}
      />

      {/* Chips de filtros */}
      <View style={{ height: "auto"}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8}}>
          <ChipFilter selected={filter} onSelect={setFilter}/>
        </ScrollView>
      </View>

      {/* Lista de tareas (simulada) */}
      <ScrollView style={{ flex: 1 }}>
        {[1, 2, 3].map(i => (
          <Link href={{
            pathname: `../home/${i}`, // Enlace a la pantalla de detalle
            params: { id: i }, // Parámetro de ID
          }}
          key={i} 
          asChild>
            {/* Enlace a la pantalla de detalle */}                   
            <Pressable
              key={i}
              style={{ padding: 16, backgroundColor: '#eee', borderRadius: 8, marginBottom: 8 }}
            >
              <Text>Tarea #{i}</Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
      
      {/* Floating Action Button */}
      <Link href="../modals/newTask" asChild>
        <FAB
          icon={props => <Icon name="plus" {...props} />}
          color='white'
          style={{
            position: 'absolute',
            backgroundColor: "#6200ee",
            borderRadius: 50,
            bottom: 40,
            right: Dimensions.get('window').width * 0.5 - 30,
          }}
        />
      </Link>
    </View>
  );
}
