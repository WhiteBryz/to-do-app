import { Task } from "@/types/task";
import { isThisMonth, isThisWeek, parseISO } from "date-fns";

export function getWeeklyProgress(tasks: Task[]): number {
  const weekTasks = tasks.filter((t) =>
    isThisWeek(parseISO(t.date), { weekStartsOn: 1 })
  );
  const completed = weekTasks.filter((t) => t.completed).length;
  return weekTasks.length ? (completed / weekTasks.length) * 100 : 0;
}

export function getMonthlyProgress(tasks: Task[]): number {
  const monthTasks = tasks.filter((t) => isThisMonth(parseISO(t.date)));
  const completed = monthTasks.filter((t) => t.completed).length;
  return monthTasks.length ? (completed / monthTasks.length) * 100 : 0;
}

export function getMostProductiveDay(tasks: Task[]): string {
  const completedTasks = tasks.filter((t) => t.completed);
  const daysCount = completedTasks.reduce((acc, task) => {
    const date = new Date(task.date).toDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostProductiveDay = Object.entries(daysCount).reduce(
    (prev, curr) => (curr[1] > prev[1] ? curr : prev),
    ["", 0]
  );

  return mostProductiveDay[0];
}
