import { Task } from "@/types/task";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";


interface ScheduleTodoNotification {
    task: Task;
    isReminder?: boolean;
}

const reminderOptions = {
    'none': 0,
    '5min': 5,
    '10min': 10,
    '30min': 30,
    '1day': 1440, // 24 horas * 60 minutos
}

function getReminderMinutes(key: string): number {
    return reminderOptions[key as keyof typeof reminderOptions] ?? 0;
}

export async function scheduleTodoNotification({ task, isReminder = false }: ScheduleTodoNotification): Promise<String | void> {
    try {
        if (!task.date || !task.time) {
            throw new Error("La tarea debe tener fecha y hora definidas");
        }

        const date = new Date(task.date);
        const [hours, minutes] = task.time.split(":").map(Number);

        if (isNaN(date.getTime())) throw new Error("Formato de fecha inválido");
        if (isNaN(hours) || isNaN(minutes)) throw new Error("Formato de hora inválido");

        date.setHours(hours);
        date.setMinutes(minutes);

        const reminder = getReminderMinutes(task.reminder ?? "");
        const trigger = new Date(date);

        if (isReminder) {
            if (!reminder) throw new Error("Recordatorio inválido");
            trigger.setMinutes(trigger.getMinutes() - reminder);
        }

        if (trigger < new Date()) {
            Alert.alert("Atención", "La fecha y hora de la tarea ya han pasado");
            return;
        }

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Es hora!",
                body: task.title,
                subtitle: task.description,
                data: { taskId: task.id },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: trigger,
            }
        });

        console.log("Notificación programada:", notificationId);
        return notificationId;
    } catch (e) {
        console.error("Error al crear la notificación:", e);
        Alert.alert("Error", "No se pudo programar la notificación", [
            { text: "Cancelar", style: "cancel" },
            { text: "Reintentar", onPress: () => scheduleTodoNotification({ task, isReminder }) }
        ]);
    }
}


export async function deleteNotificationById(task: Task): Promise<void> {
    try {
        const notificationIds = [
            task.idNotificationReminder,
            task.idNotification
        ].filter(Boolean) as string[]; // Filtra nulos/undefined

        for (const id of notificationIds) {
            await Notifications.cancelScheduledNotificationAsync(id);
        }

        console.log("Notificaciones canceladas:", notificationIds);
    } catch (e) {
        console.error("Error al eliminar la(s) notificación(es):", e);
        Alert.alert(
            "Error",
            "No se pudo eliminar la(s) notificación(es) programadas",
            [{ text: "Ok", style: "cancel" }]
        );
    }
}

export function buildTaskDate(dateISO: string, time: string): Date {
  const taskDate = new Date(dateISO);
  const [hours, minutes] = time.split(':').map(Number);
  taskDate.setHours(hours);
  taskDate.setMinutes(minutes);
  return taskDate;
}

export function getReminderDate(taskDate: Date, reminder: keyof typeof reminderOptions): Date {
  const reminderTime = reminderOptions[reminder];
  const reminderDate = new Date(taskDate);
  reminderDate.setMinutes(reminderDate.getMinutes() - reminderTime);
  return reminderDate;
}