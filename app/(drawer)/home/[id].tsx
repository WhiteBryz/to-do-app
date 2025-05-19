import { useTheme } from '@/context/ThemeContext';
import { useSound } from '@/hooks/useSound';
import { deleteTask, findTaskById, updateTask } from '@/store/taskStore';
import { evaluateTrophies, getUserStats, updateUserStats } from '@/store/trophiesStore';
import { PriorityLevel, ReminderOption, RepeatInterval, Task } from '@/types/task';
import { buildTaskDate, deleteNotificationById, getReminderDate } from '@/utils/handleNotifications';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Icon, RadioButton, Switch, Text, TextInput } from 'react-native-paper';


export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [repeatInterval, setRepeatInterval] = useState<RepeatInterval>('none');
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
  const [repeat, setRepeat] = useState(false);
  const { playSound } = useSound();
  const theme = useTheme();


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
    'none': 'Sin recordatorio',
    '5min': '5 minutos antes',
    '10min': '10 minutos antes',
    '30min': '30 minutos antes',
    '1day': '1 día antes',
  };

  const repetitionLabels: Record<RepeatInterval, string> = {
    'none': 'No repetir',
    'daily': 'Diario',
    'weekly': 'Semanal',
    'monthly': 'Mensual',
    'yearly': 'Anual',
  };

  const reminderOptions: Record<ReminderOption, number> = {
    'none': 0,
    '5min': 5,
    '10min': 10,
    '30min': 30,
    '1day': 1440, // 24 horas * 60 minutos
  }


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
        setRepeatInterval(found.repeatInterval || 'none');
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
      repeatInterval,
      updatedAt: new Date().toISOString(),
    };

    if (updatedTask.idNotification) await deleteNotificationById(task);

    const taskDate = buildTaskDate(updatedTask.date, updatedTask.time);
    const reminderDate = getReminderDate(taskDate, updatedTask.reminder as keyof typeof reminderOptions);

    // Validar fechas y horas de tarea y recordatorio/s
    const isValid = await validateDatesOrAlert(taskDate, reminderDate);
    if (!isValid) return;

    await updateTask(updatedTask);
    router.back();
  };

  const handleDelete = async () => {
    if (task) {
      if (task.idNotification) await deleteNotificationById(task);

      await deleteTask(task.id);
      router.back();
    }
  };
  const handleMarkComplete = async () => {
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
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 100 }, { backgroundColor: theme.background }]}>
        {/* Título */}
        {isEditing ? (
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={[styles.titleTask, { backgroundColor: theme.inputBackground}]}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            textColor={theme.text}
          />
        ) : (
          <Text style={[styles.titleTaskDisabled, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.secondaryText }]}>{title}</Text>
        )}

        {/* Descripción */}
        <Text variant='titleSmall' style={[styles.label, { color: theme.text }]}>Descripción</Text>
        <TextInput
          multiline
          numberOfLines={5}
          value={description}
          onChangeText={setDescription}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          style={[(isEditing) ? styles.input : styles.inputdisabled, { backgroundColor: theme.inputBackground}]}
          disabled={!isEditing}
          textColor={theme.text}
        />

        {/* Fecha y hora límite */}
        <View style={styles.datetimeWrapper}>
          <View style={styles.datetimeLeft}>
            <MaterialCommunityIcons name="calendar" size={24} color={theme.primary} />
            <Pressable
              disabled={!isEditing}
              style={[
                isEditing ? styles.pressableDateTime : styles.pressableDateTimeDisabled,
                styles.dateBox,
                { backgroundColor: theme.inputBackground}
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.pickerText, { color: theme.text }]}>{formatDate(date)}</Text>
            </Pressable>
          </View>

          <View style={styles.datetimeRight}>
            <Text style={[styles.separatorText, { color: theme.text }]}>a las</Text>
            <Pressable
              disabled={!isEditing}
              style={[isEditing ? styles.pressableDateTime : styles.pressableDateTimeDisabled, { backgroundColor: theme.inputBackground }]}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={[styles.pickerText, { color: theme.text }]}>{time}</Text>
            </Pressable>
          </View>
        </View>

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

        {showTimePicker && (
          <DateTimePicker
            value={new Date(`1970-01-01T${time}:00`)}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (event.type === 'set' && selectedTime) {
                setTime(selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).slice(0, 5));
              }
            }}
          />
        )}


        {/* Prioridad */}
        <View style={styles.inlineItem}>
          <View style={styles.inlineLeft}>
            <Icon source="flag-outline" size={24} color={theme.primary} />
            <Text style={[styles.inlineLabel, { color: theme.text }]}>Prioridad</Text>
          </View>
          <TouchableOpacity
            onPress={openPriorityModal}
            disabled={!isEditing}
          >
            <Text style={[isEditing ? styles.linkText : styles.linkTextDisabled, { color: theme.text, backgroundColor: theme.inputBackground}]}>
              {priorityLabels[priority]}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recordatorio */}
        <View style={styles.inlineItem}>
          <View style={styles.inlineLeft}>
            <Icon source="bell-outline" size={24} color={theme.primary} />
            <Text style={[styles.inlineLabel, { color: theme.text }]}>Recordatorio</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setTempReminder(reminder);
              setShowReminderModal(true);
            }}
            disabled={!isEditing}
          >
            <Text style={[isEditing ? styles.linkText : styles.linkTextDisabled, { color: theme.text, backgroundColor: theme.inputBackground}]}>
              {reminderLabels[reminder]}
            </Text>
          </TouchableOpacity>
        </View>


        <Modal visible={showReminderModal} transparent animationType="fade">
          <View style={[styles.modalOverlay]}>
            <View style={[styles.dialogContent, { backgroundColor: theme.card }]}>
              <Text style={[styles.dialogTitle, { color: theme.text }]}>Selecciona el recordatorio</Text>
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
                    labelStyle={[styles.radioLabel, { color: theme.text }]}
                  />
                ))}
              </RadioButton.Group>
              <View style={styles.dialogActions}>
                <Button labelStyle={{ color: theme.buttonText }} onPress={() => setShowReminderModal(false)}>Cancelar</Button>
                <Button onPress={() => {
                  setReminder(tempReminder);
                  setShowReminderModal(false);
                }}
                  labelStyle={{ color: theme.buttonText }}>
                  Aceptar
                </Button>
              </View>
            </View>
          </View>
        </Modal>
        <Modal visible={showPriorityModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.dialogContent, { backgroundColor: theme.card }]}>
              <Text style={[styles.dialogTitle, { color: theme.text }]}>Selecciona la prioridad</Text>

              <RadioButton.Group
                onValueChange={(newValue) => setTempPriority(newValue as PriorityLevel)}
                value={tempPriority}
              >
                {(['low', 'medium', 'high'] as PriorityLevel[]).map(level => (
                  <RadioButton.Item
                    key={level}
                    labelStyle={[styles.radioLabel, { color: theme.text }]}
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
                  labelStyle={{ color: theme.buttonText }}
                >
                  Cancelar
                </Button>
                <Button
                  onPress={() => {
                    setPriority(tempPriority);
                    setShowPriorityModal(false);
                  }}
                  compact
                  labelStyle={{ color: theme.buttonText }}
                >
                  Aceptar
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        {/* Repetición */}
        <View style={styles.repeatSection}>
          <View style={[styles.repeatHeader, styles.switchRow]}>
            <View style={styles.inlineLeft}>
              <Icon source="repeat-variant" size={24} color={theme.primary} />
              <Text style={[styles.repeatLabel, styles.inlineLabel, {color:theme.text}]}>Repetir tarea</Text>
            </View>
            <View>
              <Switch
                color={theme.primary}
                value={repeat}
                disabled={!isEditing}
                onValueChange={(value) => {
                  setRepeat(value);
                  if (value && repeatInterval === 'none') {
                    setRepeatInterval('daily');
                  }
                }}
              />
            </View>
          </View>

          {repeat && (
            <View style={styles.repeatOptions}>
              <Text style={[styles.repeatTitle, {color:theme.text}]}>Frecuencia de repetición</Text>
              <View style={styles.intervalButtons}>
                {(['daily', 'weekly', 'monthly', 'yearly'] as RepeatInterval[]).map(interval => (
                  <Button
                    disabled={!isEditing}
                    key={interval}
                    mode={repeatInterval === interval ? 'contained' : 'outlined'}
                    onPress={() => setRepeatInterval(interval)}
                    style={[styles.intervalButton, { backgroundColor: (repeatInterval===interval?theme.chipSelected:theme.inputBackground), borderColor: theme.primary }]}
                    labelStyle={{ color: (repeatInterval===interval?theme.chipText:theme.text) }}
                  >
                    {repetitionLabels[interval]}
                  </Button>
                ))}
              </View>
            </View>
          )}
        </View>
        {/* Notas */}
        <Text variant="titleMedium" style={[styles.label, {color:theme.text}]}>Notas</Text>
        <TextInput
          multiline
          numberOfLines={4}
          value={note}
          onChangeText={setNote}
          style={[(isEditing) ? styles.input : styles.inputdisabled, { backgroundColor: theme.inputBackground }]}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          textColor={theme.text}
          disabled={!isEditing}
        />

        {/* Última modificación */}
        <Text variant="bodySmall" style={[styles.updatedAt, { color: theme.secondaryText }]}>
          Última modificación: {new Date(task.updatedAt).toLocaleDateString('es-MX', {
            year: 'numeric', month: '2-digit', day: '2-digit'
          })}
        </Text>
      </ScrollView >

      {/* Barra de navegación inferior */}
      <View style={[styles.bottomBar, { backgroundColor: theme.card }]}>
        <Pressable style={styles.navItem} onPress={handleMarkComplete}>

          <MaterialCommunityIcons aria-label='Botón' name={(task.completed) ? 'checkbox-marked-circle' : 'check-circle-outline'} size={24} color={theme.primary} />
          <Text style={[styles.navText, {color:theme.primary}]}>{(task.completed) ? 'Marcar como \npendiente' : 'Marcar como \ncompletada'}</Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => {
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
        >
          <MaterialCommunityIcons aria-label={'Botón ' + isEditing ? 'guardar' : 'eliminar'} name={isEditing ? 'content-save-outline' : 'pencil-outline'} size={24} color={theme.primary} />
          <Text style={[styles.navText, {color:theme.primary}]}>{isEditing ? 'Guardar' : 'Editar'}</Text>
        </Pressable>


        <Pressable style={styles.navItem} onPress={handleDelete}>
          <MaterialCommunityIcons name='delete-outline' aria-label='Botón eliminar' size={24} color={theme.primary} />
          <Text style={[styles.navText, {color:theme.primary}]}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleTask: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 6,
  },

  titleTaskDisabled: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 16,
  },
  inputdisabled: {
    borderWidth: 1,
    borderRadius: 6,
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContent: {
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
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  underlinedText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  datetimeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 12,
  },
  separatorText: {
    fontSize: 18,
    marginHorizontal: 4,
  },
  datetimeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },

  datetimeRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  dateBox: {
    maxWidth: 200,
  },
  pressableDateTime: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 6,
    fontWeight: 'bold',
  },
  pressableDateTimeDisabled: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 6,
  },
  pickerText: {
    fontSize: 16,
    padding: 8,
  },
  inlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  inlineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inlineLabel: {
    fontSize: 18,
  },
  linkText: {
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 16,
    fontWeight: 'bold',
    fontSize: 16,
    borderRadius: 8,
  },
  linkTextDisabled: {
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 16,
    fontWeight: 'bold',
    fontSize: 16,
    borderRadius: 8,
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
    marginVertical: 5,
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
    borderRadius: 12,
    marginVertical: 5,
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
    marginTop: 0,
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
    marginRight: 4,
    marginBottom: 4,
    height: 40,
  },

  updatedAt: {
    marginTop: 20,
    textAlign: 'center',
  },
  loading: {
    flex: 1,
    padding: 20,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    paddingBottom: 35,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  navText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
