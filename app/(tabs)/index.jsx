import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../../services/storage';

export default function index() {

  const [nome, setNome] = useState('');

  useFocusEffect(
    useCallback(() => {
      const buscarNome = async () => {
        const userData = await StorageService.getUserData();

        if (userData) {
          setNome(userData.name);
        }
      };

      buscarNome();
    }, [])
  );


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Página Inicial</Text>
      <View style={styles.cabecalho} >
        <Text style={styles.saudacao}>Olá, {nome}</Text>
        <Text style={styles.subtitulo}>Vamos aprender brincando?</Text>

        <View style={styles.profileCircle}>
          <Text style={styles.profileText}>Foto</Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titulo:
  {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
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
