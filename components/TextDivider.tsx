import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface TextDividerProps {
    showComponente: boolean;
    text: string;
    style?: StyleProp<TextStyle>;
}

export default function TextDivider({ showComponente = true, text, style = {} }: TextDividerProps) {
    const theme = useTheme();
    if (!showComponente) return null;
    return (
        <Text style={[styles.TextSeparator, { color: theme.text }, style]}>{text}</Text>
    );
}

const styles = StyleSheet.create({
    TextSeparator: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
});
