import { addTask } from "@/store/taskStore";
import { Task } from "@/types/task";

interface newAutomaticTaskProps {
    task: Task;
    isNowCompleted: boolean;
}

// Código para generar una nueva tarea cuando se vaya a repetir. Se crea en automático cuando se marca como completado la tarea
export async function createNewAutomaticTask({task, isNowCompleted}:newAutomaticTaskProps): Promise<boolean> {
    
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

        // Confirmar creación de nueva tarea
        return true;
    }

    // No pasó las pruebas
    return false;
}