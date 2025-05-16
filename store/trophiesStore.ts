import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trophy, UserStats } from '@/types/trophy';
import { eventBus } from '@/utils/eventBus';
import Toast from 'react-native-toast-message';

export const trophyList: Trophy[] = [
    {
        id: 'first-task',
        title: 'Primera tarea completada',
        icon: 'checkcircle',
        unlocked: false,
        condition: (stats: UserStats) => stats.tasksCompleted >= 1
    },
    {
        id: 'ten-tasks',
        title: '10 tareas completadas',
        icon: 'star',
        unlocked: false,
        condition: (stats: UserStats) => stats.tasksCompleted >= 10
    },
    {
        id: 'first-created',
        title: 'Primera tarea creada',
        icon: 'pluscircle',
        unlocked: false,
        condition: (stats: UserStats) => stats.tasksCreated >= 1
    }
];

export const getUserStats = async (): Promise<UserStats> => {
    const data = await AsyncStorage.getItem('userStats');
    return data ? JSON.parse(data) : { tasksCompleted: 0, tasksCreated: 0 };
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
