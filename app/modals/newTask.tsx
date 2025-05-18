import click from '@/assets/sounds/click.mp3';
import { useTheme } from '@/context/ThemeContext';
import { useSound } from '@/hooks/useSound';
import { addTask as addTaskStorage } from '@/store/taskStore';
import { PriorityLevel, ReminderOption, Task } from '@/types/task';
import scheduleTodoNotification from '@/utils/scheduleToDoNotification';
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
  const [showDatePicker, setShowDatePicker] = useState(false);;
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminder, setReminder] = useState<ReminderOption>('none');
  const [repeat, setRepeat] = useState(false);
  const { playSound } = useSound()
  const theme = useTheme()


  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Campo requerido", "Por favor ingresa un título para la tarea.");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      note,
      priority,
      date: date.toISOString(),
      time: time.toTimeString().slice(0, 5), // HH:mm
      reminder,
      repeat,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Almacenamos la tarea en el almacenamiento local
    await addTaskStorage(newTask);
    playSound(click)

    if(newTask.reminder !== 'none') {
      await scheduleTodoNotification({ task: newTask, isReminder: true });
    }
    await scheduleTodoNotification({task:newTask})
    router.back();
  };

  const canSaveNewTask = title.length > 3 ? true : false;

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <HStack style={styles.topBar}>
          <Text style={{ color: theme.text, marginVertical: 20, fontWeight: 800 }} variant="titleLarge">Agregar nueva tarea</Text>
        </HStack>
        <VStack>
          <TextInput label="Título" value={title} onChangeText={setTitle} style={[styles.input, { backgroundColor: theme.background, color: theme.text }]} />
          <TextInput label="Descripción" value={description} onChangeText={setDescription} multiline numberOfLines={3} style={styles.input} />

          <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.input}>
            Seleccionar fecha: {date.toLocaleDateString()}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false); // ciérralo primero

                if (event.type === 'set' && selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}

          <Button mode="outlined" onPress={() => setShowTimePicker(true)} style={styles.input}>
            Seleccionar hora: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Button>

          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false); // ciérralo primero

                if (event.type === 'set' && selectedTime) {
                  setTime(selectedTime);
                }
              }}
            />
          )}

          <Text variant="labelLarge" style={{ marginTop: 16 }}>Recordatorio</Text>
          <RadioButton.Group onValueChange={(value) => setReminder(value as ReminderOption)} value={reminder}>
            <RadioButton.Item label="Ninguno" value="none" />
            <RadioButton.Item label="5 min antes" value="5min" />
            <RadioButton.Item label="10 min antes" value="10min" />
            <RadioButton.Item label="30 min antes" value="30min" />
            <RadioButton.Item label="1 día antes" value="1day" />
          </RadioButton.Group>

          <View style={styles.repeat}>
            <Checkbox
              status={repeat ? 'checked' : 'unchecked'}
              onPress={() => setRepeat(!repeat)}
            />
            <Text>Repetir tarea</Text>
          </View>

          <Text variant="labelLarge" style={{ marginTop: 16 }}>Prioridad</Text>
          <RadioButton.Group onValueChange={(value) => setPriority(value as PriorityLevel)} value={priority}>
            <RadioButton.Item label="Baja" value="low" />
            <RadioButton.Item label="Media" value="medium" />
            <RadioButton.Item label="Alta" value="high" />
          </RadioButton.Group>

          <TextInput
            label="Nota (opcional)"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={2}
            style={styles.input}
          />
          <HStack style={{ flex: 1, marginTop: 10 }}>
            <Pressable style={[styles.pressableButton, {}]} onPress={() => router.back()}>
              <Text style={[styles.textButton, { color: theme.text }]}>Cancelar</Text>
            </Pressable>

            <Pressable disabled={canSaveNewTask} style={[styles.pressableButton, {}]} onPress={handleSave}>
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
  repeat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  textButton: {
    fontSize: 20,
    fontWeight: 700
  },
  pressableButton: {
    width: 'auto',
    height: 70,
    alignContent: 'center',
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
