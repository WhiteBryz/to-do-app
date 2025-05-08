import { create } from 'zustand';
// import { v4 as uuidv4 } from 'crypto';
import { addDays } from 'date-fns';

// Define the Task type
export interface Task {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string format
  time?: string; // 24-hour format HH:MM
  reminder?: 'none' | '5min' | '10min' | '30min' | '1day';
  repeat?: boolean;
  completed: boolean;
  hasReminder: boolean;
}

// Define the store state
interface TaskState {
  tasks: Task[];
  loading: boolean;
  
  // Actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

// Create some sample tasks for initial state
const today = new Date();
const tomorrow = addDays(today, 1);
const nextWeek = addDays(today, 7);

const initialTasks: Task[] = [
  {
    id: "1",
    title: 'Complete project presentation',
    description: 'Finish slides and practice delivery',
    date: today.toISOString(),
    time: '14:30',
    reminder: '30min',
    completed: false,
    hasReminder: true,
  },
  {
    id: "2",
    title: 'Grocery shopping',
    description: 'Buy fruits, vegetables, and bread',
    date: today.toISOString(),
    time: '18:00',
    reminder: 'none',
    completed: true,
    hasReminder: false,
  },
  {
    id: "3",
    title: 'Call dentist for appointment',
    description: '',
    date: tomorrow.toISOString(),
    time: '10:00',
    reminder: '10min',
    completed: false,
    hasReminder: true,
  },
  {
    id: "4",
    title: 'Team meeting',
    description: 'Weekly sprint planning',
    date: tomorrow.toISOString(),
    time: '09:30',
    reminder: '5min',
    repeat: true,
    completed: false,
    hasReminder: true,
  },
  {
    id: "5",
    title: 'Submit monthly report',
    description: 'Prepare financial summary and send to finance department',
    date: nextWeek.toISOString(),
    time: '17:00',
    reminder: '1day',
    completed: false,
    hasReminder: true,
  },
];

// Create the store
export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: initialTasks,
  loading: false,
  
  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: initialTasks.length.toString()+1,
    };
    
    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));
  },
  
  updateTask: (updatedTask) => {
    set((state) => ({
      tasks: state.tasks.map((task) => 
        task.id === updatedTask.id ? updatedTask : task
      ),
    }));
  },
  
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },
  
  toggleTaskCompletion: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
  },
  
  getTaskById: (id) => {
    return get().tasks.find((task) => task.id === id);
  },
}));