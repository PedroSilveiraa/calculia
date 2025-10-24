import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Botao } from '../../components/geral/Botao';

export default function jogos() {
  return (
    <SafeAreaView style={styles.container}>
      <Botao title="🧮 Jogo de Soma" onPress={() => router.navigate('/jogos/jogoSoma')} />
      <Botao title="🔢 Jogo de Contagem" onPress={() => router.navigate('/jogos/jogoContagem')} style={styles.buttonSpacing} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F2FE',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    padding: 20,
  },
  buttonSpacing: {
    marginTop: 15,
  },
});
