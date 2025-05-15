import DateTimePicker from '@react-native-community/datetimepicker';
import { HStack } from "@react-native-material/core";
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Checkbox, RadioButton, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../../hooks/useTasks';
import { addTask as addTaskStorage } from '../../store/taskStore';
import { PriorityLevel, ReminderOption, Task } from '../../types/task';

export default function NewTaskModal() {
  const router = useRouter();
  const { reload } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [date, setDate] = useState(() => new Date());
  const [time, setTime] = useState(() => new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);;
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminder, setReminder] = useState<ReminderOption>('10min');
  const [repeat, setRepeat] = useState(false);

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

    await addTaskStorage(newTask);
    await reload();
    router.back();
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <HStack style={styles.topBar}>
          <Button icon="arrow-left" mode="text" onPress={() => router.back()}>Volver</Button>
          <Text variant="titleLarge">Agregar nueva tarea</Text>
        </HStack>

        <TextInput label="Título" value={title} onChangeText={setTitle} style={styles.input} />
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

        <Button mode="contained" onPress={handleSave} style={{ marginTop: 16 }}>
          Guardar Tarea
        </Button>
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
});
