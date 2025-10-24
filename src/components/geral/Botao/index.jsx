import { Pressable, StyleSheet, Text } from "react-native";

export const Botao = ({ title, onPress, variant = 'primary' }) => {
    const getButtonStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.buttonSecondary;
            case 'success':
                return styles.buttonSuccess;
            case 'danger':
                return styles.buttonDanger;
            default:
                return styles.buttonPrimary;
        }
    };

    return (
        <Pressable style={getButtonStyle()} onPress={onPress}>
            <Text style={styles.buttonText}>
                {title}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    buttonPrimary: {
        backgroundColor: '#137fec',
        borderRadius: 32,
        padding: 8,
        paddingHorizontal: 80,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSecondary: {
        backgroundColor: '#64748B',
        borderRadius: 32,
        padding: 8,
        paddingHorizontal: 80,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSuccess: {
        backgroundColor: '#10B981',
        borderRadius: 32,
        padding: 8,
        paddingHorizontal: 80,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDanger: {
        backgroundColor: '#EF4444',
        borderRadius: 32,
        padding: 8,
        paddingHorizontal: 80,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
