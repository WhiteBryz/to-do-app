import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar, useTheme } from 'react-native-paper';

interface ProgressBarProps {
    completed: number;
    total: number;
}

export default function ProgressBarComponent({ completed, total }: ProgressBarProps) {
    const theme = useTheme();
    const progress = total > 0 ? completed / total : 0;

    return (
        <View style={styles.container}>
            
            {
                total > 0 ?
                    <Text style={styles.text}>
                        {completed} de {total} tareas completadas
                    </Text> :
                    <Text style={styles.text}>
                        No hay tareas agregadas
                    </Text>
            }

            <ProgressBar
                progress={progress}
                color={theme.colors.primary}
                style={styles.progressBar}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    text: {
        color: 'black',
        marginBottom: 8,
    },
    progressBar: {
        height: 10,
        borderRadius: 4,
    },
});