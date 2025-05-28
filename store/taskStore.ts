import { Task } from '@/types/task';
import { auth, fireStore } from '@/utils/firebaseConfig';
import { deleteNotificationById, scheduleTodoNotification } from '@/utils/handleNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';


const STORAGE_KEY = 'tasks';

const getUserId = () => auth.currentUser?.uid;

export const syncTasksFromFirebase = async (userUid:string | null): Promise<Task[]> => {

  try{
    const taskRef = collection(fireStore,'tasks');
    const q = query(taskRef, where('createdBy','==',userUid) || where('assignedTo','==',userUid))
    
    const snapshot = await getDocs(q);
    
    const userTasks: Task[] = snapshot.docs.map(doc => doc.data() as Task);
  
    await saveAllTasksAsyncStorage(userTasks);
    
    return userTasks;

  } catch(e){
    console.error("Error al sincronizar tareas desde Firebase: ", e);
    return [];
  }
};

export const getAllTasksAsyncStorage = async (): Promise<Task[]> => {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
};

export const saveAllTasksAsyncStorage = async (tasks: Task[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const addTask = async (task: Task) => {
  // Añadir lógica para programar la notificación
  if (task.reminder !== 'none') {
    task.idNotificationReminder = await scheduleTodoNotification({ task, isReminder: true }) as string;
  }
  task.idNotification = await scheduleTodoNotification({ task, isReminder: false }) as string;

  // Guardar la tarea en el almacenamiento
  const tasks = await getAllTasksAsyncStorage();
  tasks.push(task);
  await saveAllTasksAsyncStorage(tasks);

  const uid = getUserId();
  if (uid) {
    console.log("entró a crear tarea")
    const taskRef = doc(fireStore, `tasks/${task.id}`);
    setDoc(taskRef, task)
  }
};

export const updateTask = async (updatedTask: Task) => {
  // Cancelar la notificación anterior
  await deleteNotificationById(updatedTask);

  if (!updatedTask.completed) {
    // Añadir lógica para programar la notificación
    if (updatedTask.reminder !== 'none') {
      updatedTask.idNotificationReminder = await scheduleTodoNotification({ task: updatedTask, isReminder: true }) as string;
    }
    updatedTask.idNotification = await scheduleTodoNotification({ task: updatedTask, isReminder: false }) as string;
  }

  const tasks = await getAllTasksAsyncStorage();
  const newTasks = tasks.map(t => (t.id === updatedTask.id ? updatedTask : t));
  await saveAllTasksAsyncStorage(newTasks);

  const uid = getUserId();
  if (uid) {
    const taskRef = doc(fireStore, `tasks/${updatedTask.id}`);
    await setDoc(taskRef, updatedTask, {merge: true});
  }
};

export const deleteTask = async (id: string) => {

  const tasks = await getAllTasksAsyncStorage();
  const newTasks = tasks.filter(t => t.id !== id);
  await saveAllTasksAsyncStorage(newTasks);

  const uid = getUserId();
  if (uid) {
    const docuRef = doc(fireStore, `task/${id}`)
    deleteDoc(docuRef);
  }
};

export const findTaskById = async (id: string): Promise<Task | undefined> => {
  const tasks = await getAllTasksAsyncStorage();
  return tasks.find(t => t.id === id);
};

export const searchTasks = async (query: string): Promise<Task[]> => {
  const tasks = await getAllTasksAsyncStorage();
  return tasks.filter(t =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.description.toLowerCase().includes(query.toLowerCase())
  );
};


export const listenToTasksFromFirebase = (onChange: (tasks: Task[]) => void) => {
  const unsubscribe = onSnapshot(collection(fireStore, 'tasks'), snapshot => {
    const tasks: Task[] = [];
    snapshot.forEach(doc => {
      const data = doc.data() as Task;
      tasks.push(data);
    });
    saveAllTasksAsyncStorage(tasks); // Opcional
    onChange(tasks);
  });

  return unsubscribe;
};