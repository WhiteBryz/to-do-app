import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';

interface ChipFilterProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export default function ChipFilter({ label, selected, onSelect }: ChipFilterProps) {
  const theme = useTheme();

  const chipBackgroundColor = selected
    ? theme.chipSelected
    : theme.chipUnselectedBackground;

  const chipTextColor = selected
    ? theme.chipText
    : theme.chipUnselectedText;

  const chipBorderColor = selected
    ? theme.chipSelected
    : theme.primary;

  return (
    <Chip
      mode="outlined"
      onPress={onSelect}
      style={[
        styles.chip,
        {
          backgroundColor: chipBackgroundColor,
          borderColor: chipBorderColor,
        },
      ]}
      textStyle={{ color: chipTextColor }}
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


