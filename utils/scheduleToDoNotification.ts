import { Task } from "@/types/task";
import * as Notifications from "expo-notifications";


interface ScheduleTodoNotification {
    task: Task;
    isReminder?: boolean;
}

const reminderOptions = {
    '5min': 5,
    '10min': 10,
    '30min': 30,
    '1day': 1440, // 24 horas * 60 minutos
}

export default async function scheduleTodoNotification({ task, isReminder = false }: ScheduleTodoNotification): Promise<void> {
    const date = new Date(task.date);
    const [hours, minutes] = task.time.split(":").map(Number);

    // Validación básica de horas
    if (isNaN(date.getTime())) {
        throw new Error("Formato ISO de fecha inválido");
    }

    // Validación básica de horas
    if (isNaN(hours) || isNaN(minutes)) {
        throw new Error("Formato de hora inválido. Debe ser HH:mm");
    }

    // Establecer la hora y los minutos en el objeto Date
    date.setHours(hours);
    date.setMinutes(minutes);

    // Calcular el tiempo de recordatorio
    const reminder = reminderOptions[task.reminder as keyof typeof reminderOptions];

    // Especificamos la fecha y hora de la notificación
    const trigger = new Date(date)
    
    // Si es un recordatorio, restar el tiempo de recordatorio establecido por el usuario
    if (isReminder) trigger.setMinutes(trigger.getMinutes() - reminder)

    if (trigger < new Date()) {
        alert("La fecha y hora de la tarea ya han pasado");
        return;
    }

    try {
        // Programar la notificación
        await Notifications.scheduleNotificationAsync({
            identifier: `Noty: ${task.id}`,
            content: {
                title: 'Es hora!',
                body: task.title,
                subtitle: task.description,
                vibrate: [10]
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: trigger
            }
        })
    } catch (e) {
        console.error('Error al crear la notificación: ', e)
        alert('Error al crear el recordatorio. Por favor, intenta nuevamente.')
    }
}