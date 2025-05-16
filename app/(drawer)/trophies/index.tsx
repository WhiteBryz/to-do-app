import React from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTrophies } from '@/hooks/useTrophies';

export default function TrophyScreen() {
  const { trophies } = useTrophies();

  const unlocked = trophies.filter(t => t.unlocked);
  const locked = trophies.filter(t => !t.unlocked);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Trofeos desbloqueados: {unlocked.length} / {trophies.length}</Text>


      {unlocked.map(t => (
        <View style={styles.trophy} key={t.id}>
          <AntDesign name={t.icon as any} size={30} color="#4caf50" />
          <Text style={styles.title}>{t.title}</Text>
        </View>
      ))}

      {locked.map(t => (
        <View style={styles.trophy} key={t.id}>
          <AntDesign name={t.icon as any} size={30} color="#ccc" />
          <Text style={[styles.title, { color: '#ccc' }]}>{t.title}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  trophy: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { marginLeft: 10, fontSize: 16 }
});
