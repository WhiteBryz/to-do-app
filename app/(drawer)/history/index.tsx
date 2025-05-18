import TextDivider from "@/components/TextDivider";
import TaskComponent from "@/components/Task";
import { useTasks } from "@/hooks/UseTasks";
import { updateTask } from "@/store/taskStore";
import { evaluateTrophies, getUserStats, updateUserStats } from "@/store/trophiesStore";
import { Task } from "@/types/task";
import { isBefore, startOfToday, parseISO } from "date-fns";
import { Link, useFocusEffect } from "expo-router";
import { MotiView } from "moti";
import { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function HistoryScreen() {
    const { tasks, reload, setTasks } = useTasks();

    useFocusEffect(
        useCallback(() => {
            reload();
        }, [])
    );

    // Filtrar tareas cuya fecha sea antes de hoy
    const pastTasks = tasks.filter(task =>
        isBefore(parseISO(task.date), startOfToday())
    );

    const pastTasksCompleted = pastTasks.filter(t => t.completed);
    const pastTasksIncompleted = pastTasks.filter(t => !t.completed);

    const toggleCompleted = async (id: string) => {
        try {
            const updatedTasks = tasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            );
            setTasks(updatedTasks);

            const task = updatedTasks.find(task => task.id === id);
            if (task) {
                await updateTask(task);
            }

            const stats = await getUserStats();
            await updateUserStats({ tasksCompleted: stats.tasksCompleted + 1 });
            await evaluateTrophies();
        } catch (error) {
            console.error("Error al actualizar la tarea", error);
        }
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
                Historial de tareas
            </Text>

            <ScrollView style={{ flex: 1 }}>
                {pastTasks.length === 0 && (
                    <Text style={{ textAlign: "center", marginTop: 32, fontStyle: "italic" }}>
                        No hay tareas pasadas registradas.
                    </Text>
                )}

                <TextDivider showComponente={pastTasksIncompleted.length > 0} text="Pendientes" />
                {pastTasksIncompleted.map((task: Task) => (
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
                ))}

                <TextDivider showComponente={pastTasksCompleted.length > 0} text="Completadas" />
                {pastTasksCompleted.map((task: Task) => (
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
                ))}
            </ScrollView>
        </View>
    );
}
