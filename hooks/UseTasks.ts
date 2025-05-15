import { useEffect, useState } from 'react';
import { Task } from '../types/task';
import { getAllTasks } from '../store/taskStore';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTasks = async () => {
        const result = await getAllTasks();
        setTasks(result);
        setLoading(false);
    };

    useEffect(() => {
        loadTasks();
    }, []);

    return { tasks, loading, reload: loadTasks };
};
