import { Task } from '@/types/task';
import { HStack, VStack } from '@react-native-material/core';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import IconButton from './IconCompleteTask';

interface TaskComponentProps {
    task: Task;
    onCheck: () => void;
}

export default function TaskComponent(props: TaskComponentProps) {
    const taskDetails = props.task;

    const PriorityLevel = {
        'low': {
            'title': "Bajo",
            'color': "#66ff66"
        },
        'medium': {
            'title': "Medio",
            'color': "#ffff00",
        },
        'high': {
            'title': "Alto",
            'color': "#ff3300"
        }
    }

    const styles = StyleSheet.create({
        taskContainer: {
            height: 80,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            paddingVertical: 10,
            backgroundColor: "yellow",
        },
        taskTextContainer: {
            width: "70%",
            marginLeft: 5,
        },
        taskHour: {},
        taskDate: {},
        taskPriorityContainer: {
            padding: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        taskPriority: {
            padding: 5,
            borderRadius: 5,
        },
        taskTextConditional: {
            textDecorationLine: taskDetails.completed ? "line-through" : "none",
            fontStyle: taskDetails.completed ? "italic" : "normal",
        },
        taskTitle: {
            fontSize: 17,
            fontWeight: 600,
        },
        taskDescription: {
            fontSize: 12
        }
    })
    return (
        <HStack style={styles.taskContainer}>
            {/* Icono que cambia cuando se toca */}
            <IconButton onCheck={props.onCheck} isChecked={taskDetails.completed} />
            {/* Texto con la información de la tarea */}
            <VStack style={styles.taskTextContainer}>
                <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.taskTitle, styles.taskTextConditional]}>{taskDetails.title}</Text>
                <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.taskDescription, styles.taskTextConditional]}>{taskDetails.description}</Text>
                <Text>{taskDetails.date.split('T')[0]} - {taskDetails.time}</Text>
            </VStack>
            {/* Nivel de prioridad */}
            <VStack style={styles.taskPriorityContainer}>
                <Text style={[
                    styles.taskPriority,
                    { backgroundColor: PriorityLevel[taskDetails.priority]?.color || 'gray' }
                ]}>
                    {PriorityLevel[taskDetails.priority]?.title || 'Sin prioridad'}
                </Text>
            </VStack>
        </HStack>
    )
}