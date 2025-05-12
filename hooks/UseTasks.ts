// hooks/useTasks.ts
import { isThisWeek, isToday, isTomorrow } from 'date-fns';
import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

export default function useTasks() {
    const context = useContext(TaskContext);

    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }

    const { tasks, filter, setFilter, ...rest } = context;

    // Filtrar tareas según el filtro seleccionado
    function getFilteredTasks() {
        const today = new Date();

        switch (filter) {
            case 'today':
                return tasks.filter(task => isToday(new Date(task.date)));
            case 'tomorrow':
                return tasks.filter(task => isTomorrow(new Date(task.date)));
            case 'week':
                return tasks.filter(task => isThisWeek(new Date(task.date), { weekStartsOn: 1 }));
            case 'all':
            default:
                return tasks;
        }
    };

    // Contar tareas completadas
    const completedTasks = tasks.filter(task => task.completed).length;

    // Obtener tareas para la vista de detalle
    function getTaskById(id: string)  {
        return tasks.find(task => task.id === id);
    };

    // Marcar tarea como completada/incompleta
    function toggleTaskCompletion(id: string) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            rest.updateTask(id, { completed: !task.completed });
        }
    };

    return {
        tasks,
        filteredTasks: getFilteredTasks(),
        filter,
        completedTasks,
        totalTasks: tasks.length,
        getTaskById,
        toggleTaskCompletion,
        setFilter,
        //...rest,
    };
};