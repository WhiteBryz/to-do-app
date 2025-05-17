import tickSound from '@/assets/sounds/tick.mp3';
import CustomToast from '@/components/CustomToast';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/context/ThemeContext';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useSound } from '@/hooks/useSound';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';


export default function Settings() {
  const router = useRouter();
  const {
    darkMode,
    muteNotifications,
    muteSounds,
    setSetting,
  } = useSettings();

  const { playSound } = useSound();
  const theme = useTheme();
  const toast = useCustomToast();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Text style={[styles.header, { color: theme.text }]}>Configuración</Text>

      <SettingSwitch
        label="Modo oscuro"
        value={darkMode}
        onValueChange={(val) => {
          setSetting('darkMode', val);
          playSound(tickSound);
          toast.showToast('🌙 Modo oscuro activado', 'Ahora todo se ve más cool');
        }}
        theme={theme}
      />

      <SettingSwitch
        label="Silenciar notificaciones"
        value={muteNotifications}
        onValueChange={(val) => {
          setSetting('muteNotifications', val);
          const title = val ? '🔕 Notificaciones silenciadas' : '🔔 Notificaciones activadas';
          const message = val
            ? 'Shhh... tus notificaciones están tomando una siesta.'
            : '¡Tus notificaciones están despiertas y listas para molestar!';
            playSound(tickSound);
          toast.showToast(title, message);
        }}
        theme={theme}
      />

      <SettingSwitch
        label="Silenciar sonidos"
        value={muteSounds}
        onValueChange={(val) => {
          setSetting('muteSounds', val);
          playSound(tickSound);
          toast.showToast(
            val ? '🔇 Sonidos silenciados' : '🔊 Sonidos activados',
            val
              ? 'Nada interrumpirá tu zen.'
              : '¡Prepárate para la fiesta de sonidos!'
          );
        }}
        theme={theme}
      />
      <CustomToast
        visible={toast.visible}
        title={toast.title}
        message={toast.message}
      />
    </ScrollView>
  );
}

function SettingSwitch({
  label,
  value,
  onValueChange,
  theme,
}: {
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  theme: any;
}) {
  return (
    <View style={styles.settingRow}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
  },
});
