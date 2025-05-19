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

export function getProductivity(tasks: Task[]): number {
  const completedTasks = tasks.filter((t) => t.completed);
  const totalTasks = tasks.length;
  return totalTasks ? (completedTasks.length / totalTasks) * 100 : 0;
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

type DiaSemana = "lunes" | "martes" | "miércoles" | "jueves" | "viernes" | "sábado" | "domingo";

export function getProductivityPerDay(tasks: any[]) {
  const productivity: Record<DiaSemana, { total: number; completed: number }> = {
    lunes: { total: 0, completed: 0 },
    martes: { total: 0, completed: 0 },
    miércoles: { total: 0, completed: 0 },
    jueves: { total: 0, completed: 0 },
    viernes: { total: 0, completed: 0 },
    sábado: { total: 0, completed: 0 },
    domingo: { total: 0, completed: 0 },
  };

  const dias: DiaSemana[] = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  tasks.forEach((task) => {
    const date = parseISO(task.date);
    const day = dias[date.getDay()];
    if (day && productivity[day]) {
      productivity[day].total++;
      if (task.completed) productivity[day].completed++;
    }
  });

  return productivity;
}

