import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cabecalho} >
        <Text style={styles.saudacao}>Olá, "Criança"!</Text>
        <Text style={styles.subtitulo}>Vamos aprender brincando?</Text>

        <View style={styles.profileCircle}>
          <Text style={styles.profileText}>Foto</Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F2FE',
    flex: 1,
    padding: 16,
  },
  cabecalho: {
    marginBottom: 20,
    position: 'relative',
  },
  saudacao: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },

  // Texto do subtítulo
  subtitulo: {
    fontSize: 16,
    color: '#666666',
  },
});