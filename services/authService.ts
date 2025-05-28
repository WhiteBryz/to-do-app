// authService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cancelAllScheduledNotificationsAsync } from "expo-notifications";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";

export const login = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const register = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  // Borramos credenciales y datos del almacenamiento local
  await AsyncStorage.clear();

  // Cancelamos todas las notificaciones de la aplicación
  await cancelAllScheduledNotificationsAsync();

  // Cerramos sesión en firebase
  return await auth.signOut();
};

export const getUserId = (): string | null => {
  const user = getAuth().currentUser;
  
  if(!user){
    throw new Error('Usuario no loggeado');
  }
  return user.uid;
}