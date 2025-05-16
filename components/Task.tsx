import { Task } from '@/types/task';
import formatCustomDateTime from '@/utils/formatCustomDateTime';
import { Divider, HStack, VStack } from '@react-native-material/core';
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

    console.log(formatCustomDateTime(taskDetails.date, taskDetails.time))


    const styles = StyleSheet.create({
        taskContainer: {
            height: 90,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            paddingVertical: 10,
            backgroundColor: "gray",
            borderRadius: 20,
        },
        taskTextContainer: {
            width: "68%",
            marginLeft: 5,
            paddingRight: 10
        },
        taskDateTime: {
            color: "orange"
        },
        taskPriorityContainer: {
            padding: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        taskPriority: {
            padding: 5,
            borderRadius: 15,
            width: 50,
            textAlign: "center",
            fontWeight: 500
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
        },
        divider: {
            margin: 5,
            opacity: 0.4
        }
    })
    return (
        <>
            <HStack style={styles.taskContainer}>
                {/* Icono que cambia cuando se toca */}
                <IconButton onCheck={props.onCheck} isChecked={taskDetails.completed} />
                {/* Texto con la información de la tarea */}
                <VStack style={styles.taskTextContainer}>
                    {/* Título */}
                    <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.taskTitle, styles.taskTextConditional]}>{taskDetails.title}</Text>
                    {/* Descripción */}
                    <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.taskDescription, styles.taskTextConditional]}>{taskDetails.description}</Text>
                    {/* Fecha y Hora */}
                    <Text>{formatCustomDateTime(taskDetails.date, taskDetails.time)}</Text>
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
            <Divider style={styles.divider} color="gray"/>
        </>
    )
}