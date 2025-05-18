// context/SettingsContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Settings = {
  darkMode: boolean;
  muteSounds: boolean;
  muteNotifications: boolean;
  offlineMode: boolean;
  username: string;
  profileColor: string;
};

type SettingsContextType = Settings & {
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
};

const defaultSettings: Settings = {
  darkMode: false,
  muteSounds: false,
  muteNotifications: false,
  offlineMode: false,
  username: 'Usuario',
  profileColor: '#6200EE',
};

const SettingsContext = createContext<SettingsContextType>({
  ...defaultSettings,
  setSetting: () => {},
  resetSettings: () => {},
});

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const load = async () => {
      const raw = await AsyncStorage.getItem('appSettings');
      if (raw) setSettings(JSON.parse(raw));
    };
    load();
  }, []);

 const setSetting = async <K extends keyof Settings>(key: K, value: Settings[K]) => {
  setSettings(prev => {
    const updated = { ...prev, [key]: value };
    AsyncStorage.setItem('appSettings', JSON.stringify(updated)); // no await aquí
    return updated;
  });
};


  const resetSettings = async () => {
    await AsyncStorage.removeItem('appSettings');
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ ...settings, setSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
