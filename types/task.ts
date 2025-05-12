export type ReminderOption = '5min' | '10min' | '30min' | '1day' | null;
export type RepeatOption = 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string; // Formato ISO (ej: "2023-05-15T10:00:00.000Z")
  time?: string; // Formato HH:mm (ej: "14:30")
  completed: boolean;
  reminder?: ReminderOption;
  repeat?: RepeatOption;
  category?: string;
  priority?: PriorityLevel;
  createdAt: string; // Fecha de creación en formato ISO
  updatedAt?: string; // Fecha de última actualización en formato ISO
}

export interface TaskFormValues
  extends Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'> {
  id?: string; // Opcional para edición
  completed?: boolean; // Opcional para edición
}

export type FilterOption = 'today' | 'tomorrow' | 'week' | 'all';