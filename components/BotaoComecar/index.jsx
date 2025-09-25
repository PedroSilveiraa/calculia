import { Pressable, StyleSheet, Text } from "react-native";

export const BotaoComecar = ({title,  onPress}) => {
    return (
        <Pressable style={styles.button} onPress={onPress}>
           
            <Text style={styles.buttonText}>
                {title}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({

    button: {
        backgroundColor: '#137fec',
        borderRadius: 32,
        padding: 8,
        paddingHorizontal: 80,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#021123',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },

})
