import { getAllTasksAsyncStorage } from '@/store/taskStore';
import { Task } from '@/types/task';
import { useEffect, useState } from 'react';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTasks = async () => {
        const result = await getAllTasksAsyncStorage();
        setTasks(result);
        setLoading(false);
    };

    useEffect(() => {
        loadTasks();
    }, []);

    return { tasks, loading, reload: loadTasks, setTasks };
};
