import { Pressable, StyleSheet, Text } from "react-native";

export const BotaoResposta = ({ text, onPress, disabled, isCorrect, isWrong, isSelected }) => {
    const getButtonStyle = () => {
        if (disabled && isCorrect) return styles.correctButton;
        if (disabled && isWrong && isSelected) return styles.wrongButton;
        if (disabled) return styles.disabledButton;
        return styles.button;
    };

    return (
        <Pressable
            style={getButtonStyle()}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={styles.buttonText}>
                {text}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#137fec',
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        width: '100%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#0c5bb5',
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    correctButton: {
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        width: '100%',
        alignItems: 'center',
        borderWidth: 2,
    },
    wrongButton: {
        backgroundColor: '#EF4444',
        borderColor: '#DC2626',
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        width: '100%',
        alignItems: 'center',
        borderWidth: 2,
    },
    disabledButton: {
        backgroundColor: '#94A3B8',
        borderColor: '#64748B',
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        width: '100%',
        alignItems: 'center',
        borderWidth: 2,
    },
});
