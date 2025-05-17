// components/CustomToast.tsx
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CustomToast({
  visible,
  title,
  message,
}: {
  visible: boolean;
  title: string;
  message?: string;
}) {
  const theme = useTheme();

  if (!visible) return null;

  const isDark = theme.background === '#121212' || theme.text === '#fff';

  return (
    <View style={[styles.container, isDark ? styles.darkToast : styles.lightToast]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {message && <Text style={[styles.message, { color: theme.text }]}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    borderRadius: 12,
    padding: 14,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderLeftWidth: 5,
  },
  darkToast: {
    backgroundColor: '#2c2c2c',
    borderLeftColor: '#BB86FC',
  },
  lightToast: {
    backgroundColor: '#fff',
    borderLeftColor: '#6200EE',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
  },
});
