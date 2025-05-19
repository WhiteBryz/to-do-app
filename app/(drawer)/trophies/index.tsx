import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTrophies } from '@/hooks/useTrophies';
import { useFocusEffect } from 'expo-router';
import { getUserStats, updateUserStats, evaluateTrophies } from '@/store/trophiesStore';
import { useTheme } from '@/context/ThemeContext';

export default function TrophyScreen() {
  const { trophies } = useTrophies();
  const theme = useTheme();

  const unlocked = trophies.filter(t => t.unlocked);
  const locked = trophies.filter(t => !t.unlocked);

  useFocusEffect(
    useCallback(() => {
      const checkFirstVisit = async () => {
        const stats = await getUserStats();
        if (!stats.firstTrophy) {
          await updateUserStats({ firstTrophy: true });
          await evaluateTrophies();
        }
      };
      checkFirstVisit();
    }, [])
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>
        Trofeos desbloqueados: {unlocked.length} / {trophies.length}
      </Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>🏆 Desbloqueados</Text>
      {unlocked.length > 0 ? (
        unlocked.map(t => (
          <View style={[styles.trophyCard, { backgroundColor: theme.card }]} key={t.id}>
            <AntDesign name={t.icon as any} size={36} color={theme.trophyGold} />
            <Text style={[styles.trophyText, { color: theme.text }]}>{t.title}</Text>
          </View>
        ))
      ) : (
        <Text style={[styles.empty, { color: theme.secondaryText }]}>
          Aún no has desbloqueado trofeos
        </Text>
      )}

      <Text style={[styles.sectionTitle, { color: theme.text }]}>🔒 Bloqueados</Text>
      {locked.map(t => (
        <View style={[styles.trophyCard, { backgroundColor: theme.surface }]} key={t.id}>
          <AntDesign name={t.icon as any} size={36} color={theme.secondaryText} />
          <Text style={[styles.trophyText, { color: theme.secondaryText }]}>{t.title}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
  },
  trophyCard: {
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
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: '80%',
  },
  empty: {
    fontSize: 14,
    fontStyle: 'italic',
    marginLeft: 8,
  },
});
