import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarraProgresso } from '../../components/geral/BarraProgresso';
import { ModalAjuda } from '../../components/geral/ModalAjuda';
import { ModalConquista } from '../../components/geral/ModalConquista';
import { ConquistasDatabase } from '../../services/conquistasDatabase';
import { ProgressoFasesDatabase } from '../../services/progressoFasesDatabase';
import { StorageService } from '../../services/storage';

// Pontuação máxima possível nos jogos
const PONTUACAO_MAXIMA_SOMA = 500; // 50 + 75 + 100 + 125 + 150
const PONTUACAO_MAXIMA_CONTAGEM = 500; // 50 + 75 + 100 + 125 + 150
const PONTUACAO_MAXIMA_COMPARACAO = 500; // 50 + 75 + 100 + 125 + 150

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
  const [progressoComparacao, setProgressoComparacao] = useState({
    pontuacaoTotal: 0,
    porcentagem: 0,
    fasesCompletas: 0,
    totalFases: 5
  });
  const [conquistasRecentes, setConquistasRecentes] = useState([]);
  const [statsConquistas, setStatsConquistas] = useState(null);
  const [modalConquistaVisible, setModalConquistaVisible] = useState(false);
  const [conquistaAtual, setConquistaAtual] = useState(null);
  const [conquistasNaoVisualizadas, setConquistasNaoVisualizadas] = useState([]);
  const [modalAjudaVisible, setModalAjudaVisible] = useState(false);

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

        // Carrega progresso do jogo de comparação
        const progressoComparacaoResult = await ProgressoFasesDatabase.calcularProgressoTotal('comparacao', PONTUACAO_MAXIMA_COMPARACAO);

        setProgressoComparacao({
          pontuacaoTotal: progressoComparacaoResult.pontuacaoTotal,
          porcentagem: progressoComparacaoResult.porcentagem,
          fasesCompletas: progressoComparacaoResult.fasesCompletas,
          totalFases: progressoComparacaoResult.totalFases
        });

        // Carrega conquistas
        const { conquistas } = await ConquistasDatabase.getConquistasDesbloqueadas();
        setConquistasRecentes(conquistas.slice(0, 3)); // Apenas as 3 mais recentes

        const { stats } = await ConquistasDatabase.getEstatisticas();
        setStatsConquistas(stats);

        // Verifica se há conquistas não visualizadas
        const { conquistas: naoVisualizadas } = await ConquistasDatabase.getConquistasNaoVisualizadas();
        if (naoVisualizadas.length > 0) {
          setConquistasNaoVisualizadas(naoVisualizadas);
          // Mostra a primeira conquista não visualizada
          setConquistaAtual(naoVisualizadas[0]);
          setModalConquistaVisible(true);
        }
      };

      carregarDados();
    }, [])
  );

  const handleCloseModal = async () => {
    if (conquistaAtual) {
      // Marca a conquista atual como visualizada
      await ConquistasDatabase.marcarComoVisualizadas([conquistaAtual.id]);
    }

    // Remove a conquista atual da lista
    const restantes = conquistasNaoVisualizadas.slice(1);
    setConquistasNaoVisualizadas(restantes);

    if (restantes.length > 0) {
      // Se há mais conquistas, mostra a próxima
      setConquistaAtual(restantes[0]);
    } else {
      // Se não há mais, fecha o modal
      setModalConquistaVisible(false);
      setConquistaAtual(null);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Botão de Ajuda */}
      <TouchableOpacity
        style={styles.botaoAjuda}
        onPress={() => setModalAjudaVisible(true)}
      >
        <Text style={styles.botaoAjudaTexto}>?</Text>
      </TouchableOpacity>

      <ScrollView>
        <Text style={styles.titulo}>Página Principal</Text>

        <View style={styles.cabecalho}>
          <Text style={styles.saudacao}>Olá, {nome}</Text>
          <Text style={styles.subtitulo}>Vamos aprender brincando?</Text>
        </View>

        <View style={styles.progressoContainer}>


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

          <View style={styles.progressoCard}>
            <Text style={styles.progressoTitulo}>➕ Jogo de Soma</Text>

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
            <Text style={styles.progressoTitulo}>⚖️ Jogo de Comparação</Text>

            <BarraProgresso
              progresso={progressoComparacao.porcentagem}
              titulo="Progresso Total"
              mostrarTextoDetalhes={`${progressoComparacao.pontuacaoTotal} de ${PONTUACAO_MAXIMA_COMPARACAO} pontos • ${progressoComparacao.fasesCompletas}/${progressoComparacao.totalFases} fases`}
            />

            {progressoComparacao.porcentagem === 100 && (
              <View style={styles.completoCard}>
                <Text style={styles.completoTexto}>🏆 Todas as fases completas!</Text>
              </View>
            )}
          </View>
        </View>

        {/* Seção de Conquistas */}
        <View style={styles.conquistasSection}>
          <Text style={styles.conquistasSectionTitle}>🏆 Conquistas</Text>

          {statsConquistas && (
            <View style={styles.conquistasStats}>
              <View style={styles.conquistasProgressBar}>
                <View
                  style={[
                    styles.conquistasProgressFill,
                    { width: `${statsConquistas.porcentagem}%` },
                  ]}
                />
              </View>
              <Text style={styles.conquistasStatsText}>
                {statsConquistas.desbloqueadas}/{statsConquistas.total} desbloqueadas ({statsConquistas.porcentagem}%)
              </Text>
            </View>
          )}

          {conquistasRecentes.length > 0 ? (
            <View style={styles.conquistasRecentes}>
              <Text style={styles.conquistasRecentesTitle}>Últimas Desbloqueadas:</Text>
              {conquistasRecentes.map((conquista) => (
                <View key={conquista.id} style={styles.conquistaMini}>
                  <Text style={styles.conquistaMiniIcon}>{conquista.icone}</Text>
                  <View style={styles.conquistaMiniInfo}>
                    <Text style={styles.conquistaMiniNome}>{conquista.titulo}</Text>
                    <Text style={styles.conquistaMiniDesc}>{conquista.descricao}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.conquistasEmpty}>
              <Text style={styles.conquistasEmptyText}>Jogue para desbloquear conquistas!</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <ModalConquista
        conquista={conquistaAtual}
        visible={modalConquistaVisible}
        onClose={handleCloseModal}
      />

      <ModalAjuda
        visible={modalAjudaVisible}
        onClose={() => setModalAjudaVisible(false)}
      />
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
  botaoAjuda: {
    position: 'absolute',
    margin: 20,
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  botaoAjudaTexto: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  conquistasSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conquistasSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
    textAlign: 'center',
  },
  conquistasStats: {
    marginBottom: 15,
  },
  conquistasProgressBar: {
    height: 16,
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  conquistasProgressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 8,
  },
  conquistasStatsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  conquistasRecentes: {
    marginTop: 10,
  },
  conquistasRecentesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  conquistaMini: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  conquistaMiniIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  conquistaMiniInfo: {
    flex: 1,
  },
  conquistaMiniNome: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  conquistaMiniDesc: {
    fontSize: 12,
    color: '#666',
  },
  conquistasEmpty: {
    padding: 20,
    alignItems: 'center',
  },
  conquistasEmptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
