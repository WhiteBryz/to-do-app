import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Box, Button } from '@react-native-material/core';
import React from 'react';
import { StyleSheet } from 'react-native';

interface IconButtonProps {
    onCheck: () => Promise<void>,
    isChecked: boolean
}

export default function IconButton(props: IconButtonProps) {
    return (
        <Box
            style={styles.taskBox}
        >
            <Button
                onPress={props.onCheck}
                title=""
                variant='text'
                leading={() => <MaterialCommunityIcons 
                    name={props.isChecked ? 
                            'checkbox-marked-circle-outline' : 
                            'checkbox-blank-circle-outline'} 
                color="purple" 
                size={20} />}
            />
        </Box>
    );
}


const styles = StyleSheet.create({
    taskBox: {
        width: 40,
    }
});