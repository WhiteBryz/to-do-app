export type ReminderOption = '5min' | '10min' | '30min' | '1day';
export type PriorityLevel = 'low' | 'medium' | 'high';
export type FilterOption = 'today' | 'tomorrow' | 'week' | 'all';

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
}

const filters: { label: string; value: FilterOption }[] = [
  { label: "Hoy", value: "today" },
  { label: "Mañana", value: "tomorrow" },
  { label: "Esta semana", value: "week" },
  { label: "Todas", value: "all" },
];