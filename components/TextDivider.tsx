import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";


interface TextDividerProps {
    showComponente: boolean;
    text: string;
    style?: StyleProp<TextStyle>;
}

export default function TextDivider({
    showComponente = true,
    text,
    style = {}
}: TextDividerProps) {
    if (!showComponente) return null
    return (
        <Text style={[styles.TextSeparator, style]}>{text}</Text>
    )
}

const styles = StyleSheet.create({
    TextSeparator: {
        fontSize: 16,
        fontWeight: 600,
        marginBottom: 5,
        visibility: "none"
    }
})