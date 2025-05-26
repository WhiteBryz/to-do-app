export type ReminderOption = 'none' | '5min' | '10min' | '30min' | '1day';
export type PriorityLevel = 'low' | 'medium' | 'high';
export type FilterOption = 'today' | 'week' | 'month' | 'later' | null;
export type RepeatInterval = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Task {
  id: string;
  createdBy: string, // ID del usuario que creó la tarea
  assignedTo?: string; // ID del usuario
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
  completedBy?: string;
  createdAt: string;
  updatedAt: string;
  idNotification?:string; // ID de la notificación programada
  idNotificationReminder?:string; // ID de la notificación de recordatorio
}

export const filters: { label: string; value: FilterOption }[] = [
  { label: 'Hoy', value: 'today' },
  { label: 'Esta semana', value: 'week' },
  { label: 'Este mes', value: 'month' },
  { label: 'Después', value: 'later' },
];