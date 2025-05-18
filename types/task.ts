export type ReminderOption = '5min' | '10min' | '30min' | '1day';
export type PriorityLevel = 'low' | 'medium' | 'high';
export type FilterOption = 'today' | 'week' | 'month' | 'later' | null;
export type RepeatInterval = 'daily' | 'weekly' | 'monthly' | 'yearly' | '';

export interface Task {
  id: string;
  title: string;
  description: string;
  note: string;
  date: string; // ISO string
  time: string; // HH:mm
  priority: PriorityLevel;
  reminder: ReminderOption;
  repeat: boolean;
  repeatInterval?: RepeatInterval; // ← nuevo campo opcional
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const filters: { label: string; value: FilterOption }[] = [
  { label: 'Hoy', value: 'today' },
  { label: 'Esta semana', value: 'week' },
  { label: 'Este mes', value: 'month' },
  { label: 'Después', value: 'later' },
];