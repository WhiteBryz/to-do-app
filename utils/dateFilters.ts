import {
    endOfMonth,
    isAfter,
    isThisMonth,
    isThisWeek,
    isToday,
    parseISO
} from 'date-fns';
import { FilterOption, Task } from '../types/task';

export const getTaskCategories = (task: Task): FilterOption[] => {
    const taskDate = parseISO(task.date);
    const categories: FilterOption[] = [];

    if (isToday(taskDate)) categories.push('today', 'week', 'month');
    else if (isThisWeek(taskDate, { weekStartsOn: 1 })) categories.push('week', 'month');
    else if (isThisMonth(taskDate)) categories.push('month');
    else if (isAfter(taskDate, endOfMonth(new Date()))) categories.push('later');

    return categories;
};
