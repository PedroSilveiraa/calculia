import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarraProgresso } from '../../components/geral/BarraProgresso';
import { ProgressoFasesDatabase } from '../../services/progressoFasesDatabase';
import { StorageService } from '../../services/storage';

// Pontuação máxima possível nos jogos
const PONTUACAO_MAXIMA_SOMA = 500; // 50 + 75 + 100 + 125 + 150
const PONTUACAO_MAXIMA_CONTAGEM = 500; // 50 + 75 + 100 + 125 + 150

export default function index() {

  const [nome, setNome] = useState('');
  const [progressoSoma, setProgressoSoma] = useState({
    pontuacaoTotal: 0,
    porcentagem: 0,
    fasesCompletas: 0,
    totalFases: 5
  });
  const [progressoContagem, setProgressoContagem] = useState({
    pontuacaoTotal: 0,
    porcentagem: 0,
    fasesCompletas: 0,
    totalFases: 5
  });

  useFocusEffect(
    useCallback(() => {
      const carregarDados = async () => {
        // Carrega nome do usuário
        const userData = await StorageService.getUserData();
        if (userData) {
          setNome(userData.name);
        }

        // Carrega progresso do jogo de soma
        const { pontuacaoTotal, porcentagem, fasesCompletas, totalFases } =
          await ProgressoFasesDatabase.calcularProgressoTotal('soma', PONTUACAO_MAXIMA_SOMA);

        setProgressoSoma({
          pontuacaoTotal,
          porcentagem,
          fasesCompletas,
          totalFases
        });

        // Carrega progresso do jogo de contagem
        const progressoContagemResult = await ProgressoFasesDatabase.calcularProgressoTotal('contagem', PONTUACAO_MAXIMA_CONTAGEM);

        setProgressoContagem({
          pontuacaoTotal: progressoContagemResult.pontuacaoTotal,
          porcentagem: progressoContagemResult.porcentagem,
          fasesCompletas: progressoContagemResult.fasesCompletas,
          totalFases: progressoContagemResult.totalFases
        });
      };

      carregarDados();
    }, [])
  );


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Página Inicial</Text>

      <View style={styles.cabecalho} >
        <Text style={styles.saudacao}>Olá, {nome}</Text>
        <Text style={styles.subtitulo}>Vamos aprender brincando?</Text>
      </View>

      <View style={styles.progressoContainer}>

        <View style={styles.progressoCard}>
          <Text style={styles.progressoTitulo}>🧮 Jogo de Soma</Text>

          <BarraProgresso
            progresso={progressoSoma.porcentagem}
            titulo="Progresso Total"
            mostrarTextoDetalhes={`${progressoSoma.pontuacaoTotal} de ${PONTUACAO_MAXIMA_SOMA} pontos • ${progressoSoma.fasesCompletas}/${progressoSoma.totalFases} fases`}
          />

          {progressoSoma.porcentagem === 100 && (
            <View style={styles.completoCard}>
              <Text style={styles.completoTexto}>🏆 Todas as fases completas!</Text>
            </View>
          )}
        </View>

        <View style={styles.progressoCard}>
          <Text style={styles.progressoTitulo}>🔢 Jogo de Contagem</Text>

          <BarraProgresso
            progresso={progressoContagem.porcentagem}
            titulo="Progresso Total"
            mostrarTextoDetalhes={`${progressoContagem.pontuacaoTotal} de ${PONTUACAO_MAXIMA_CONTAGEM} pontos • ${progressoContagem.fasesCompletas}/${progressoContagem.totalFases} fases`}
          />

          {progressoContagem.porcentagem === 100 && (
            <View style={styles.completoCard}>
              <Text style={styles.completoTexto}>🏆 Todas as fases completas!</Text>
            </View>
          )}
        </View>
      </View>

      <View style={{ flex: 1 }} />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titulo: {
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
  },
  saudacao: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 16,
    color: '#666666',
  },
  progressoContainer: {
    marginTop: 10,
  },
  progressoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressoTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0EA5E9',
    marginBottom: 16,
    textAlign: 'center',
  },
  completoCard: {
    marginTop: 16,
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  completoTexto: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#065F46',
    textAlign: 'center',
  },
});
