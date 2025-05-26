// src/utils/firebaseConfig.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
// @ts-ignore -> TS no detecta getReactNativePersistence
import { getReactNativePersistence, initializeAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDMMrKDQtBGTfJAylgaE-FvYdW3vZKNB74",
  authDomain: "to-do-app-37b45.firebaseapp.com",
  projectId: "to-do-app-37b45",
  storageBucket: "to-do-app-37b45.firebasestorage.app",
  messagingSenderId: "161585821369",
  appId: "1:161585821369:android:8186ad2c8c7859c33d0d68",
};

export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage)
})