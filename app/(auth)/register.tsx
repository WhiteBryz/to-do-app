// app/(auth)/register.tsx
import { useTheme } from "@/context/ThemeContext";
import { GlobalUser } from "@/types/user";
import { auth, fireStore } from "@/utils/firebaseConfig"; // Asegúrate de que la ruta es correcta
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordToConfirm, setPasswordToConfirm] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const theme = useTheme();

    const handleRegister = async () => {
        if (!name || !email || !password || !passwordToConfirm) {
            return Alert.alert("Error", "Favor de llenar todos los campos para registrar el usuario", [
                { text: "Aceptar" }
            ])
        }

        if(!(password === passwordToConfirm)){
            return setError("Las contaseñas no coinciden");
        }

        try {
            setError("");

            const userCredential = await createUserWithEmailAndPassword(auth, email, password).then((userFirebase) => { return userFirebase });
            const user = userCredential.user;

            const newUser: GlobalUser = {
                id: user.uid,
                createdAt: new Date().toISOString(), // ISO string
                updatedAt: new Date().toISOString(),
                name: name,
                email: email,
                userRole: 'worker'
            }
            //console.log(newUser)

            const docuRef = doc(fireStore, `users/${newUser.id}`)
            setDoc(docuRef, newUser)

            //console.log('pasó');
            // Guardar el token en Async
            await AsyncStorage.setItem("userToken", user.uid);

            Toast.show({
                type: "success",
                text1: "Registro exitoso",
                text2: "Ahora puedes iniciar sesión",
            })

            router.replace("/(auth)/login");
        } catch (error: any) {
            //console.error("Registro fallido:", error);

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
            <KeyboardAvoidingView behavior="padding">
                <Text variant="headlineMedium" style={{ marginBottom: 24, color: theme.primary, fontWeight: 700 }}>
                    Crear cuenta
                </Text>
                <Text variant="titleMedium" style={{ color: theme.text }}>Nombre Completo</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="none"
                    keyboardType="default"
                    style={[{ marginBottom: 16, backgroundColor: theme.inputBackground }, styles.input]}
                    textColor={theme.text}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    autoFocus={true}
                    placeholder="Ingresa tu nombre completo"
                    maxLength={50}
                />
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
                    placeholder="Ingresa correo electrónico válido"
                    maxLength={32}
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
                    placeholder="Ingresa una contraseña segura"
                    maxLength={32}
                />
                <Text variant="titleMedium" style={{ color: theme.text }}>Confirmar contraseña</Text>
                <TextInput
                    value={passwordToConfirm}
                    onChangeText={setPasswordToConfirm}
                    secureTextEntry
                    style={[{ marginBottom: 16, backgroundColor: theme.inputBackground }, styles.input]}
                    textColor={theme.text}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    placeholder="Ingresa una contraseña segura"
                    maxLength={32}
                />
                <Text
                    style={{ marginBottom: 16, textAlign: "center", color: theme.text }}
                    onPress={() => router.replace("/(auth)/login")}
                >
                    ¿Ya te habías registrado? <Text style={{ color: theme.primary, textDecorationLine: 'underline' }}>Inicia sesión</Text>
                </Text>

                {error ? <HelperText type="error" style={{ color: "darkred", width: "100%", textAlign: "center" }} visible={true}>{error}</HelperText> : null}

                <Button mode="contained" onPress={handleRegister} textColor={theme.background} style={{ marginTop: 16, backgroundColor: theme.primary }}>
                    Registrarse
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