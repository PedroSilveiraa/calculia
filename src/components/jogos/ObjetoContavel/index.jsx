import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export const ObjetoContavel = React.memo(({ emoji, numero, onPress, isContado }) => {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Text style={styles.emoji}>{emoji}</Text>
            {isContado && (
                <View style={styles.numeroBadge}>
                    <Text style={styles.numeroTexto}>{numero}</Text>
                </View>
            )}
        </Pressable>
    );
});

const styles = StyleSheet.create({
    container: {
        width: 80,
        height: 80,
        margin: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        position: 'relative',
    },
    emoji: {
        fontSize: 40,
    },
    numeroBadge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#EF4444',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    numeroTexto: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
