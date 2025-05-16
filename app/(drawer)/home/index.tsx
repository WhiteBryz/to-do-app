import ChipFilter from "@/components/ChipFilter";
import ProgressBarComponent from "@/components/ProgressBar";
import TaskComponent from "@/components/Task";
import { useTasks } from '@/hooks/UseTasks';
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

    // console.log(filteredTasks)
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
                        <Pressable>
                            <TaskComponent task={task} onCheck={() => { alert("puto") }} />
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
