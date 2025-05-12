import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { FilterOption, Task, TaskFormValues } from '../types/task';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: TaskFormValues) => void;
  updateTask: (id: string, task: Partial<TaskFormValues>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  filter: FilterOption;
  setFilter: (filter: FilterOption) => void;
  isLoading: boolean;
  getTaskById: (id: string) => Task | undefined;
}

export const TaskContext = createContext<TaskContextType>({
  tasks: [],
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  toggleTaskCompletion: () => {},
  filter: 'today',
  setFilter: () => {},
  isLoading: true,
  getTaskById: () => undefined,
});

const STORAGE_KEY = '@TodoApp:tasks';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterOption>('today');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar tareas desde AsyncStorage al iniciar
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Guardar tareas en AsyncStorage cuando cambian
  useEffect(() => {
    const saveTasks = async () => {
      if (!isLoading) {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
          console.error('Error saving tasks:', error);
        }
      }
    };

    saveTasks();
  }, [tasks, isLoading]);


  const addTask = useCallback((task: TaskFormValues) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...task,
      id: Crypto.randomUUID(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<TaskFormValues>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const toggleTaskCompletion = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  }, []);

  const getTaskById = useCallback(
    (id: string) => tasks.find(task => task.id === id),
    [tasks]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        filter,
        setFilter,
        isLoading,
        getTaskById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};