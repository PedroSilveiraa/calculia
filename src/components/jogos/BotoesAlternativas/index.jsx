import { Pressable, StyleSheet, Text, View } from "react-native";

export const BotoesAlternativas = ({ alternativas, onSelect, respostaSelecionada, respostaCorreta, showFeedback }) => {
    const getButtonStyle = (alternativa) => {
        if (!showFeedback) {
            return respostaSelecionada === alternativa ? styles.buttonSelected : styles.button;
        }

        if (alternativa === respostaCorreta) {
            return styles.buttonCorrect;
        }

        if (respostaSelecionada === alternativa && alternativa !== respostaCorreta) {
            return styles.buttonWrong;
        }

        return styles.buttonDisabled;
    };

    return (
        <View style={styles.container}>
            {alternativas.map((alt) => (
                <Pressable
                    key={alt}
                    style={getButtonStyle(alt)}
                    onPress={() => onSelect(alt)}
                    disabled={showFeedback}
                >
                    <Text style={styles.buttonText}>{alt}</Text>
                </Pressable>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        padding: 20,
    },
    button: {
        backgroundColor: '#137fec',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 40,
        minWidth: 80,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#0c5bb5',
    },
    buttonSelected: {
        backgroundColor: '#0c5bb5',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 40,
        minWidth: 80,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#137fec',
    },
    buttonCorrect: {
        backgroundColor: '#10B981',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 40,
        minWidth: 80,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#059669',
    },
    buttonWrong: {
        backgroundColor: '#EF4444',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 40,
        minWidth: 80,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#DC2626',
    },
    buttonDisabled: {
        backgroundColor: '#94A3B8',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 40,
        minWidth: 80,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#64748B',
    },
    buttonText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
    },
});
