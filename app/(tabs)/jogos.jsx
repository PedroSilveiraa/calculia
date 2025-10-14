import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BotaoComecar } from '../../components/BotaoComecar';

export default function jogos() {
  return (
    <SafeAreaView style={styles.container}>

    <BotaoComecar title="Jogo 1" onPress={() => router.replace('/index')} />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F2FE',
    flex: 1,

  },


});
