import React from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTrophies } from '@/hooks/useTrophies';
import { resetUserStats } from '@/store/trophiesStore';

export default function TrophyScreen() {
  const { trophies } = useTrophies();

  const unlocked = trophies.filter(t => t.unlocked);
  const locked = trophies.filter(t => !t.unlocked);

  return (
    <ScrollView style={styles.container}>
      <Button
        title="Reiniciar progreso de trofeos"
        onPress={async () => {
          await resetUserStats();
          console.log('Estadísticas reiniciadas');
        }}
        color="#4caf50"
      />
      <Text style={styles.header}>
        Trofeos desbloqueados: {unlocked.length} / {trophies.length}
      </Text>

      {/* Sección desbloqueados */}
      <Text style={styles.sectionTitle}>🏆 Desbloqueados</Text>
      {unlocked.length > 0 ? unlocked.map(t => (
        <View style={styles.trophyCard} key={t.id}>
          <AntDesign name={t.icon as any} size={36} color="#4caf50" />
          <Text style={styles.trophyText}>{t.title}</Text>
        </View>
      )) : <Text style={styles.empty}>Aún no has desbloqueado trofeos</Text>}

      {/* Sección bloqueados */}
      <Text style={styles.sectionTitle}>🔒 Bloqueados</Text>
      {locked.map(t => (
        <View style={[styles.trophyCard, styles.lockedCard]} key={t.id}>
          <AntDesign name={t.icon as any} size={36} color="#aaa" />
          <Text style={[styles.trophyText, styles.lockedText]}>{t.title}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#333',
  },
  trophyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  trophyText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  lockedCard: {
    backgroundColor: '#e0e0e0',
  },
  lockedText: {
    color: '#777',
  },
  empty: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginLeft: 8,
  },
});
