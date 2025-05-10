import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Checkbox, RadioButton, Text, TextInput } from 'react-native-paper';

export default function NewTaskModal() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminder, setReminder] = useState('10');
  const [repeat, setRepeat] = useState(false);

  const handleSave = () => {
    // Aquí iría la lógica para guardar la tarea en el estado global o BD
    console.log({
      title,
      description,
      date,
      time,
      reminder,
      repeat
    });
    router.back(); // Cierra el modal
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge">Nueva Tarea</Text>

      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      {/* Fecha */}
      <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.input}>
        Seleccionar fecha: {date.toLocaleDateString()}
      </Button>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {/* Hora */}
      <Button mode="outlined" onPress={() => setShowTimePicker(true)} style={styles.input}>
        Seleccionar hora: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Button>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={(_, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

      {/* Recordatorio */}
      <Text variant="labelLarge" style={{ marginTop: 16 }}>Recordatorio</Text>
      <RadioButton.Group onValueChange={setReminder} value={reminder}>
        <RadioButton.Item label="5 min antes" value="5" />
        <RadioButton.Item label="10 min antes" value="10" />
        <RadioButton.Item label="30 min antes" value="30" />
        <RadioButton.Item label="1 día antes" value="1440" />
      </RadioButton.Group>

      {/* Repetir */}
      <View style={styles.repeat}>
        <Checkbox
          status={repeat ? 'checked' : 'unchecked'}
          onPress={() => setRepeat(!repeat)}
        />
        <Text>Repetir tarea</Text>
      </View>

      <Button mode="contained" onPress={handleSave} style={{ marginTop: 16 }}>
        Guardar Tarea
      </Button>
    </ScrollView>
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
});
