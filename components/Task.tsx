import { useTheme } from '@/context/ThemeContext';
import { Task } from '@/types/task';
import formatCustomDateTime from '@/utils/formatCustomDateTime';
import { HStack, VStack } from '@react-native-material/core';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import IconButton from './IconCompleteTask';

interface TaskComponentProps {
    task: Task;
    onCheck: () => Promise<void>;
}

export default function TaskComponent(props: TaskComponentProps) {
    const { task } = props;
    const theme = useTheme();

    const PriorityLevel = {
        'low': { title: 'Baja', color: theme.priorityLow },
        'medium': { title: 'Media', color: theme.priorityMedium },
        'high': { title: 'Alta', color: theme.priorityHigh },
    };

    const styles = StyleSheet.create({
        taskContainer: {
            height: 90,
            width: '100%',
            flexDirection: 'row',
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: theme.taskCardBackground,
            marginBottom: 10,
        },
        taskTextContainer: {
            width: '68%',
            marginLeft: 5,
            paddingRight: 10,
        },
        taskDateTime: {
            color: theme.dateText,
            marginTop: 10,
        },
        taskPriorityContainer: {
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        taskPriority: {
            padding: 5,
            borderRadius: 15,
            width: 50,
            textAlign: 'center',
            fontWeight: '500',
            color: theme.text,
        },
        taskTextConditional: {
            textDecorationLine: task.completed ? 'line-through' : 'none',
            fontStyle: task.completed ? 'italic' : 'normal',
            color: theme.text,
        },
        taskTitle: {
            fontSize: 17,
            fontWeight: '600',
        },
        taskDescription: {
            fontSize: 12,
        },
    });

    return (
        <HStack style={styles.taskContainer}>
            <IconButton onCheck={props.onCheck} isChecked={task.completed} />
            <VStack style={styles.taskTextContainer}>
                <Text numberOfLines={1} style={[styles.taskTitle, styles.taskTextConditional]}>{task.title}</Text>
                <Text numberOfLines={1} style={[styles.taskDescription, styles.taskTextConditional]}>{task.description}</Text>
                <Text style={styles.taskDateTime}>{formatCustomDateTime(task.date, task.time)}</Text>
            </VStack>
            <VStack style={styles.taskPriorityContainer}>
                <Text style={[styles.taskPriority, { backgroundColor: PriorityLevel[task.priority]?.color || theme.priorityLow }, {color: theme.background}]}>
                    {PriorityLevel[task.priority]?.title || 'Sin prioridad'}
                </Text>
            </VStack>
        </HStack>
    );
}