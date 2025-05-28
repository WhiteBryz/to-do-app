import click from '@/assets/sounds/click.mp3';
import { useTheme } from '@/context/ThemeContext';
import { useSound } from '@/hooks/useSound';
import { addTask as addTaskStorage } from '@/store/taskStore';
import { evaluateTrophies, getUserStats, updateUserStats } from '@/store/trophiesStore';
import { PriorityLevel, ReminderOption, RepeatInterval, Task } from '@/types/task';
import { buildTaskDate, getReminderDate } from '@/utils/handleNotifications';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { HStack, VStack } from "@react-native-material/core";
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { Button, Icon, RadioButton, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewTaskModal() {
  const router = useRouter();
  // Estados de la tarea
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [date, setDate] = useState<Date>(() => new Date());
  const [time, setTime] = useState<Date>(() => new Date());
  const [reminder, setReminder] = useState<ReminderOption>('none');
  const [repeat, setRepeat] = useState<boolean>(false);
  const [repeatInterval, setRepeatInterval] = useState<RepeatInterval>('none');
  const [createdBy, setCreateBy] = useState<string>('')
  const [assignedTo, setAssignedTo] = useState<string>('')
  
  // Estados de los componentes
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { playSound } = useSound()
  const theme = useTheme()
  //const [task, setTask] = useState<Task | null>(null);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [tempPriority, setTempPriority] = useState<PriorityLevel>(priority);
  const [tempReminder, setTempReminder] = useState(reminder);
  const [showReminderModal, setShowReminderModal] = useState(false);

  const openPriorityModal = () => {
    setTempPriority(priority);
    setShowPriorityModal(true);
  }
  // Formatea fecha a texto legible
  const formatDate = (date: Date) =>
    date.toLocaleDateString('es-MX', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
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
      createdBy,
      assignedTo
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
        <VStack style={{ flex: 1, flexDirection: 'column' }}>
          <VStack >
            <Text variant="titleMedium" style={[styles.label, { color: theme.text, marginTop: 20 }]}>Título de la tarea</Text>
            <TextInput
              placeholder='Escribe el título de tu tarea...'
              value={title}
              onChangeText={setTitle}
              style={[{ marginBottom: 20 }, { backgroundColor: theme.inputBackground, marginBottom: 16 }]}
              underlineColor={theme.primary}
              textColor={theme.text}
              theme={{ colors: { primary: theme.primary, text: theme.text } }}
            />
            <Text variant="titleMedium" style={[styles.label, { color: theme.text, marginTop: 20 }]}>Descripción</Text>
            <TextInput
              placeholder="Describe tu tarea..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={[styles.input, { backgroundColor: theme.inputBackground }]}
              underlineColor={theme.primary}
              textColor={theme.text}
              theme={{ colors: { primary: theme.primary, text: theme.text } }}
            />
          </VStack>
          {/* Inicia */}
          {/* Fecha y hora */}
          <View style={styles.datetimeWrapper}>
            <View style={styles.datetimeLeft}>
              <MaterialCommunityIcons name="calendar" size={24} color={theme.primary} />
              <Pressable
                style={[
                  styles.pressableDateTime,
                  styles.dateBox,
                  { backgroundColor: theme.inputBackground }
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.pickerText, { color: theme.text }]}>{formatDate(date)}</Text>
              </Pressable>
            </View>

            <View style={styles.datetimeRight}>
              <Text style={[styles.separatorText, { color: theme.text }]}>a las</Text>
              <Pressable
                style={[styles.pressableDateTime, { backgroundColor: theme.inputBackground }]}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={[styles.pickerText, { color: theme.text }]}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).slice(0, 5)}</Text>
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

          {/* Termina */}

          {/* Prioridad */}
          <View style={styles.inlineItem}>
            <View style={styles.inlineLeft}>
              <Icon source="flag-outline" size={20} color={theme.primary} />
              <Text style={[styles.inlineLabel, { color: theme.text }]}>Prioridad</Text>
            </View>
            <TouchableOpacity
              onPress={openPriorityModal}
              style={[styles.linkButton]}
            >
              <Text style={[styles.linkText, { color: theme.background, backgroundColor: theme.buttonBackground }]}>
                {priorityLabels[priority]}
              </Text>
            </TouchableOpacity>
          </View>

          {/*Recordatorio */}
          <View style={[styles.inlineItem, { marginBottom: 20 }]}>
            <View style={styles.inlineLeft}>
              <Icon source="bell-outline" size={20} color={theme.primary} />
              <Text style={[styles.inlineLabel, { color: theme.text }]}>Recordatorio</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setTempReminder(reminder);
                setShowReminderModal(true);
              }}
              style={[styles.linkButton]}
            >
              <Text style={[styles.linkText, { color: theme.background, backgroundColor: theme.buttonBackground }]}>
                {reminderLabels[reminder]}
              </Text>
            </TouchableOpacity>
          </View>

          <Modal visible={showReminderModal} transparent animationType="fade">
            <View style={styles.modalOverlay}>
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
                  <Button onPress={() => setShowReminderModal(false)}
                    labelStyle={{ color: theme.buttonText }}>Cancelar</Button>
                  <Button onPress={() => {
                    setReminder(tempReminder);
                    setShowReminderModal(false);
                  }}
                    labelStyle={{ color: theme.primary }}>
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
                    style={{ marginLeft: 8 }}
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
          {/*Termina */}

          {/*Empieza */}
          {/* Repetición */}
          <View style={styles.repeatSection}>
            <View style={[styles.repeatHeader, styles.switchRow]}>
              <View style={styles.inlineLeft}>
                <Icon source="repeat-variant" size={20} color={theme.primary} />
                <Text style={[styles.repeatLabel, styles.inlineLabel, { color: theme.text }]}>Repetir tarea</Text>
              </View>
              <View>
                <Switch
                  value={repeat}
                  onValueChange={(value) => {
                    setRepeat(value);
                    if (value && repeatInterval === 'none') {
                      setRepeatInterval('daily');
                    }
                  }}
                  trackColor={{ false: 'darkgray', true: theme.primary }}
                />
              </View>
            </View>

            {repeat && (
              <View style={styles.repeatOptions}>
                <Text style={[styles.repeatTitle, { color: theme.text }]}>Frecuencia de repetición</Text>
                <View style={styles.intervalButtons}>
                  {(['daily', 'weekly', 'monthly', 'yearly'] as RepeatInterval[]).map(interval => (
                    <Button
                      key={interval}
                      mode={repeatInterval === interval ? 'contained' : 'outlined'}
                      onPress={() => setRepeatInterval(interval)}
                      style={[styles.intervalButton, { backgroundColor: repeatInterval === interval ? theme.buttonBackground : theme.background }]}
                      textColor={repeatInterval === interval ? theme.background : theme.secondaryText} // Cambia el color de fondo y texto según el tema
                    >
                      {repetitionLabels[interval]}
                    </Button>
                  ))}
                </View>
              </View>
            )}
          </View>


          {/*Termina */}

          {/* Inicia */}
          {/* Notas */}
          <Text variant="titleMedium" style={[styles.label, { color: theme.text, marginTop: 20 }]}>Notas</Text>
          <TextInput
            placeholder="Escribe una nota..."
            mode="outlined"
            multiline
            numberOfLines={4}
            value={note}
            onChangeText={setNote}
            style={[styles.input, { backgroundColor: theme.inputBackground }]}
            underlineColor={theme.primary}
            textColor={theme.text}
          />
          {/*Termina */}
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
  titleTask: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    borderColor: '#6A6961',
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },

  titleTaskDisabled: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  input: {
    borderColor: '#6A6961',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 20,
  },
  inputdisabled: {
    backgroundColor: '#E5E5E5',
    borderColor: '#d0d0d0',
    borderRadius: 6,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 12,
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
    maxWidth: 200, // puedes ajustar esto según necesidad
  },
  pressableDateTime: {
    paddingVertical: 4,
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: '#6A6961',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    fontWeight: 'bold',
    marginVertical: 12
  },
  pressableDateTimeDisabled: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    backgroundColor: '#E5E5E5',
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
    color: '#424242',
  },
  linkButton: {
    paddingHorizontal: 4,
    marginBottom: 16
  },
  linkButtonDisabled: {
    paddingHorizontal: 4,
  },
  linkText: {
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 16,
    //borderColor: '#6A6961',
    fontWeight: 'bold',
    fontSize: 16,
    //color: '#000000',
    //backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  linkTextDisabled: {
    color: '#9e9e9e',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderColor: '#d0d0d0',
    backgroundColor: '#E5E5E5',
    fontWeight: 'bold',
    fontSize: 16,
    borderRadius: 4,
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
  repeatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    color: '#666',
  },
  loading: {
    flex: 1,
    padding: 20,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    paddingBottom: 30,
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
