// authService.ts
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "../utils/firebaseConfig";

export const login = async (email: string, password: string) => {
  const auth = getAuth(firebaseApp);
  return await signInWithEmailAndPassword(auth, email, password);
};

export const register = async (email: string, password: string) => {
  const auth = getAuth(firebaseApp);
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  const auth = getAuth(firebaseApp);
  return await auth.signOut();
};
