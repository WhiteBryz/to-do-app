import { getUserId } from '@/services/authService';
import { saveAllTasks } from '@/store/taskStore';
import { Task } from '@/types/task';
import { collection, getDocs } from 'firebase/firestore';
import { fireStore } from './firebaseConfig';
import { scheduleTodoNotification } from './handleNotifications';

export const syncTaskFromFirestoreAndScheduleNotifications = async() => {
    const uid = getUserId();
    if(!uid) return;

    const snapshot = await getDocs(collection(fireStore, 'users', uid, 'tasks'));
    const tasks: Task[] = [];

    for(const docSnap of snapshot.docs){
        const task = docSnap.data() as Task;
        if(!task.completed){
            if(task.reminder !== 'none'){
                task.idNotificationReminder = await scheduleTodoNotification({task, isReminder:true}) as string;
            }
            task.idNotification = await scheduleTodoNotification({task}) as string;
        }

        tasks.push(task)
    }

    await saveAllTasks(tasks);
}