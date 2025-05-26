// app/(auth)/register.tsx
import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import { auth } from "../../utils/firebaseConfig"; // Asegúrate de que la ruta es correcta

export default function RegisterScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const theme = useTheme();

    const handleRegister = async () => {
    try {
        setError("");

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardar el token o UID si lo necesitas
        await AsyncStorage.setItem("userToken", user.uid);

        Toast.show({
            type: "success",
            text1: "Registro exitoso",
            text2: "Ahora puedes iniciar sesión",})

        router.replace("/(auth)/login");
    } catch (error: any) {
        console.error("Registro fallido:", error);

        // Firebase devuelve códigos de error específicos
        switch (error.code) {
            case "auth/email-already-in-use":
                setError("El correo ya está en uso.");
                Toast.show({
                    type: "error",
                    text1: "Error de registro",
                    text2: "El correo ya está en uso.",
                })
                break;
            case "auth/invalid-email":
                setError("El correo no es válido.");
                Toast.show({
                    type: "error",
                    text1: "Error de registro",
                    text2: "El correo no es válido.",
                })
                break;
            case "auth/weak-password":
                setError("La contraseña es muy débil.");
                Toast.show({
                    type: "error",
                    text1: "Error de registro",
                    text2: "La contraseña es muy débil.",
                })
                break;
            default:
                setError("Error al registrarse.");
                Toast.show({
                    type: "error",
                    text1: "Error de registro",
                    text2: "Ocurrió un error inesperado. Inténtalo de nuevo más tarde.",
                })

            }
    }
};

    return (
        <View style={{ padding: 24, justifyContent: "center", flex: 1 }}>
            <Text variant="headlineMedium" style={{ marginBottom: 24 }}>
                Crear cuenta
            </Text>
            <Text variant="titleMedium" style={{ color: theme.text }}>Correo electrónico</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={[{ marginBottom: 16, backgroundColor: theme.inputBackground }, styles.input]}
                textColor={theme.text}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
            />
            <Text variant="titleMedium" style={{ color: theme.text }}>Contraseña</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={[{ marginBottom: 16, backgroundColor: theme.inputBackground }, styles.input]}
                textColor={theme.text}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
            />
            <Text
                style={{ marginBottom: 16, textAlign: "center" }}
                onPress={() => router.replace("/(auth)/login")}
            >
                ¿Ya te habías registrado? <Text style={{ color: theme.primary }}>Inicia sesión</Text>
            </Text>

            {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}

            <Button mode="contained" onPress={handleRegister} style={{ marginTop: 16, backgroundColor: theme.primary}}>
                Registrarse
            </Button>
        </View>
    );
}
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 16,
    },
});