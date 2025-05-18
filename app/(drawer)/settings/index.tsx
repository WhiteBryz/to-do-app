import clickSound from '@/assets/sounds/click.mp3';
import tickSound from '@/assets/sounds/tick.mp3';
import CustomToast from '@/components/CustomToast';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/context/ThemeContext';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useSound } from '@/hooks/useSound';
import { resetUserStats } from '@/store/trophiesStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

export default function Settings() {
  const router = useRouter();
  const {
    darkMode,
    muteNotifications,
    muteSounds,
    setSetting,
    resetSettings,
    username,
    profileColor,
  } = useSettings();

  const { playSound } = useSound();
  const theme = useTheme();
  const toast = useCustomToast();

  const confirmReset = () => {
    Alert.alert(
      '¿Eliminar todo?',
      'Esto borrará tareas, logros y configuraciones. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar todo',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            await resetUserStats();
            await resetSettings();
            toast.showToast('🗑 Todo borrado', 'Se reinició el almacenamiento local');
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Text style={[styles.header, { color: theme.text }]}>Configuración</Text>

      <Pressable
        style={[styles.settingRow, styles.profileRow]}
        onPress={async () => {
          await playSound(clickSound);
          router.push('../../modals/profile');
        }}
      >
        <Text style={[styles.label, { color: theme.text }]}>Editar perfil</Text>
        <View style={[styles.avatarMini, { backgroundColor: profileColor }]}>
          <Text style={styles.avatarTextMini}>
            {(username?.charAt(0) || '?').toUpperCase()}
          </Text>
        </View>
      </Pressable>

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

      <Pressable
        onPress={confirmReset}
        style={{
          marginTop: 30,
          padding: 12,
          backgroundColor: '#ff4d4d',
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Eliminar todo</Text>
      </Pressable>

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
  profileRow: {
    marginBottom: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  avatarTextMini: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
