// app/(auth)/login.tsx
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { login } from "../../services/authService";


export default function LoginScreen() {
    const theme = useTheme();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            setError("");
            await login(email, password);
            router.replace("/(drawer)/home");
        } catch (err: any) {
            setError((err.message) || "Ocurrió un error");
        }
    };
    return (
        <View style={{ padding: 24, justifyContent: "center", flex: 1 }}>
            <Text variant="headlineMedium" style={{ marginBottom: 24 }}>
                Iniciar sesión
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
                onPress={() => router.replace("/(auth)/register")}
            >
                ¿No tienes cuenta? <Text style={{ color: theme.primary }}>Regístrate</Text>
            </Text>
            {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}


            <Button mode="contained" onPress={handleLogin} style={{ backgroundColor: theme.primary }}>
                Entrar
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