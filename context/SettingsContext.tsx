// context/SettingsContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Settings = {
  muteSounds: boolean;
  muteNotifications: boolean;
  darkMode: boolean;
};

type SettingsContextType = Settings & {
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
};

const defaultSettings: Settings = {
  muteSounds: false,
  muteNotifications: false,
  darkMode: false,
};

const SettingsContext = createContext<SettingsContextType>({
  ...defaultSettings,
  setSetting: () => {},
});
export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Leer al inicio
  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem('appSettings');
        if (raw) {
          setSettings(JSON.parse(raw));
        }
      } catch (err) {
        console.log('Error cargando configuración', err);
      }
    };
    load();
  }, []);

  // Guardar cuando cambia
  const setSetting = async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(updated));
    } catch (err) {
      console.log('Error guardando configuración', err);
    }
  };

  return (
    <SettingsContext.Provider value={{ ...settings, setSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
