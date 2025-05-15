import {
    endOfMonth,
    isAfter,
    isThisMonth,
    isThisWeek,
    isToday,
    parseISO
} from 'date-fns';
import { FilterOption, Task } from '../types/task';

export const getTaskCategory = (task: Task): FilterOption => {
    const taskDate = parseISO(task.date);

    if (isToday(taskDate)) return 'today';

    // Si está en esta semana (incluyendo hoy)
    if (isThisWeek(taskDate, { weekStartsOn: 1 })) return 'week';

    // Si está en este mes (incluyendo semana y hoy)
    if (isThisMonth(taskDate)) return 'month';

    // Si está después del final del mes
    if (isAfter(taskDate, endOfMonth(new Date()))) return 'later';

    return null;
};