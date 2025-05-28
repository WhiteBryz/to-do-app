import clickSound from "@/assets/sounds/click.mp3";
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/context/ThemeContext";
import { useSound } from "@/hooks/useSound";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import WheelColorPicker from "react-native-wheel-color-picker";

export default function ProfileModal() {
  const { username, profileColor, setSetting } = useSettings();
  const [tempUsername, setTempUsername] = useState(username);
  const [hexInput, setHexInput] = useState(profileColor);
  const { 
    id,
    name,
    email,
    userRole } = useLocalSearchParams();
  //const parsedUser: GlobalUser | null = user ? JSON.parse(user as string) : null;
  console.log(id)

  // Valores de Firebase simulados 
  const [firebaseEmail, setFirebaseEmail] = useState("usuario@ejemplo.com");
  const [firebaseRole, setFirebaseRole] = useState("admin");


  const theme = useTheme();
  const router = useRouter();
  const { playSound } = useSound();

  useEffect(() => {
    setHexInput(profileColor);
    setTempUsername(username);
    setFirebaseEmail(email.toString());
    setFirebaseRole(userRole.toString())
  }, [profileColor, username]);

  const handleCancel = async () => {
    await playSound(clickSound);
    router.replace("/(drawer)/settings");
  };

  const handleConfirm = async () => {
    await playSound(clickSound);
    //if (id) await updateUserNameAndNewRole(id.toString(), tempUsername)
    router.replace("/(drawer)/settings");
  };

  return (
    <SafeAreaView
      style={[styles.modalContainer, { backgroundColor: theme.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <Text style={[styles.header, { color: theme.text }]}>Editar perfil</Text>

        <View style={[styles.avatar, { backgroundColor: hexInput }]}>
          <Text style={styles.avatarText}>
            {(tempUsername?.charAt(0) || "?").toUpperCase()}
          </Text>
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Nombre de usuario</Text>
        <TextInput
          style={[
            styles.input,
            { color: "gray", borderColor: theme.primary },
          ]}
          placeholder="Tu nombre"
          placeholderTextColor="#888"
          value={name.toString()}
          editable={false}
        />

        <Text style={[styles.label, { color: theme.text }]}>Correo</Text>
        <TextInput
          style={[styles.input, { color: "gray" }]}
          value={firebaseEmail} //Valor del correo
          editable={false}
        />

        <Text style={[styles.label, { color: theme.text }]}>Rol</Text>
        <TextInput
          style={[styles.input, { color: "gray" }]}
          value={firebaseRole} // Valor del  rol
          editable={false}
        />

        <Text style={[styles.label, { color: theme.text, marginTop: 16 }]}>
          Color de perfil (HEX)
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: /^#([0-9A-Fa-f]{6})$/.test(hexInput)
                ? theme.primary
                : "#f44336",
            },
          ]}
          placeholder="#ff00ff"
          placeholderTextColor="#888"
          value={hexInput}
          onChangeText={setHexInput}
        />

        <Text style={[styles.label, { color: theme.text, marginTop: 16 }]}>
          Selector de color
        </Text>
        <View style={styles.pickerContainer}>
          <WheelColorPicker
            color={hexInput}
            onColorChangeComplete={(color) => setHexInput(color)}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, { backgroundColor: "#999" }]}
            onPress={handleCancel}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </Pressable>
          <Pressable
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleConfirm}
          >
            <Text style={styles.buttonText}>Confirmar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
    marginTop: 20
  },
  label: {
    fontSize: 16,
    marginTop: 8,
  },
  input: {
    borderBottomWidth: 1,
    fontSize: 16,
    paddingVertical: 6,
    marginBottom: 12,
  },
  inputDisabled: {
    borderBottomWidth: 1,
    fontSize: 16,
    paddingVertical: 6,
    marginBottom: 12,
    backgroundColor: "#e0e0e0",
  },
  pickerContainer: {
    height: 220,
    marginTop: 10,
    marginBottom: 30,
  },
  avatar: {
    marginBottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",

  },
});
