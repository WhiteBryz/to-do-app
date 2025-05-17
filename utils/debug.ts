// debug.ts
import { updateUserStats, getUserStats } from '@/store/trophiesStore';

if (typeof window !== 'undefined') {
    // Para acceder desde consola del navegador
    (window as any).updateUserStats = updateUserStats;
    (window as any).getUserStats = getUserStats;
}