import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { Chip, FAB, ProgressBar } from 'react-native-paper';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("Hoy");

  const filters = ["Hoy", "Mañana", "Esta semana", "Todas"];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{selectedFilter}</Text>

      {/* Barra de Progreso */}
      <ProgressBar progress={0.3}  color="green" style={{ marginVertical: 8, height:10, borderRadius: 5}} />
      <Text style={{ fontSize: 12, fontWeight: 'bold', alignSelf: "center", width: "100%" }}>Quedan 3 tareas de 7</Text>

      {/* Chips de filtros */}
      <View style={{ height: "auto"}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{ marginVertical: 8}}>
          {filters.map(f => (
            <Chip
              key={f}
              style={{ marginRight: 8, height: 30 }}
              selected={selectedFilter === f}
              onPress={() => setSelectedFilter(f)}
            >
              {f}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Lista de tareas (simulada) */}
      <ScrollView style={{ flex: 1 }}>
        {[1, 2, 3].map(i => (
          <Link href={{
            pathname: `../home/${i}`, // Enlace a la pantalla de detalle
            params: { id: i }, // Parámetro de ID
          }} asChild>
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
