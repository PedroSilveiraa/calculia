import { router } from "expo-router";
import { StyleSheet, View } from "react-native";


export default function TelaPrincipal() {


    return (
        <View style={styles.container}>
            

            
        <BotaoComecar title="Quero Iniciar!" onPress={() => router.replace('/pomodoro')}/>
                

          


        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#f3f4f6',
    },
}) 