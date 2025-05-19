import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useTheme } from '@/context/ThemeContext';

interface ProgressBarProps {
    completed: number;
    total: number;
}

export default function ProgressBarComponent({ completed, total }: ProgressBarProps) {
    const theme = useTheme();
    const progress = total > 0 ? completed / total : 0;

    return (
        <View style={styles.container}>
            <Text style={[styles.text, { color: theme.progressText }]}>
                {total > 0 ? `${completed} de ${total} tareas completadas` : 'No hay tareas agregadas'}
            </Text>
            <ProgressBar
                progress={progress}
                color={theme.primary}
                style={[styles.progressBar, { backgroundColor: theme.progressBackground }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    text: {
        marginBottom: 8,
    },
    progressBar: {
        height: 20,
        borderRadius: 12,
    },
});
