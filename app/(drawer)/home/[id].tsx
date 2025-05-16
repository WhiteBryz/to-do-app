import { deleteTask, findTaskById, updateTask } from '@/store/taskStore';
import { PriorityLevel, ReminderOption, Task } from '@/types/task';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>('12:00');
  const [priority, setPriority] = useState<PriorityLevel>('low');
  const [reminder, setReminder] = useState<ReminderOption>('10min');
  const [repeat, setRepeat] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);


  // Función para formatear la fecha como texto amigable
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  useEffect(() => {
    const loadTask = async () => {
      const found = await findTaskById(id);
      if (found) {
        setTask(found);
        setTitle(found.title);
        setDescription(found.description);
        setNote(found.note);
        setDate(found.date ? new Date(found.date) : new Date());
        console.log('found.date', found.date);
        setTime(found.time);
        setPriority(found.priority);
        setReminder(found.reminder);
        setRepeat(found.repeat);
      }
    };
    loadTask();
  }, [id]);


  const handleSave = async () => {
    if (!task) return;

    const updatedTask: Task = {
      ...task,
      title,
      description,
      note,
      date: date.toISOString(),
      time,
      priority,
      reminder,
      repeat,
      updatedAt: new Date().toISOString(),
    };

    await updateTask(updatedTask);
    router.back();
  };

  const handleDelete = async () => {
    if (task) {
      await deleteTask(task.id);
      router.back();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Fecha límite</Text>
      <Pressable onPress={() => setShowDatePicker(true)}>
        <Text style={styles.label}>{formatDate(date)}</Text>
      </Pressable>

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

      <Text style={styles.label}>Hora límite</Text>
      <TextInput
        style={styles.input}
        value={time}
        placeholder="HH:mm"
        onChangeText={setTime}
      />

      <Text style={styles.label}>Prioridad</Text>
      <View style={styles.priorityRow}>
        {(['low', 'medium', 'high'] as PriorityLevel[]).map((level) => (
          <Button
            key={level}
            title={level}
            color={priority === level ? '#007AFF' : '#ccc'}
            onPress={() => setPriority(level)}
          />
        ))}
      </View>

      <Text style={styles.label}>Recordatorio</Text>
      <View style={styles.priorityRow}>
        {(['5min', '10min', '30min', '1day'] as ReminderOption[]).map((opt) => (
          <Button
            key={opt}
            title={opt}
            color={reminder === opt ? '#007AFF' : '#ccc'}
            onPress={() => setReminder(opt)}
          />
        ))}
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Repetir</Text>
        <Switch value={repeat} onValueChange={setRepeat} />
      </View>

      <Text style={styles.label}>Notas</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={note}
        onChangeText={setNote}
        multiline
      />

      <View style={styles.buttonRow}>
        <Button title="Guardar" onPress={handleSave} />
        <Button title="Eliminar" onPress={handleDelete} color="#FF3B30" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  priorityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonRow: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
