// utils/firebaseAuth.ts
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebaseConfig';

// const auth = getAuth(firebaseApp);

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};
