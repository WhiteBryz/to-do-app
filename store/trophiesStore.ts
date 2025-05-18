import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trophy, UserStats } from '@/types/trophy';
import { eventBus } from '@/utils/eventBus';
import Toast from 'react-native-toast-message';

export const trophyList: Trophy[] = [
    {
        id: 'first-task',
        title: 'Primera tarea completada',
        icon: 'checkcircle', // ✔️
        unlocked: false,
        condition: (stats) => stats.tasksCompleted >= 1,
    },
    {
        id: 'ten-tasks',
        title: '10 tareas completadas',
        icon: 'staro', // ⭐ borde
        unlocked: false,
        condition: (stats) => stats.tasksCompleted >= 10,
    },
    {
        id: 'fifty-tasks',
        title: '50 tareas completadas',
        icon: 'star', // ⭐ lleno
        unlocked: false,
        condition: (stats) => stats.tasksCompleted >= 50,
    },
    {
        id: 'hundred-tasks-completed',
        title: '100 tareas completadas',
        icon: 'Trophy', // 🏆 AntDesign usa este nombre (sensible a mayúscula)
        unlocked: false,
        condition: (stats) => stats.tasksCompleted >= 100,
    },
    {
        id: 'first-created',
        title: 'Primera tarea creada',
        icon: 'pluscircle', // ➕
        unlocked: false,
        condition: (stats) => stats.tasksCreated >= 1,
    },
    {
        id: 'ten-created',
        title: '10 tareas creadas',
        icon: 'plussquare', // otra opción visual
        unlocked: false,
        condition: (stats) => stats.tasksCreated >= 10,
    },
    {
        id: 'hundred-created',
        title: '100 tareas creadas',
        icon: 'trophy', // 👈 mismo que antes
        unlocked: false,
        condition: (stats) => stats.tasksCreated >= 100,
    },
    {
        id: 'first-home',
        title: 'Primera vez en la pantalla de inicio',
        icon: 'home',
        unlocked: false,
        condition: (stats) => stats.firstHome === true,
    },
    {
        id: 'first-settings',
        title: 'Primera vez en la pantalla de configuración',
        icon: 'setting', // correcto en AntDesign
        unlocked: false,
        condition: (stats) => stats.firstSettings === true,
    },
    {
        id: 'first-trophy',
        title: 'Primera vez en la pantalla de trofeos',
        icon: 'trophy',
        unlocked: false,
        condition: (stats) => stats.firstTrophy === true,
    },
    {
        id: 'first-task-screen',
        title: 'Primera vez en la pantalla de tareas',
        icon: 'checkcircleo', // ✔️ borde
        unlocked: false,
        condition: (stats) => stats.firstTask === true,
    },
  ];

export const getUserStats = async (): Promise<UserStats> => {
    const data = await AsyncStorage.getItem('userStats');
    return data
        ? JSON.parse(data)
        : {
            tasksCompleted: 0,
            tasksCreated: 0,
            firstHome: false,
            firstSettings: false,
            firstTrophy: false,
            firstTask: false,
        };
  };

export const updateUserStats = async (update: Partial<UserStats>) => {
    const current = await getUserStats();
    const newStats = { ...current, ...update };
    await AsyncStorage.setItem('userStats', JSON.stringify(newStats));

    eventBus.emit('userStatsChanged');
    return newStats;
};

export const evaluateTrophies = async (): Promise<Trophy[]> => {
    const stats = await getUserStats();
    const evaluated = trophyList.map(trophy => ({
        ...trophy,
        unlocked: trophy.condition(stats)
    }));

    const unlockedNow = evaluated.filter(t => t.unlocked);
    const previouslyUnlockedRaw = await AsyncStorage.getItem('unlockedTrophies');
    const previouslyUnlocked = previouslyUnlockedRaw ? JSON.parse(previouslyUnlockedRaw) : [];

    //const newUnlocks = unlockedNow;
    const newUnlocks = unlockedNow.filter(t => !previouslyUnlocked.includes(t.id));

    if (newUnlocks.length > 0) {
        newUnlocks.forEach(t => {
            Toast.show({
                type: 'success',
                text1: '🏆 ¡Nuevo trofeo!',
                text2: t.title,
                position: 'top',
                visibilityTime: 4000,
            });
        });

        const allUnlockedIds = [...new Set([...previouslyUnlocked, ...newUnlocks.map(t => t.id)])];
        await AsyncStorage.setItem('unlockedTrophies', JSON.stringify(allUnlockedIds));
    }

    return evaluated;
};

export const resetUserStats = async () => {
    await AsyncStorage.removeItem('userStats');
    await AsyncStorage.removeItem('unlockedTrophies');
    eventBus.emit('userStatsChanged');
  };
