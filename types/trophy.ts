export type Trophy = {
    id: string;
    title: string;
    icon: string; // Puede ser un nombre de icono de @expo/vector-icons
    unlocked: boolean;
    condition: (stats: UserStats) => boolean; // función que determina si se desbloquea
  };

export type UserStats = {
    tasksCompleted: number;
    tasksCreated: number;
    firstHome: boolean;
    firstSettings: boolean;
    firstTrophy: boolean;
    firstTask: boolean;
  };