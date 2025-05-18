import ChipFilter from "@/components/ChipFilter";
import ProgressBarComponent from "@/components/ProgressBar";
import TaskComponent from "@/components/Task";
import TextDivider from "@/components/TextDivider";
import { useTasks } from '@/hooks/UseTasks';
import { updateTask } from "@/store/taskStore";
import { evaluateTrophies, getUserStats, updateUserStats } from '@/store/trophiesStore';
import { FilterOption, Task, filters } from '@/types/task';
import { getTaskCategories } from '@/utils/dateFilters';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useCallback, useState } from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { FAB } from 'react-native-paper';

export default function HomeScreen() {
    const { tasks, reload, setTasks } = useTasks();
    const [filter, setFilter] = useState<FilterOption>('today');
    const completedTasks = tasks.filter(t => t.completed).length;
    const filteredTasks = filter
        ? tasks.filter(task => getTaskCategories(task).includes(filter))
        : tasks;

    const router = useRouter();
    const filteredTasksCompleted = filteredTasks.filter(task => task.completed === true)
    const filteredTasksIncompleted = filteredTasks.filter(task => task.completed === false)
    const hasTasksCompleted = filteredTasksCompleted.length > 0;
    const hasTasksIncompleted = filteredTasksIncompleted.length > 0;

    useFocusEffect(
        useCallback(() => {
            reload();
        }, [])
    );

    // Función para actualizar una tarea en el estado
    const toggleCompleted = async (id: string) => {
        try {
            const updatedTasks = tasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            );
            setTasks(updatedTasks);

            const task = updatedTasks.find(task => task.id === id)
            if (task) {
                await updateTask(task)
            }
            const stats = await getUserStats();
            await updateUserStats({ tasksCompleted: stats.tasksCompleted + 1 });
            await evaluateTrophies();
        } catch (error) {
            console.error("Error al actualizar la tarea", error);
        }
    };

    // Definición de los encabezados personalizados para cada filtro
    const customHeaders: Record<Exclude<FilterOption, null>, string> = {
        today: 'Tareas para hoy',
        week: 'Tareas para esta semana',
        month: 'Tareas para este mes',
        later: 'Tareas para después',
    };

    // console.log(Dimensions.get('window').width * 0.5)
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                {filter ? customHeaders[filter] : ''}
            </Text>

            {/* Barra de progreso */}
            <ProgressBarComponent completed={completedTasks} total={filteredTasks.length} />

            {/* Filtros con chips */}
            <View style={{ height: "auto", marginBottom: 10 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
                    {filters.map(f => (
                        <ChipFilter
                            key={f.value}
                            label={f.label}
                            selected={filter === f.value}
                            onSelect={() => setFilter(f.value)}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Lista de tareas filtradas y separadas */}
            <ScrollView style={{ flex: 1 }}>
                {filteredTasks.length === 0 && (
                    <Text style={{ textAlign: 'center', marginTop: 32, fontStyle: 'italic' }}>
                        No hay tareas para esta categoría.
                    </Text>
                )}
                <TextDivider showComponente={hasTasksIncompleted} text="Pendientes" />
                {filteredTasksIncompleted.map((task: Task) => (
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: 'timing' }}
                        key={task.id}
                    >
                        <Link
                            key={task.id}
                            href={{ pathname: `../home/${task.id}`, params: { id: task.id } }}
                            asChild
                        >
                            <Pressable>
                                <TaskComponent task={task} onCheck={() => toggleCompleted(task.id)} />
                            </Pressable>
                        </Link>
                    </MotiView>
                ))}
                <TextDivider showComponente={hasTasksCompleted} text="Completadas" />
                {filteredTasksCompleted.map((task: Task) => (
                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: 'timing' }}
                        key={task.id}
                    >
                        <Link
                            key={task.id}
                            href={{ pathname: `../home/${task.id}`, params: { id: task.id } }}
                            asChild
                        >
                            <Pressable>
                                <TaskComponent task={task} onCheck={() => toggleCompleted(task.id)} />
                            </Pressable>
                        </Link>
                    </MotiView>
                ))}
            </ScrollView>

            {/* Botón flotante para nueva tarea */}

            <FAB
                icon={props => <Icon name="plus" {...props} />}
                color="white"
                onPress={() => router.push("/modals/newTask")}
                style={{
                    position: 'absolute',
                    backgroundColor: "#6200ee",
                    borderRadius: 50,
                    bottom: 16,
                    left: Dimensions.get('window').width - 56 - 16,
                }}
            />

        </View>
    );
}