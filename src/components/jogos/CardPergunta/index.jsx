import { StyleSheet, Text, View } from "react-native";

export const CardPergunta = ({ question, currentQuestion, totalQuestions }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.questionNumber}>
                    Pergunta {currentQuestion} de {totalQuestions}
                </Text>
            </View>

            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>
                    {question}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginVertical: 20,
        width: '100%',
        borderWidth: 3,
        borderColor: '#137fec',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    questionNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#137fec',
    },
    questionContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    questionText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
});
