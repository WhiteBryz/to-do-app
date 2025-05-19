import click from '@/assets/sounds/click.mp3';
import { useTheme } from '@/context/ThemeContext';
import { useSound } from '@/hooks/useSound';
import { addTask as addTaskStorage } from '@/store/taskStore';
import { evaluateTrophies, getUserStats, updateUserStats } from '@/store/trophiesStore';
import { PriorityLevel, ReminderOption, RepeatInterval, Task } from '@/types/task';
import { buildTaskDate, getReminderDate } from '@/utils/handleNotifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { HStack, VStack } from "@react-native-material/core";
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Checkbox, RadioButton, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewTaskModal() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [date, setDate] = useState(() => new Date());
  const [time, setTime] = useState(() => new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminder, setReminder] = useState<ReminderOption>('none');
  const [repeat, setRepeat] = useState(false);
  const { playSound } = useSound()
  const theme = useTheme()
  const [repeatInterval, setRepeatInterval] = useState<RepeatInterval>('none');

  async function validateDatesOrAlert(taskDate: Date, reminderDate: Date): Promise<boolean> {
    const now = new Date();

    if (reminderDate <= now) {
      playSound('error');
      Alert.alert("❌ Error", "No se puede fijar una notificación en el pasado");
      return false;
    }

    if (taskDate <= now) {
      playSound('error');
      Alert.alert("❌ Error", "La fecha y hora de la tarea ya han pasado");
      return false;
    }

    return true;
  }

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Campo requerido", "Por favor ingresa un título para la tarea.");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description: description.trim(),
      note: description.trim() ? note : '',
      priority,
      date: date.toISOString(),
      time: time.toTimeString().slice(0, 5), // HH:mm
      reminder,
      repeat,
      repeatInterval,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const reminderOptions = {
      'none': 0,
      '5min': 5,
      '10min': 10,
      '30min': 30,
      '1day': 1440, // 24 horas * 60 minutos
    }

    const taskDate = buildTaskDate(newTask.date, newTask.time);
    const reminderDate = getReminderDate(taskDate, newTask.reminder as keyof typeof reminderOptions);

    // Validar fechas y horas de tarea y recordatorio/s
    const isValid = await validateDatesOrAlert(taskDate, reminderDate);
    if (!isValid) return;

    // Guardar en almacenamiento
    await addTaskStorage(newTask);
    const stats = await getUserStats();
    await updateUserStats({ tasksCreated: stats.tasksCreated + 1 });
    await evaluateTrophies();

    playSound(click)
    router.back();
  }


  const canSaveNewTask = title.length > 3;

  return (
    <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
        <HStack style={styles.topBar}>
          <Text style={{ color: theme.text, marginVertical: 20, fontWeight: '800' }} variant="titleLarge">
            Agregar nueva tarea
          </Text>
        </HStack>
        <VStack>
          <TextInput
            label="Título"
            value={title}
            onChangeText={setTitle}
            style={[styles.input, { backgroundColor: theme.inputBackground }]}
            underlineColor={theme.primary}
            textColor={theme.text}
          />
          <TextInput
            label="Descripción"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={[styles.input, { backgroundColor: theme.inputBackground }]}
            underlineColor={theme.primary}
            textColor={theme.text}
          />

          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
            labelStyle={{ color: theme.buttonText }}
          >
            Seleccionar fecha: {date.toLocaleDateString()}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (event.type === 'set' && selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}

          <Button
            mode="outlined"
            onPress={() => setShowTimePicker(true)}
            style={styles.input}
            labelStyle={{ color: theme.buttonText }}
          >
            Seleccionar hora: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Button>

          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (event.type === 'set' && selectedTime) {
                  setTime(selectedTime);
                }
              }}
            />
          )}

          <Text variant="labelLarge" style={{ marginTop: 16, color: theme.labelColor }}>Recordatorio</Text>
          <RadioButton.Group onValueChange={(value) => setReminder(value as ReminderOption)} value={reminder}>
            <RadioButton.Item label="Ninguno" value="none" />
            <RadioButton.Item label="5 min antes" value="5min" />
            <RadioButton.Item label="10 min antes" value="10min" />
            <RadioButton.Item label="30 min antes" value="30min" />
            <RadioButton.Item label="1 día antes" value="1day" />
          </RadioButton.Group>

          <View style={[styles.repeatSection, { backgroundColor: theme.card }]}>
            <Pressable
              style={styles.repeatToggle}
              onPress={() => {
                const newValue = !repeat;
                setRepeat(newValue);
                if (newValue && repeatInterval === 'none') {
                  setRepeatInterval('daily');
                }
              }}
            >
              <Checkbox
                status={repeat ? 'checked' : 'unchecked'}
                onPress={() => {
                  const newValue = !repeat;
                  setRepeat(newValue);
                  if (newValue && repeatInterval === 'none') {
                    setRepeatInterval('daily');
                  }
                }}
                color={theme.primary}
              />
              <Text style={[styles.repeatLabel, { color: theme.text }]}>Repetir tarea</Text>
            </Pressable>

            {repeat && (
              <View style={styles.repeatOptions}>
                <Text style={[styles.repeatTitle, { color: theme.labelColor }]}>Frecuencia de repetición</Text>
                <RadioButton.Group
                  onValueChange={(value) => setRepeatInterval(value as RepeatInterval)}
                  value={repeatInterval}
                >
                  <RadioButton.Item label="Diario" value="daily" labelStyle={{ color: theme.radioText }} />
                  <RadioButton.Item label="Semanal" value="weekly" labelStyle={{ color: theme.radioText }} />
                  <RadioButton.Item label="Mensual" value="monthly" labelStyle={{ color: theme.radioText }} />
                  <RadioButton.Item label="Anual" value="yearly" labelStyle={{ color: theme.radioText }} />
                </RadioButton.Group>
              </View>
            )}
          </View>

          <Text variant="labelLarge" style={{ marginTop: 16, color: theme.labelColor }}>Prioridad</Text>
          <RadioButton.Group onValueChange={(value) => setPriority(value as PriorityLevel)} value={priority}>
            <RadioButton.Item label="Baja" value="low" labelStyle={{ color: theme.radioText }} />
            <RadioButton.Item label="Media" value="medium" labelStyle={{ color: theme.radioText }} />
            <RadioButton.Item label="Alta" value="high" labelStyle={{ color: theme.radioText }} />
          </RadioButton.Group>

          <TextInput
            label="Nota (opcional)"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={2}
            style={[styles.input, { backgroundColor: theme.inputBackground }]}
            underlineColor={theme.primary}
            textColor={theme.text}
          />
          <HStack style={{ flex: 1, marginTop: 10 }}>
            <Pressable style={styles.pressableButton} onPress={() => router.back()}>
              <Text style={[styles.textButton, { color: theme.text }]}>Cancelar</Text>
            </Pressable>
            <Pressable disabled={!canSaveNewTask} style={styles.pressableButton} onPress={handleSave}>
              <Text style={[styles.textButton, { color: theme.text, opacity: canSaveNewTask ? 1 : 0.5 }]}>Guardar Tarea</Text>
            </Pressable>
          </HStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginTop: 12,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textButton: {
    fontSize: 20,
    fontWeight: '700',
  },
  pressableButton: {
    width: 'auto',
    height: 70,
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatSection: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
  },
  repeatToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repeatLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  repeatOptions: {
    marginTop: 12,
    paddingLeft: 4,
  },
  repeatTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
