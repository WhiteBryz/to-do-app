import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';

interface ChipFilterProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  selectedBackground: string;
  selectedTextColor: string;
  unselectedBackground: string;
  unselectedTextColor: string;
}

export default function ChipFilter({ label, selected, onSelect }: ChipFilterProps) {
  const theme = useTheme();

  return (
    <Chip
      mode="outlined"
      onPress={onSelect}
      style={[
        styles.chip,
        selected && { backgroundColor: theme.colors.primary }
      ]}
      textStyle={selected ? { color: 'white' } : {}}
    >
      {label}
    </Chip>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 30,
    marginRight: 8,
  },
});


