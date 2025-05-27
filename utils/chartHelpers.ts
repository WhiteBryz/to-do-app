import { Task } from "@/types/task";
import { isThisMonth, isThisWeek, parseISO, isValid } from "date-fns";

// Función helper para validar y parsear fechas de forma segura
function safeParseDateString(dateString: string | null | undefined): Date | null {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }
  
  try {
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate) ? parsedDate : null;
  } catch (error) {
    console.warn('Error parsing date in chartHelpers:', dateString, error);
    return null;
  }
}

// Función helper para validar tareas
function validateTasks(tasks: Task[] | null | undefined): Task[] {
  if (!tasks || !Array.isArray(tasks)) {
    return [];
  }
  
  // Filtrar tareas que tienen fechas válidas
  return tasks.filter(task => 
    task && 
    typeof task === 'object' && 
    task.date && 
    typeof task.date === 'string'
  );
}

export function getWeeklyProgress(tasks: Task[]): number {
  try {
    const validTasks = validateTasks(tasks);
    
    if (validTasks.length === 0) {
      return 0;
    }

    const weekTasks = validTasks.filter((t) => {
      const parsedDate = safeParseDateString(t.date);
      if (!parsedDate) return false;
      
      try {
        return isThisWeek(parsedDate, { weekStartsOn: 1 });
      } catch (error) {
        console.warn('Error checking if date is this week:', t.date, error);
        return false;
      }
    });

    if (weekTasks.length === 0) {
      return 0;
    }

    const completed = weekTasks.filter((t) => t.completed).length;
    const progress = (completed / weekTasks.length) * 100;
    
    // Asegurar que el resultado sea un número válido
    return isNaN(progress) ? 0 : Math.max(0, Math.min(100, progress));
  } catch (error) {
    console.error('Error in getWeeklyProgress:', error);
    return 0;
  }
}

export function getMonthlyProgress(tasks: Task[]): number {
  try {
    const validTasks = validateTasks(tasks);
    
    if (validTasks.length === 0) {
      return 0;
    }

    const monthTasks = validTasks.filter((t) => {
      const parsedDate = safeParseDateString(t.date);
      if (!parsedDate) return false;
      
      try {
        return isThisMonth(parsedDate);
      } catch (error) {
        console.warn('Error checking if date is this month:', t.date, error);
        return false;
      }
    });

    if (monthTasks.length === 0) {
      return 0;
    }

    const completed = monthTasks.filter((t) => t.completed).length;
    const progress = (completed / monthTasks.length) * 100;
    
    // Asegurar que el resultado sea un número válido
    return isNaN(progress) ? 0 : Math.max(0, Math.min(100, progress));
  } catch (error) {
    console.error('Error in getMonthlyProgress:', error);
    return 0;
  }
}

export function getProductivity(tasks: Task[]): number {
  try {
    const validTasks = validateTasks(tasks);
    
    if (validTasks.length === 0) {
      return 0;
    }

    const completedTasks = validTasks.filter((t) => t.completed);
    const totalTasks = validTasks.length;
    
    if (totalTasks === 0) {
      return 0;
    }

    const productivity = (completedTasks.length / totalTasks) * 100;
    
    // Asegurar que el resultado sea un número válido
    return isNaN(productivity) ? 0 : Math.max(0, Math.min(100, productivity));
  } catch (error) {
    console.error('Error in getProductivity:', error);
    return 0;
  }
}

export function getMostProductiveDay(tasks: Task[]): string {
  try {
    const validTasks = validateTasks(tasks);
    
    if (validTasks.length === 0) {
      return "";
    }

    const completedTasks = validTasks.filter((t) => t.completed);
    
    if (completedTasks.length === 0) {
      return "";
    }

    const daysCount = completedTasks.reduce((acc, task) => {
      const parsedDate = safeParseDateString(task.date);
      if (!parsedDate) return acc;
      
      try {
        const dateString = parsedDate.toDateString();
        acc[dateString] = (acc[dateString] || 0) + 1;
        return acc;
      } catch (error) {
        console.warn('Error converting date to string:', task.date, error);
        return acc;
      }
    }, {} as Record<string, number>);

    const entries = Object.entries(daysCount);
    
    if (entries.length === 0) {
      return "";
    }

    const mostProductiveDay = entries.reduce(
      (prev, curr) => (curr[1] > prev[1] ? curr : prev),
      ["", 0]
    );

    return mostProductiveDay[0] || "";
  } catch (error) {
    console.error('Error in getMostProductiveDay:', error);
    return "";
  }
}

type DiaSemana = "lunes" | "martes" | "miércoles" | "jueves" | "viernes" | "sábado" | "domingo";

export function getProductivityPerDay(tasks: any[]): Record<DiaSemana, { total: number; completed: number }> {
  // Inicializar con valores por defecto
  const productivity: Record<DiaSemana, { total: number; completed: number }> = {
    lunes: { total: 0, completed: 0 },
    martes: { total: 0, completed: 0 },
    miércoles: { total: 0, completed: 0 },
    jueves: { total: 0, completed: 0 },
    viernes: { total: 0, completed: 0 },
    sábado: { total: 0, completed: 0 },
    domingo: { total: 0, completed: 0 },
  };

  try {
    const validTasks = validateTasks(tasks);
    
    if (validTasks.length === 0) {
      return productivity;
    }

    const dias: DiaSemana[] = [
      "domingo", 
      "lunes", 
      "martes", 
      "miércoles", 
      "jueves", 
      "viernes", 
      "sábado"
    ];

    validTasks.forEach((task) => {
      const parsedDate = safeParseDateString(task.date);
      if (!parsedDate) return;

      try {
        const dayIndex = parsedDate.getDay();
        const day = dias[dayIndex];
        
        if (day && productivity[day]) {
          productivity[day].total++;
          if (task.completed) {
            productivity[day].completed++;
          }
        }
      } catch (error) {
        console.warn('Error processing task date:', task.date, error);
      }
    });

    return productivity;
  } catch (error) {
    console.error('Error in getProductivityPerDay:', error);
    return productivity;
  }
}

// Función adicional para debugging - puedes eliminarla después
export function debugTasks(tasks: Task[]): void {
  console.log('=== DEBUG TASKS ===');
  console.log('Total tasks:', tasks?.length || 0);
  
  if (tasks && Array.isArray(tasks)) {
    tasks.forEach((task, index) => {
      if (!task) {
        console.log(`Task ${index}: NULL/UNDEFINED`);
        return;
      }
      
      const dateValid = safeParseDateString(task.date) !== null;
      console.log(`Task ${index}:`, {
        id: task.id,
        title: task.title?.substring(0, 20) + '...',
        date: task.date,
        dateValid,
        completed: task.completed
      });
    });
  }
  console.log('===================');
}