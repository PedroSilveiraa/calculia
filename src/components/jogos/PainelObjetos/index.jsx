import React from "react";
import { StyleSheet, View } from "react-native";
import { ObjetoContavel } from "../ObjetoContavel";

export const PainelObjetos = React.memo(({ objetos, onObjetoPress }) => {
    return (
        <View style={styles.container}>
            {objetos.map((obj) => (
                <ObjetoContavel
                    key={obj.id}
                    emoji={obj.emoji}
                    numero={obj.numero}
                    isContado={obj.isContado}
                    onPress={() => onObjetoPress(obj.id)}
                />
            ))}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        backgroundColor: 'white',
        marginVertical: 20,
    },
});
