import { isThisWeek, isThisMonth, parseISO } from 'date-fns';
import { Task, FilterOption } from '../types/task';

export const getTaskCategory = (task: Task): FilterOption => {
    const taskDate = parseISO(task.date);

    if (isThisWeek(taskDate, { weekStartsOn: 1 })) return 'week';
    if (isThisMonth(taskDate)) return 'month';

    return 'later';
};
