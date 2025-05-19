import { Task } from '@/types/task';
import { deleteNotificationById, scheduleTodoNotification } from '@/utils/handleNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'tasks';

export const getAllTasks = async (): Promise<Task[]> => {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
};

export const saveAllTasks = async (tasks: Task[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const addTask = async (task: Task) => {
  // Añadir lógica para programar la notificación
  if(task.reminder !== 'none') {
    task.idNotificationReminder = await scheduleTodoNotification({ task, isReminder: true }) as string;
  }
  task.idNotification = await scheduleTodoNotification({ task, isReminder: false }) as string;
  
  // Guardar la tarea en el almacenamiento
  const tasks = await getAllTasks();
  tasks.push(task);
  await saveAllTasks(tasks);
};

export const updateTask = async (updatedTask: Task) => {
  // Cancelar la notificación anterior
  await deleteNotificationById(updatedTask);

  if(!updatedTask.completed){
    // Añadir lógica para programar la notificación
    if(updatedTask.reminder !== 'none') {
      updatedTask.idNotificationReminder = await scheduleTodoNotification({ task:updatedTask, isReminder: true }) as string;
    }
    updatedTask.idNotification = await scheduleTodoNotification({ task:updatedTask, isReminder: false }) as string;
  }

  const tasks = await getAllTasks();
  const newTasks = tasks.map(t => (t.id === updatedTask.id ? updatedTask : t));
  await saveAllTasks(newTasks);
};

export const deleteTask = async (id: string) => {
  const tasks = await getAllTasks();
  const newTasks = tasks.filter(t => t.id !== id);
  await saveAllTasks(newTasks);
};

export const findTaskById = async (id: string): Promise<Task | undefined> => {
  const tasks = await getAllTasks();
  return tasks.find(t => t.id === id);
};

export const searchTasks = async (query: string): Promise<Task[]> => {
  const tasks = await getAllTasks();
  return tasks.filter(t =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.description.toLowerCase().includes(query.toLowerCase())
  );
};