import { isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import { Task, FilterOption } from '../types/task';

export const getTaskCategory = (task: Task): FilterOption => {
    const taskDate = parseISO(task.date);
    if (isToday(taskDate)) {
        return 'today'; // incluye hora
    }

    if (isThisWeek(taskDate, { weekStartsOn: 1 })) {
        return 'week'; // incluye hoy
    }

    if (isThisMonth(taskDate)) {
        return 'month'; // incluye semana
    }

    return 'later';
};
