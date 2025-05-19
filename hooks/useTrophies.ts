import { useEffect, useState } from 'react';
import { evaluateTrophies } from '@/store/trophiesStore';
import { Trophy } from '@/types/trophy';
import { eventBus } from '@/utils/eventBus';

export const useTrophies = () => {
    const [trophies, setTrophies] = useState<Trophy[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTrophies = async () => {
        const result = await evaluateTrophies();
        setTrophies(result);
        setLoading(false);
    };

    useEffect(() => {
        loadTrophies();

        const onStatsChanged = () => loadTrophies();
        eventBus.subscribe('userStatsChanged', onStatsChanged);

        return () => {
            eventBus.unsubscribe('userStatsChanged', onStatsChanged);
        };
    }, []);

    return { trophies, loading };
};
