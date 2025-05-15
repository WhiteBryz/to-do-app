import { isToday, isTomorrow, isThisWeek, parseISO } from 'date-fns';
import { Task, FilterOption } from '../types/task';

export const getTaskCategory = (task: Task): FilterOption => {
    const taskDate = parseISO(task.date);
    if (isToday(taskDate)) return 'today';
    if (isTomorrow(taskDate)) return 'tomorrow';
    if (isThisWeek(taskDate, { weekStartsOn: 1 })) return 'week';
    return 'all';
};
