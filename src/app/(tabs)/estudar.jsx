import { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../../services/storage';

// Conteúdos educativos progressivos para pré-escola
const ETAPAS_ESTUDO = [
  {
    id: 1,
    titulo: '🔢 Conhecendo os Números 1-5',
    descricao: 'Vamos aprender a contar até 5!',
    conteudo: {
      introducao: 'Olá! Hoje vamos conhecer os números de 1 a 5. Vamos aprender juntos?',
      atividades: [
        {
          tipo: 'explicacao',
          texto: '1️⃣ UM - Mostre um dedo para a criança. "Este é o número 1!"'
        },
        {
          tipo: 'explicacao',
          texto: '2️⃣ DOIS - Mostre dois dedos. "Agora temos dois dedos!"'
        },
        {
          tipo: 'explicacao',
          texto: '3️⃣ TRÊS - Três dedos. "Veja, três dedos!"'
        },
        {
          tipo: 'explicacao',
          texto: '4️⃣ QUATRO - Quatro dedos. "Quatro dedos levantados!"'
        },
        {
          tipo: 'explicacao',
          texto: '5️⃣ CINCO - Mostre toda a mão. "Cinco dedos, uma mão inteira!"'
        },
        {
          tipo: 'pratica',
          texto: '✨ PRÁTICA: Peça para a criança mostrar cada número com os dedinhos!'
        },
        {
          tipo: 'pratica',
          texto: '🎮 BRINCADEIRA: Contem objetos pela casa: quantas cadeiras? quantos brinquedos?'
        }
      ]
    }
  },
  {
    id: 2,
    titulo: '➕ Somando até 5',
    descricao: 'Aprendendo a juntar números pequenos',
    conteudo: {
      introducao: 'Agora que conhecemos os números, vamos aprender a juntar!',
      atividades: [
        {
          tipo: 'explicacao',
          texto: '🍎 Se você tem 1 maçã e ganha mais 1 maçã, quantas você tem? 2 maçãs!'
        },
        {
          tipo: 'explicacao',
          texto: '🐕 Você tem 2 cachorrinhos e chega mais 1. Agora são 3 cachorrinhos!'
        },
        {
          tipo: 'explicacao',
          texto: '⚽ Temos 2 bolas e ganhamos mais 2 bolas. Agora temos 4 bolas!'
        },
        {
          tipo: 'pratica',
          texto: '✨ PRÁTICA: Use brinquedos para mostrar: 1+1=2, 2+1=3, 2+2=4, 3+2=5'
        },
        {
          tipo: 'pratica',
          texto: '🎨 ATIVIDADE: Desenhem bolinhas e contem juntos quantas ficam ao juntar!'
        }
      ]
    }
  },
  {
    id: 3,
    titulo: '🔵 Formas Geométricas',
    descricao: 'Círculos, quadrados e triângulos',
    conteudo: {
      introducao: 'Vamos conhecer as formas que estão ao nosso redor!',
      atividades: [
        {
          tipo: 'explicacao',
          texto: '⭕ CÍRCULO - Redondo como uma bola, não tem cantos. Encontre círculos pela casa!'
        },
        {
          tipo: 'explicacao',
          texto: '⬛ QUADRADO - Tem 4 lados iguais e 4 cantos. Como uma janela!'
        },
        {
          tipo: 'explicacao',
          texto: '🔺 TRIÂNGULO - Tem 3 lados e 3 cantos pontidinhos!'
        },
        {
          tipo: 'explicacao',
          texto: '▭ RETÂNGULO - Como o quadrado, mas mais comprido. Como uma porta!'
        },
        {
          tipo: 'pratica',
          texto: '🔍 CAÇA ÀS FORMAS: Procurem pela casa objetos de cada forma!'
        },
        {
          tipo: 'pratica',
          texto: '🎨 DESENHO: Desenhem cada forma e pintem com cores diferentes!'
        }
      ]
    }
  },
  {
    id: 4,
    titulo: '📏 Grande e Pequeno',
    descricao: 'Comparando tamanhos',
    conteudo: {
      introducao: 'Vamos aprender sobre tamanhos diferentes!',
      atividades: [
        {
          tipo: 'explicacao',
          texto: '🐘 GRANDE - Um elefante é grande! Abre os braços bem abertos!'
        },
        {
          tipo: 'explicacao',
          texto: '🐁 PEQUENO - Um ratinho é pequeno! Junta as mãozinhas!'
        },
        {
          tipo: 'explicacao',
          texto: '📊 MÉDIO - Tem coisas que não são nem grandes nem pequenas!'
        },
        {
          tipo: 'pratica',
          texto: '🎯 COMPARE: Peguem 3 brinquedos e organizem do menor ao maior!'
        },
        {
          tipo: 'pratica',
          texto: '👟 ATIVIDADE: Compare sapatos da família - qual é o maior? E o menor?'
        },
        {
          tipo: 'pratica',
          texto: '🎨 DESENHO: Desenhe uma família de ursos: papai (grande), mamãe (médio), bebê (pequeno)!'
        }
      ]
    }
  },
  {
    id: 5,
    titulo: '🎨 Padrões e Sequências',
    descricao: 'Identificando e criando padrões',
    conteudo: {
      introducao: 'Vamos descobrir padrões divertidos!',
      atividades: [
        {
          tipo: 'explicacao',
          texto: '🔴🔵🔴🔵 - Vermelho, azul, vermelho, azul... Qual vem depois? Azul!'
        },
        {
          tipo: 'explicacao',
          texto: '⭐⭐🌙⭐⭐🌙 - Dois estrelas, uma lua... Qual o padrão?'
        },
        {
          tipo: 'pratica',
          texto: '🧩 MONTE PADRÕES: Use blocos coloridos para criar padrões!'
        },
        {
          tipo: 'pratica',
          texto: '👏 PALMAS: Faça padrões com palmas: palma-palma-perna, palma-palma-perna!'
        },
        {
          tipo: 'pratica',
          texto: '🎨 ARTE: Desenhe e pinte padrões com formas e cores!'
        }
      ]
    }
  },
  {
    id: 6,
    titulo: '🔢 Contando até 10',
    descricao: 'Expandindo para números maiores',
    conteudo: {
      introducao: 'Já sabemos até 5, agora vamos até 10!',
      atividades: [
        {
          tipo: 'explicacao',
          texto: '6️⃣ SEIS - Uma mão e mais um dedo!'
        },
        {
          tipo: 'explicacao',
          texto: '7️⃣ SETE - Uma mão e dois dedos!'
        },
        {
          tipo: 'explicacao',
          texto: '8️⃣ OITO - Uma mão e três dedos!'
        },
        {
          tipo: 'explicacao',
          texto: '9️⃣ NOVE - Uma mão e quatro dedos!'
        },
        {
          tipo: 'explicacao',
          texto: '🔟 DEZ - Duas mãos completas!'
        },
        {
          tipo: 'pratica',
          texto: '🎵 MÚSICA: Cantem músicas de contar até 10!'
        },
        {
          tipo: 'pratica',
          texto: '🦶 PULOS: Pulem 10 vezes contando alto!'
        },
        {
          tipo: 'pratica',
          texto: '🍬 CONTAR: Separem 10 objetos e contem juntos!'
        }
      ]
    }
  },
  {
    id: 7,
    titulo: '➕ Somando até 10',
    descricao: 'Adições simples até 10',
    conteudo: {
      introducao: 'Agora vamos juntar números até chegar em 10!',
      atividades: [
        {
          tipo: 'explicacao',
          texto: '✨ 5 + 5 = 10 (Duas mãos cheias!)'
        },
        {
          tipo: 'explicacao',
          texto: '✨ 3 + 7 = 10'
        },
        {
          tipo: 'explicacao',
          texto: '✨ 4 + 6 = 10'
        },
        {
          tipo: 'explicacao',
          texto: '✨ 2 + 8 = 10'
        },
        {
          tipo: 'pratica',
          texto: '🎲 USE DADOS: Joguem dois dados e somem os números!'
        },
        {
          tipo: 'pratica',
          texto: '🧮 BRINQUEDOS: Use 10 brinquedos e separe em dois grupos diferentes!'
        },
        {
          tipo: 'pratica',
          texto: '🎨 DESENHO: Desenhe probleminhas: 3 pássaros + 2 pássaros = ?'
        }
      ]
    }
  },
  {
    id: 8,
    titulo: '➖ Tirando Números',
    descricao: 'Introdução à subtração',
    conteudo: {
      introducao: 'E se tirarmos ao invés de juntar?',
      atividades: [
        {
          tipo: 'explicacao',
          texto: '🍪 Você tem 5 biscoitos e come 2. Quantos sobraram? 3 biscoitos!'
        },
        {
          tipo: 'explicacao',
          texto: '🎈 Tinha 4 balões e 1 voou. Restaram 3 balões!'
        },
        {
          tipo: 'explicacao',
          texto: '🚗 5 carrinhos menos 2 carrinhos = 3 carrinhos!'
        },
        {
          tipo: 'pratica',
          texto: '🎯 PRÁTICA: Separe 5 objetos e tire alguns. Quantos ficaram?'
        },
        {
          tipo: 'pratica',
          texto: '🍎 HISTÓRIA: Crie histórias de tirar coisas!'
        },
        {
          tipo: 'pratica',
          texto: '✋ DEDOS: Mostre 5 dedos, abaixe 2. Quantos ficaram levantados?'
        }
      ]
    }
  }
];

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

    Alert.alert(
      '🎉 Parabéns!',
      'Etapa concluída com sucesso! Continue aprendendo!',
      [{ text: 'OK' }]
    );

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
