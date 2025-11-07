import { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../../services/storage';
import { ConquistasDatabase } from '../../services/conquistasDatabase';
import { ETAPAS_ESTUDO } from '../../config/etapasEstudo';

export default function Estudar() {
  const [progressoEtapas, setProgressoEtapas] = useState({});
  const [etapaSelecionada, setEtapaSelecionada] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);

  // Carregar progresso salvo
  useEffect(() => {
    carregarProgresso();
  }, []);

  const carregarProgresso = async () => {
    try {
      const progressoSalvo = await StorageService.getStudiesProgress();
      setProgressoEtapas(progressoSalvo);
    } catch (error) {
      console.log('Erro ao carregar progresso:', error);
    }
  };

  const salvarProgresso = async (etapaId) => {
    try {
      const resultado = await StorageService.saveStudyProgress(etapaId, true);
      if (resultado.success) {
        setProgressoEtapas(resultado.progress);
      }
    } catch (error) {
      console.log('Erro ao salvar progresso:', error);
    }
  };

  const etapaEstaBloqueada = (etapaId) => {
    if (etapaId === 1) return false; // Primeira etapa sempre desbloqueada
    const etapaAnterior = etapaId - 1;
    return !progressoEtapas[etapaAnterior]?.concluida;
  };

  const abrirEtapa = (etapa) => {
    if (etapaEstaBloqueada(etapa.id)) {
      Alert.alert(
        '🔒 Etapa Bloqueada',
        'Complete a etapa anterior para desbloquear esta!',
        [{ text: 'OK' }]
      );
      return;
    }
    setEtapaSelecionada(etapa);
    setModalVisivel(true);
  };

  const marcarConcluida = async () => {
    await salvarProgresso(etapaSelecionada.id);

    // Verifica se desbloqueou a conquista "Estudioso"
    const progressoAtualizado = await StorageService.getStudiesProgress();
    const resultConquista = await ConquistasDatabase.verificarConquistaEstudioso(progressoAtualizado);

    if (resultConquista.conquistaDesbloqueada) {
      Alert.alert(
        '🎉 Conquista Desbloqueada!',
        `Você desbloqueou: ${resultConquista.conquistaDesbloqueada.titulo} - ${resultConquista.conquistaDesbloqueada.descricao}`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        '🎉 Parabéns!',
        'Etapa concluída com sucesso! Continue aprendendo!',
        [{ text: 'OK' }]
      );
    }

    setModalVisivel(false);
  };

  const fecharModal = () => {
    setModalVisivel(false);
    setEtapaSelecionada(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextos}>
            <Text style={styles.titulo}>📚 Área de Estudos</Text>
            <Text style={styles.subtitulo}>Atividades lúdicas para pré-escola</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {ETAPAS_ESTUDO.map((etapa) => {
          const bloqueada = etapaEstaBloqueada(etapa.id);
          const concluida = progressoEtapas[etapa.id]?.concluida;

          return (
            <TouchableOpacity
              key={etapa.id}
              style={[
                styles.cardEtapa,
                bloqueada && styles.cardBloqueado,
                concluida && styles.cardConcluido
              ]}
              onPress={() => abrirEtapa(etapa)}
              disabled={bloqueada}
            >
              <View style={styles.cardHeader}>
                <View style={styles.numeroEtapa}>
                  <Text style={styles.numeroTexto}>{etapa.id}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.tituloEtapa, bloqueada && styles.textoBloqueado]}>
                    {etapa.titulo}
                  </Text>
                  <Text style={[styles.descricaoEtapa, bloqueada && styles.textoBloqueado]}>
                    {etapa.descricao}
                  </Text>
                </View>
                {bloqueada && (
                  <Text style={styles.iconeBloqueio}>🔒</Text>
                )}
                {concluida && (
                  <Text style={styles.iconeConcluido}>✅</Text>
                )}
              </View>
              {concluida && (
                <View style={styles.badgeConcluido}>
                  <Text style={styles.badgeTexto}>Já lido</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Modal de Conteúdo da Etapa */}
      <Modal
        visible={modalVisivel}
        animationType="slide"
        onRequestClose={fecharModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          {etapaSelecionada && (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitulo}>{etapaSelecionada.titulo}</Text>
                <TouchableOpacity onPress={fecharModal} style={styles.botaoFechar}>
                  <Text style={styles.textoFechar}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent}>
                <View style={styles.introducaoBox}>
                  <Text style={styles.introducaoTexto}>
                    {etapaSelecionada.conteudo.introducao}
                  </Text>
                </View>

                {etapaSelecionada.conteudo.atividades.map((atividade, index) => (
                  <View
                    key={index}
                    style={[
                      styles.atividadeBox,
                      atividade.tipo === 'pratica' && styles.atividadePratica
                    ]}
                  >
                    <Text style={styles.atividadeTexto}>{atividade.texto}</Text>
                  </View>
                ))}

                <View style={styles.dicasBox}>
                  <Text style={styles.dicasTitulo}>💡 Dicas para Educadores</Text>
                  <Text style={styles.dicasTexto}>
                    • Vá no ritmo da criança{'\n'}
                    • Use objetos concretos e visuais{'\n'}
                    • Torne o aprendizado divertido{'\n'}
                    • Elogie o esforço, não só o acerto{'\n'}
                    • Pratique um pouco todos os dias
                  </Text>
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.botaoConcluir}
                  onPress={marcarConcluida}
                >
                  <Text style={styles.textoBotaoConcluir}>
                    {progressoEtapas[etapaSelecionada.id]?.concluida
                      ? '✓ Ler Novamente'
                      : '✓ Marcar como Concluída'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F2FE',
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#0EA5E9',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextos: {
    flex: 1,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 16,
    color: '#F0F9FF',
    textAlign: 'center',
  },
 
  textoExcluir: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  cardEtapa: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardBloqueado: {
    backgroundColor: '#F1F5F9',
    opacity: 0.6,
  },
  cardConcluido: {
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numeroEtapa: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numeroTexto: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardInfo: {
    flex: 1,
  },
  tituloEtapa: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  descricaoEtapa: {
    fontSize: 14,
    color: '#64748B',
  },
  textoBloqueado: {
    color: '#94A3B8',
  },
  iconeBloqueio: {
    fontSize: 24,
    marginLeft: 8,
  },
  iconeConcluido: {
    fontSize: 24,
    marginLeft: 8,
  },
  badgeConcluido: {
    marginTop: 12,
    backgroundColor: '#DCFCE7',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  badgeTexto: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    backgroundColor: '#0EA5E9',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  botaoFechar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoFechar: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    padding: 20,
  },
  introducaoBox: {
    backgroundColor: '#DBEAFE',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  introducaoTexto: {
    fontSize: 16,
    color: '#1E40AF',
    lineHeight: 24,
  },
  atividadeBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  atividadePratica: {
    backgroundColor: '#FEF3C7',
    borderLeftColor: '#10B981',
  },
  atividadeTexto: {
    fontSize: 15,
    color: '#1E293B',
    lineHeight: 22,
  },
  dicasBox: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#86EFAC',
  },
  dicasTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 8,
  },
  dicasTexto: {
    fontSize: 14,
    color: '#15803D',
    lineHeight: 22,
  },
  modalFooter: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  botaoConcluir: {
    backgroundColor: '#0EA5E9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  textoBotaoConcluir: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
