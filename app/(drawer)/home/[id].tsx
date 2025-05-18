import { deleteTask, findTaskById, updateTask } from '@/store/taskStore';
import { PriorityLevel, ReminderOption, Task } from '@/types/task';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Text, Button, Switch } from 'react-native-paper';
import { RepeatInterval } from '@/types/task'; // asegúrate de importar el tipo
import { getUserStats, updateUserStats, evaluateTrophies } from '@/store/trophiesStore';


export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [repeatInterval, setRepeatInterval] = useState<RepeatInterval>(''); // 👈 nuevo estado
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>('12:00');
  const [priority, setPriority] = useState<PriorityLevel>('low');
  const [reminder, setReminder] = useState<ReminderOption>('10min');
  const [repeat, setRepeat] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  useEffect(() => {
    const init = async () => {
      // 1. Verifica si es la primera vez en pantalla de tarea
      const stats = await getUserStats();
      if (!stats.firstTask) {
        await updateUserStats({ firstTask: true });
        await evaluateTrophies();
      }

      // 2. Carga la tarea
      const found = await findTaskById(id);
      if (found) {
        setRepeatInterval(found.repeatInterval || '');
        setTask(found);
        setTitle(found.title);
        setDescription(found.description);
        setNote(found.note);
        setDate(found.date ? new Date(found.date) : new Date());
        setTime(found.time);
        setPriority(found.priority);
        setReminder(found.reminder);
        setRepeat(found.repeat);
      }
    };
    init();
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
      repeatInterval, // 👈 aquí lo agregas
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
      <Text variant="titleMedium" style={styles.label}>Título</Text>
      <TextInput mode="outlined" value={title} onChangeText={setTitle} style={styles.input} />

      <Text variant="titleMedium" style={styles.label}>Descripción</Text>
      <TextInput
        mode="outlined"
        multiline
        numberOfLines={3}
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <Text variant="titleMedium" style={styles.label}>Fecha límite</Text>
      <Pressable onPress={() => setShowDatePicker(true)}>
        <Text style={styles.pickerText}>{formatDate(date)}</Text>
      </Pressable>
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

      <Text variant="titleMedium" style={styles.label}>Hora límite</Text>
      <TextInput
        mode="outlined"
        value={time}
        onChangeText={setTime}
        placeholder="HH:mm"
        style={styles.input}
      />

      <Text variant="titleMedium" style={styles.label}>Prioridad</Text>
      <View style={styles.priorityRow}>
        {(['low', 'medium', 'high'] as PriorityLevel[]).map((level) => (
          <Button
            key={level}
            mode={priority === level ? 'contained' : 'outlined'}
            onPress={() => setPriority(level)}
            style={{ margin: 4 }}
          >
            {level}
          </Button>
        ))}
      </View>

      <Text variant="titleMedium" style={styles.label}>Recordatorio</Text>
      <View style={styles.priorityRow}>
        {(['5min', '10min', '30min', '1day'] as ReminderOption[]).map((opt) => (
          <Button
            key={opt}
            mode={reminder === opt ? 'contained' : 'outlined'}
            onPress={() => setReminder(opt)}
            style={{ margin: 4 }}
          >
            {opt}
          </Button>
        ))}
      </View>

      <View style={styles.repeatSection}>
        <View style={styles.repeatHeader}>
          <Text style={styles.repeatLabel}>Repetir tarea</Text>
          <Switch
            value={repeat}
            onValueChange={(value) => {
              setRepeat(value);
              if (value && repeatInterval === '') {
                setRepeatInterval('daily');
              }
            }}
          />
        </View>

        {repeat && (
          <View style={styles.repeatOptions}>
            <Text style={styles.repeatTitle}>Frecuencia de repetición</Text>
            <View style={styles.intervalButtons}>
              {(['daily', 'weekly', 'monthly', 'yearly'] as RepeatInterval[]).map(interval => (
                <Button
                  key={interval}
                  mode={repeatInterval === interval ? 'contained' : 'outlined'}
                  onPress={() => setRepeatInterval(interval)}
                  style={styles.intervalButton}
                >
                  {interval.charAt(0).toUpperCase() + interval.slice(1)}
                </Button>
              ))}
            </View>
          </View>
        )}
      </View>

      <Text variant="titleMedium" style={styles.label}>Notas</Text>
      <TextInput
        mode="outlined"
        multiline
        numberOfLines={4}
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      <View style={styles.buttonRow}>
        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Guardar
        </Button>
        <Button mode="outlined" onPress={handleDelete} textColor="red" style={styles.button}>
          Eliminar
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginTop: 16,
    marginBottom: 4,
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  input: {
    marginBottom: 12,
  },
  priorityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonRow: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  repeatSection: {
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 12,
    marginVertical: 16,
  },
  repeatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repeatLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  repeatTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 8,
  },
  repeatOptions: {
    marginTop: 8,
  },
  intervalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intervalButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  
});
