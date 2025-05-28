import { getUserId } from '@/services/authService';
import { saveAllTasksAsyncStorage } from '@/store/taskStore';
import { Task } from '@/types/task';
import { GlobalUser } from '@/types/user';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { fireStore } from './firebaseConfig';
import { scheduleTodoNotification } from './handleNotifications';

export const syncTaskFromFirestoreAndScheduleNotifications = async () => {
  const uid = getUserId();
  if (!uid) return;

  const snapshot = await getDocs(collection(fireStore, 'users', uid, 'tasks'));
  const tasks: Task[] = [];

  for (const docSnap of snapshot.docs) {
    const task = docSnap.data() as Task;
    if (!task.completed) {
      if (task.reminder !== 'none') {
        task.idNotificationReminder = await scheduleTodoNotification({ task, isReminder: true }) as string;
      }
      task.idNotification = await scheduleTodoNotification({ task }) as string;
    }

    tasks.push(task)
  }

  await saveAllTasksAsyncStorage(tasks);
}

// Traer datos generales del usuario loggeado
export const getUserData = async () => {
  try {
    const uid = getUserId(); // o await getUserId() si es async

    if (uid) {
      const docRef = doc(fireStore, 'users', uid);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const actualUser = snapshot.data() as GlobalUser;
        return actualUser;
      }
    }
  } catch (e) {
    console.log("Error al querer traer datos del usuario");
  }
}

// Tipado opcional para usuarios resumidos
interface UserSummary {
  uid: string;
  name: string;
}

// Traer datos de todos los usuarios a exepción del logueado
export const fetchOtherUsers = async (localUser: GlobalUser | null, isAdminOrMaster: boolean): Promise<UserSummary[]> => {

  if (!isAdminOrMaster || !localUser?.id) return [];

  try {
    const userRef = collection(fireStore, 'users');
    const snapshot = await getDocs(userRef);

    return snapshot.docs
      .filter(doc => doc.data().id !== localUser.id)
      .map(doc => {
        const data = doc.data();
        return {
          uid: data.id,
          name: data.name
        };
      });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
};

// Función para actualizar los datos de un usuario
export const updateUserNameAndNewRole = async (userId: string, newName: string, newRole?: string): Promise<void> => {
  try {
    const userRef = doc(fireStore, 'users', userId);

    const updateData: any = { name: newName };

    if (newRole !== undefined) {
      updateData.userRole = newRole;
    }

    await updateDoc(userRef, updateData);
    //console.log("Nombre actualizado correctamente");
} catch (error) {
  console.error("Error al actualizar el nombre del usuario:", error);
  throw error;
}
};