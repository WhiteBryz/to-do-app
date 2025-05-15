import { useEffect, useState } from 'react';
import { Task } from '../types/task';
import { getAllTasks } from '../store/taskStore';
import { useFocusEffect } from 'expo-router';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTasks = async () => {
        const result = await getAllTasks();
        setTasks(result);
        setLoading(false);
    };

    // Ejecutar al montar y cada vez que se vuelve a enfocar la pantalla
    useFocusEffect(() => {
        loadTasks();
    });

    return { tasks, loading, reload: loadTasks };
};
