import { FilterOption } from '@/types/task';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';

const filters = [
  { id: 'today', label: 'Hoy' },
  { id: 'tomorrow', label: 'Mañana' },
  { id: 'week', label: 'Esta semana' },
  { id: 'all', label: 'Todas' },
];

interface ChipFilterProps {
  selected: string;
  onSelect: (filter: FilterOption) => void;
}

export default function ChipFilter({ selected, onSelect }: ChipFilterProps){
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      {filters.map((filter) => (
        <Chip
          key={filter.id}
          mode="outlined"
          selected={selected === filter.id}
          onPress={() => onSelect(filter.id as FilterOption)}
          style={[
            styles.chip,
            selected === filter.id && { backgroundColor: theme.colors.primary }
          ]}
          textStyle={selected === filter.id ? { color: 'white' } : {}}
        >
          {filter.label}
        </Chip>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8
  },
  chip: {
    height: 30,
    marginRight:8,
  },
});
