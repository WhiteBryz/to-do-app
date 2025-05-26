import ChipFilter from "@/components/ChipFilter";
import ProgressBarComponent from "@/components/ProgressBar";
import TaskComponent from "@/components/Task";
import TextDivider from "@/components/TextDivider";
import { useTheme } from "@/context/ThemeContext";
import { useTasks } from '@/hooks/UseTasks';
import { addTask, updateTask } from "@/store/taskStore";
import { evaluateTrophies, getUserStats, updateUserStats } from '@/store/trophiesStore';
import { FilterOption, Task, filters } from '@/types/task';
import { getTaskCategories } from '@/utils/dateFilters';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { MotiView } from 'moti';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { firebaseApp } from '../../../utils/firebaseConfig'; // Asegúrate de que la ruta es correcta



export default function HomeScreen() {
    const { tasks, reload, setTasks } = useTasks();
    const [filter, setFilter] = useState<FilterOption>('today');
    const completedTasks = tasks.filter(t => t.completed).length;
    const filteredTasks = filter
        ? tasks.filter(task => getTaskCategories(task).includes(filter))
        : tasks;

    const theme = useTheme();
    const router = useRouter();
    const filteredTasksCompleted = filteredTasks.filter(task => task.completed === true)
    const filteredTasksIncompleted = filteredTasks.filter(task => task.completed === false)
    const hasTasksCompleted = filteredTasksCompleted.length > 0;
    const hasTasksIncompleted = filteredTasksIncompleted.length > 0;

    useEffect(() => {
    const auth = getAuth(firebaseApp); // ✅ Pasando la app correctamente
    const unsubscribe = onAuthStateChanged(auth, user => {
        if (!user) {
            router.replace("/login");
        }
    });

    return unsubscribe;
}, []);
    useFocusEffect(
        useCallback(() => {
            const checkFirstTime = async () => {
                const stats = await getUserStats();

                if (!stats.firstHome) {
                    await updateUserStats({ firstHome: true });
                    await evaluateTrophies(); // Revisa si se desbloqueó el trofeo
                }

                await reload(); // Carga las tareas
            };

            checkFirstTime();
        }, [])
      );

    const toggleCompleted = async (id: string) => {
        try {
            const updatedTasks = tasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            );
            setTasks(updatedTasks);

            const task = updatedTasks.find(task => task.id === id);
            if (!task) return;
            
            const isNowCompleted = task.completed;

            if (isNowCompleted && task.repeat && task.repeatInterval) {
                const newDate = new Date(task.date);

                switch (task.repeatInterval) {
                    case 'daily':
                        newDate.setDate(newDate.getDate() + 1);
                        break;
                    case 'weekly':
                        newDate.setDate(newDate.getDate() + 7);
                        break;
                    case 'monthly':
                        newDate.setMonth(newDate.getMonth() + 1);
                        break;
                    case 'yearly':
                        newDate.setFullYear(newDate.getFullYear() + 1);
                        break;
                }

                const repeatedTask: Task = {
                    ...task,
                    id: Date.now().toString(),
                    date: newDate.toISOString(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    completed: false,
                };

                await addTask(repeatedTask);

                task.repeat = false;
                task.repeatInterval = 'none';
            }

            await updateTask(task);
            const stats = await getUserStats();
            await updateUserStats({ tasksCompleted: stats.tasksCompleted + 1 });
            await evaluateTrophies();
            await reload();
        } catch (error) {
            console.error("Error al actualizar la tarea", error);
        }
    };

    const customHeaders: Record<Exclude<FilterOption, null>, string> = {
        today: 'Pendientes de hoy',
        week: 'Para esta semana',
        month: 'Este mes',
        later: 'Para después...',
    };

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: theme.background }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text }}>
                {filter ? customHeaders[filter] : ''}
            </Text>

            <ProgressBarComponent completed={filteredTasksCompleted.length} total={filteredTasks.length} />

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

            <ScrollView style={{ flex: 1 }}>
                {filteredTasks.length === 0 && (
                    <Text style={{ textAlign: 'center', marginTop: 32, fontStyle: 'italic', color: theme.secondaryText }}>
                        No hay tareas para esta categoría.
                    </Text>
                )}
                <TextDivider showComponente={hasTasksIncompleted} text="Pendientes" />
                {filteredTasksIncompleted.map((task: Task) => (
                    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing' }} key={task.id}>
                        <Link key={task.id} href={{ pathname: `../home/${task.id}`, params: { id: task.id } }} asChild>
                            <Pressable>
                                <TaskComponent task={task} onCheck={() => toggleCompleted(task.id)} />
                            </Pressable>
                        </Link>
                    </MotiView>
                ))}
                <TextDivider showComponente={hasTasksCompleted} text="Completadas" />
                {filteredTasksCompleted.map((task: Task) => (
                    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing' }} key={task.id}>
                        <Link key={task.id} href={{ pathname: `../home/${task.id}`, params: { id: task.id } }} asChild>
                            <Pressable>
                                <TaskComponent task={task} onCheck={() => toggleCompleted(task.id)} />
                            </Pressable>
                        </Link>
                    </MotiView>
                ))}
            </ScrollView>

            <FAB
                icon={props => <Icon name="plus" {...props} />}
                color="white"
                onPress={() => router.push("/modals/newTask")}
                style={{
                    position: 'absolute',
                    backgroundColor: theme.primary,
                    borderRadius: 50,
                    bottom: 16,
                    left: Dimensions.get('window').width - 56 - 16,
                }}
            />
        </View>
    );
}
