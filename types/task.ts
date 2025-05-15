export type ReminderOption = '5min' | '10min' | '30min' | '1day';
export type PriorityLevel = 'low' | 'medium' | 'high';
export type FilterOption = 'today' | 'week' | 'month' | 'later' | null;

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
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const filters: { label: string; value: FilterOption }[] = [
  { label: 'Hoy', value: 'today' },
  { label: 'Esta semana', value: 'week' },
  { label: 'Este mes', value: 'month' },
  { label: 'Después', value: 'later' },
];