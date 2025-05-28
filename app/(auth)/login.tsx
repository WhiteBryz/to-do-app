// app/(auth)/login.tsx
import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
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
            const userLogin =  await login(email, password);
            await AsyncStorage.setItem("USER_UID", JSON.stringify({"userUid":userLogin.user.uid}))
            //console.log(userLogin.user.uid)
            router.replace({pathname: "/(drawer)/home"});
        } catch (err: any) {
            setError("No se encuentran credenciales, favor de validar los datos.");
            // console.log(err)
        }
    };
    return (
        <View style={{ padding: 24, justifyContent: "center", flex: 1 }}>
            <KeyboardAvoidingView behavior="padding">
                <Text variant="headlineMedium" style={{ marginBottom: 24, color: theme.primary, fontWeight: 700}}>
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
                    placeholder="Ingresa tu correo para iniciar sesión"
                    autoFocus={true}
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
                    placeholder="Ingresa tu contraseña"
                />
                <Text
                    style={{ marginBottom: 10, textAlign: "center", color: theme.text }}
                    onPress={() => router.replace("./register")}
                >
                    ¿No tienes cuenta? <Text style={{ color: theme.primary, textDecorationLine:'underline' }}>Regístrate</Text>
                </Text>
                {error ? <HelperText type="error" style={{ color: "darkred", width: "100%", textAlign: "center", marginBottom: 10 }} visible={true}>{error}</HelperText> : null}


                <Button mode="contained" onPress={handleLogin} textColor={theme.background} style={{ backgroundColor: theme.buttonBackground }}>
                    Entrar
                </Button>
            </KeyboardAvoidingView>
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