import { deleteTask, findTaskById, updateTask } from '@/store/taskStore';
import { PriorityLevel, ReminderOption, Task } from '@/types/task';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, RadioButton, Switch, Text, TextInput } from 'react-native-paper';


export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>('12:00');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [priority, setPriority] = useState<PriorityLevel>('low');
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [tempPriority, setTempPriority] = useState<PriorityLevel>(priority);
  const [reminder, setReminder] = useState<ReminderOption>('10min');
  const [tempReminder, setTempReminder] = useState(reminder);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  //TODO: Implementar repetición de tareas en el newTask
  const [repeat, setRepeat] = useState(false);
  /*const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [tempRepeat, setTempRepeat] = useState(repeat);
  const [showRepeatModal, setShowRepeatModal] = useState(false);
*/


  // Formatea fecha a texto legible
  const formatDate = (date: Date) =>
    date.toLocaleDateString('es-MX', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  // Abrir el modal y sincronizar el valor temporal
  const openPriorityModal = () => {
    setTempPriority(priority);
    setShowPriorityModal(true);
  }
  const priorityLabels: Record<PriorityLevel, string> = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
  };
  const reminderLabels: Record<ReminderOption, string> = {
    '5min': '5 minutos antes',
    '10min': '10 minutos antes',
    '30min': '30 minutos antes',
    '1day': '1 día antes',
  };

  /*
  const repetitionLabels: Record<RepetitionOption, string> = {
    'none': 'No repetir',
    'daily': 'Diario',
    'weekly': 'Semanal',
    'monthly': 'Mensual',
  };*/



  useEffect(() => {
    const loadTask = async () => {
      const found = await findTaskById(id);
      if (found) {
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
  const handleMarkComplete =async ()=>{
    if (!task) return;
          const updatedTask: Task = {
            ...task,
            completed: !task.completed,
            updatedAt: new Date().toISOString(),
          };
          await updateTask(updatedTask);
          router.back();
  }

  if (!task) {
    return <Text style={styles.loading}>Cargando...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 100 }]}>
        {/* Título */}
        <Text variant="titleMedium" style={styles.label}>Tarea</Text>
        <TextInput
          mode="outlined"
          value={title}
          onChangeText={setTitle}
          style={(isEditing) ? styles.input : styles.inputdisabled}
          disabled={!isEditing}
        />

        {/* Descripción */}
        <Text variant="titleMedium" style={styles.label}>Descripción</Text>
        <TextInput
          mode="outlined"
          multiline
          numberOfLines={3}
          value={description}
          onChangeText={setDescription}
          style={(isEditing) ? styles.input : styles.inputdisabled}
          disabled={!isEditing}
        />

        {/* Fecha límite */}
        <Text variant="titleMedium" style={styles.label}>Fecha límite</Text>
        <Pressable style={(isEditing) ? styles.simulatedInput : styles.simulatedInputDisabled} disabled={!isEditing} onPress={() => setShowDatePicker(true)}>
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

        {/* Hora límite */}
        <Text variant="titleMedium" style={styles.label}>Hora límite</Text>
        <Pressable style={(isEditing) ? styles.simulatedInput : styles.simulatedInputDisabled} disabled={!isEditing} onPress={() => setShowTimePicker(true)}>
          <Text style={styles.pickerText}>{time}</Text>
        </Pressable>
        {showTimePicker && (
          <DateTimePicker
            value={new Date(`1970-01-01T${time}:00`)}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false); // ciérralo primero

              if (event.type === 'set' && selectedTime) {
                setTime(selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).slice(0, 5));
              }
            }}
          />
        )}

        {/* Prioridad */}
        <Text variant="titleMedium" style={styles.label}>Prioridad</Text>
        <Button
          mode={'contained'}
          onPress={openPriorityModal}
          style={styles.choiceBtn}
          disabled={!isEditing}
        >
          {priorityLabels[priority]} {/* 👈 Mostrar la prioridad en español */}
        </Button>

        <Modal visible={showPriorityModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.dialogContent}>
              <Text style={styles.dialogTitle}>Selecciona la prioridad</Text>

              <RadioButton.Group
                onValueChange={(newValue) => setTempPriority(newValue as PriorityLevel)}
                value={tempPriority}
              >
                {(['low', 'medium', 'high'] as PriorityLevel[]).map(level => (
                  <RadioButton.Item
                    key={level}
                    labelStyle={styles.radioLabel}
                    label={priorityLabels[level]}
                    value={level}
                    mode="android"
                  />
                ))}
              </RadioButton.Group>

              <View style={styles.dialogActions}>
                <Button
                  onPress={() => setShowPriorityModal(false)}
                  compact
                >
                  Cancelar
                </Button>
                <Button
                  onPress={() => {
                    setPriority(tempPriority);
                    setShowPriorityModal(false);
                  }}
                  compact
                >
                  Aceptar
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        {/* Recordatorio */}
        <Text variant="titleMedium" style={styles.label}>Recordatorio</Text>
        <Button
          mode="contained"
          onPress={() => {
            setTempReminder(reminder);
            setShowReminderModal(true);
          }}
          style={styles.choiceBtn}
          disabled={!isEditing}
        >
          {reminderLabels[reminder]}
        </Button>
        <Modal visible={showReminderModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.dialogContent}>
              <Text style={styles.dialogTitle}>Selecciona el recordatorio</Text>
              <RadioButton.Group
                onValueChange={(value) => setTempReminder(value as typeof reminder)}
                value={tempReminder}
              >
                {Object.entries(reminderLabels).map(([value, label]) => (
                  <RadioButton.Item
                    key={value}
                    label={label}
                    value={value}
                    mode="android"
                    labelStyle={styles.radioLabel}
                  />
                ))}
              </RadioButton.Group>
              <View style={styles.dialogActions}>
                <Button onPress={() => setShowReminderModal(false)}>Cancelar</Button>
                <Button onPress={() => {
                  setReminder(tempReminder);
                  setShowReminderModal(false);
                }}>
                  Aceptar
                </Button>
              </View>
            </View>
          </View>
        </Modal>




        {/* Repetición */}
        <View style={styles.switchRow}>
          <Text variant="titleMedium">Repetir</Text>
          <Switch
            value={repeat}
            onValueChange={setRepeat}
            disabled={!isEditing}
            thumbColor={repeat ? '#6200ee' : '#f4f3f4'}
          />
        </View>
        {/* TODO: Implementar repetición de tareas en el newTask para habilitar el modal
      <Text variant="titleMedium" style={styles.label}>Repetición</Text>
      <Button
        mode="contained"
        onPress={() => {
          setTempRepeat(repeat);
          setShowRepeatModal(true);
        }}
        style={styles.choiceBtn}
      >
        {repeatLabels[repeat]}
      </Button>
      <Modal visible={showRepeatModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
      <View style={styles.dialogContent}>
      <Text style={styles.dialogTitle}>Selecciona la repetición</Text>
      <RadioButton.Group
        onValueChange={(value) => setTempRepeat(value as typeof repeat)}
        value={tempRepeat}
      >
        {Object.entries(repeatLabels).map(([value, label]) => (
          <RadioButton.Item
            key={value}
            label={label}
            value={value}
            mode="android"
            labelStyle={styles.radioLabel}
          />
        ))}
      </RadioButton.Group>
      <View style={styles.dialogActions}>
        <Button onPress={() => setShowRepeatModal(false)}>Cancelar</Button>
        <Button onPress={() => {
          setRepeat(tempRepeat);
          setShowRepeatModal(false);
        }}>
          Aceptar
        </Button>
      </View>
      </View>
    </View>
  </Modal>

      */}
        {/* Nota */}
        <Text variant="titleMedium" style={styles.label}>Notas</Text>
        <TextInput
          mode="outlined"
          multiline
          numberOfLines={4}
          value={note}
          onChangeText={setNote}
          style={(isEditing) ? styles.input : styles.inputdisabled}
          disabled={!isEditing}
        />

        {/* Última modificación */}
        <Text variant="bodySmall" style={styles.updatedAt}>
          Última modificación: {new Date(task.updatedAt).toLocaleDateString('es-MX', {
            year: 'numeric', month: '2-digit', day: '2-digit'
          })}
        </Text>
      </ScrollView >

      {/* Barra de navegación inferior */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.navItem} onPress={handleMarkComplete}>
          
          <MaterialCommunityIcons name={(task.completed)?'checkbox-marked-circle':'check-circle-outline'} size={24} color="#fff" />
          <Text style={styles.navText}>{(task.completed)?'Marcar como \n pendiente':'Marcar como completada'}</Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => {
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
        >
          <MaterialCommunityIcons name={isEditing ? 'content-save-outline' : 'pencil-outline'} size={24} color="#fff" />
          <Text style={styles.navText}>{isEditing ? 'Guardar' : 'Editar'}</Text>
        </Pressable>

        
        <Pressable style={styles.navItem} onPress={handleDelete}>
          <MaterialCommunityIcons name='delete-outline' size={24} color="#fff" />
          <Text style={styles.navText}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: '#6A6961',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    marginBottom: 12,
  },
  simulatedInput: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#6A6961',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    marginBottom: 12,
  },
  inputdisabled: {
    backgroundColor: '#E5E5E5',
    borderColor: '#d0d0d0',
    borderRadius: 6,
  },
  simulatedInputDisabled: {
    padding: 5,
    borderWidth: 1,
    backgroundColor: '#E5E5E5',
    color: '#d0d0d0',
    borderColor: '#d0d0d0',
    borderRadius: 6,
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    width: '85%',
    maxWidth: 320,
    elevation: 4,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  radioLabel: {
    fontSize: 16,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalOption: {
    width: '100%',
    marginVertical: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  container: { padding: 20 },
  label: { marginTop: 16, marginBottom: 4 },
  pickerText: {
    fontSize: 16,
    padding: 8,
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  choiceBtn: {
    margin: 4,
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
  updatedAt: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
  loading: {
    flex: 1,
    padding: 20,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    paddingBottom:30,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#6200ea', // púrpura como en la imagen
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
