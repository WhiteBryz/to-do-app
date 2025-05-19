// hooks/useSound.ts
import { useSettings } from '@/context/SettingsContext';
import { Audio } from 'expo-av';
import { useCallback } from 'react';

export const useSound = () => {
  const { muteSounds } = useSettings();

  const playSound = useCallback(async (soundFile: any) => {
    if (muteSounds) return; // no reproducir si está silenciado

    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  }, [muteSounds]);

  return { playSound };
};
