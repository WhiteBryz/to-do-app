import ChipFilter from "@/components/ChipFilter";
import TaskComponent from "@/components/Task";
import { useTasks } from "@/hooks/UseTasks";
import { updateTask } from "@/store/taskStore";
import { evaluateTrophies, getUserStats, updateUserStats } from "@/store/trophiesStore";
import { Task } from "@/types/task";
import { isBefore, startOfToday, parseISO } from "date-fns";
import { Link, useFocusEffect } from "expo-router";
import { MotiView } from "moti";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

type HistoryFilter = 'pending' | 'completed';

export default function HistoryScreen() {
    const { tasks, reload, setTasks } = useTasks();
    const [filter, setFilter] = useState<HistoryFilter>('pending');

    useFocusEffect(
        useCallback(() => {
            reload();
        }, [])
    );

    const pastTasks = tasks.filter(task =>
        isBefore(parseISO(task.date), startOfToday())
    );

    const filteredTasks = pastTasks.filter(task =>
        filter === 'pending' ? !task.completed : task.completed
    );

    const toggleCompleted = async (id: string) => {
        try {
            const updatedTasks = tasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            );
            setTasks(updatedTasks);

            const task = updatedTasks.find(task => task.id === id);
            if (task) await updateTask(task);

            const stats = await getUserStats();
            await updateUserStats({ tasksCompleted: stats.tasksCompleted + 1 });
            await evaluateTrophies();
        } catch (error) {
            console.error("Error al actualizar la tarea", error);
        }
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
                Historial de tareas
            </Text>

            {/* Chips */}
            <View style={{ height: "auto", marginBottom: 10 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
                    <ChipFilter
                        label="Pendientes"
                        selected={filter === 'pending'}
                        onSelect={() => setFilter('pending')}
                    />
                    <ChipFilter
                        label="Completadas"
                        selected={filter === 'completed'}
                        onSelect={() => setFilter('completed')}
                    />
                </ScrollView>
            </View>

            {/* Lista de tareas */}
            <ScrollView style={{ flex: 1 }}>
                {filteredTasks.length === 0 ? (
                    <Text style={{ textAlign: "center", marginTop: 32, fontStyle: "italic" }}>
                        No hay tareas {filter === 'pending' ? 'pendientes' : 'completadas'}.
                    </Text>
                ) : (
                    filteredTasks.map((task: Task) => (
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ type: "timing" }}
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
                    ))
                )}
            </ScrollView>
        </View>
    );
}