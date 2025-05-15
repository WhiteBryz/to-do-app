import ChipFilter from "@/components/ChipFilter";
import ProgressBarComponent from "@/components/ProgressBar";
import { useTasks } from '@/hooks/useTasks';
import { FilterOption, Task, filters } from '@/types/task';
import { getTaskCategories } from '@/utils/dateFilters';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Link } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { FAB } from 'react-native-paper';

export default function HomeScreen() {
    const { tasks } = useTasks();
    const [filter, setFilter] = useState<FilterOption>('today');

    const completedTasks = tasks.filter(t => t.completed).length;

    const filteredTasks = filter
        ? tasks.filter(task => getTaskCategories(task).includes(filter))
        : tasks;

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                {filters.find(f => f.value === filter)?.label}
            </Text>

            {/* Barra de progreso */}
            <ProgressBarComponent completed={completedTasks} total={tasks.length} />

            {/* Filtros con chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
                {filters.map(f => (
                    <ChipFilter
                        key={f.value}
                        label={f.label}
                        selected={filter === f.value}
                        onSelect={() => setFilter(filter === f.value ? null : f.value)} // toggle
                    />
                ))}
            </ScrollView>

            {/* Lista de tareas filtradas */}
            <ScrollView style={{ flex: 1 }}>
                {filteredTasks.length === 0 && (
                    <Text style={{ textAlign: 'center', marginTop: 32, fontStyle: 'italic' }}>
                        No hay tareas para esta categoría.
                    </Text>
                )}
                {filteredTasks.map((task: Task) => (
                    <Link
                        key={task.id}
                        href={{ pathname: `../home/${task.id}`, params: { id: task.id } }}
                        asChild
                    >
                        <Pressable
                            style={{
                                padding: 16,
                                backgroundColor: task.completed ? '#c8e6c9' : '#f5f5f5',
                                borderRadius: 8,
                                marginBottom: 8,
                            }}
                        >
                            <Text style={{ fontWeight: 'bold' }}>{task.title}</Text>
                            <Text style={{ color: '#666' }}>
                                {task.date.split('T')[0]} - {task.time}
                            </Text>
                        </Pressable>
                    </Link>
                ))}
            </ScrollView>

            {/* Botón flotante para nueva tarea */}
            <Link href="../modals/newTask" asChild>
                <FAB
                    icon={props => <Icon name="plus" {...props} />}
                    color="white"
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
