import { router } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import { BotaoComecar } from "../components/BotaoComecar";
import { MensagemTelaInicial } from "../components/MensagemTelaInicial";



export default function Index() {

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/calculia/logo.png')} style={styles.logo} />

      <MensagemTelaInicial />

      <Image source={require('../assets/images/calculia/avatar-robo.png')} style={styles.logo} />
      <BotaoComecar title="Começar" onPress={() => router.replace('/(tabs)')} />


    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F2FE',
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
});