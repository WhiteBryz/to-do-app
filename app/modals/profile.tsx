import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import WheelColorPicker from 'react-native-wheel-color-picker';

export default function ProfileModal() {
  const {
    username,
    profileColor,
    setSetting,
  } = useSettings();

  const theme = useTheme();
  const router = useRouter();
  const [hexInput, setHexInput] = useState(profileColor);

  useEffect(() => {
    setHexInput(profileColor);
  }, [profileColor]);

return (
  <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
      {/* Flecha de regreso */}
      <Ionicons
        name="arrow-back"
        size={28}
        color={theme.text}
        onPress={() => router.replace('/(drawer)/settings')}
        style={styles.backIcon}
      />

      <Text style={[styles.header, { color: theme.text }]}>Editar perfil</Text>

      <View style={[styles.avatar, { backgroundColor: profileColor }]}>
        <Text style={styles.avatarText}>
          {(username?.charAt(0) || '?').toUpperCase()}
        </Text>
      </View>

      <Text style={[styles.label, { color: theme.text }]}>Nombre de usuario</Text>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.primary }]}
        placeholder="Tu nombre"
        placeholderTextColor="#888"
        value={username}
        onChangeText={(text) => setSetting('username', text)}
      />

      <Text style={[styles.label, { color: theme.text, marginTop: 16 }]}>Color de perfil (HEX)</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: theme.text,
            borderColor: /^#([0-9A-Fa-f]{6})$/.test(hexInput)
              ? theme.primary
              : '#f44336',
          },
        ]}
        placeholder="#ff00ff"
        placeholderTextColor="#888"
        value={hexInput}
        onChangeText={(text) => {
          setHexInput(text);
          if (/^#([0-9A-Fa-f]{6})$/.test(text)) {
            setSetting('profileColor', text);
          }
        }}
      />

      <Text style={[styles.label, { color: theme.text, marginTop: 16 }]}>Selector de color</Text>
      <View style={styles.pickerContainer}>
        <WheelColorPicker
          color={profileColor}
          onColorChangeComplete={(color) => setSetting('profileColor', color)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  backIcon: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
  },
  input: {
    borderBottomWidth: 1,
    fontSize: 16,
    paddingVertical: 6,
    marginBottom: 12,
  },
  pickerContainer: {
    height: 220,
    marginTop: 10,
    marginBottom: 20,
  },
  avatar: {
    marginBottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
  },
});
