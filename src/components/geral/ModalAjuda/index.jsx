import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function ModalAjuda({ visible, onClose }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.titulo}>❓ Como Usar o Calculia</Text>
            <TouchableOpacity onPress={onClose} style={styles.botaoFechar}>
              <Text style={styles.botaoFecharTexto}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.conteudo} showsVerticalScrollIndicator={false}>
            {/* Sobre o App */}
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>👋 Bem-vindo o Calculia</Text>
              <Text style={styles.texto}>
                O Calculia é um aplicativo educativo projetado para ajudar crianças a
                desenvolverem habilidades matemáticas básicas de forma divertida e interativa.
              </Text>
            </View>

            {/* Jogos Disponíveis */}
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>🎮 Jogos Disponíveis</Text>

              <View style={styles.jogoCard}>
                <Text style={styles.jogoNome}>🔢 Jogo de Contagem</Text>
                <Text style={styles.texto}>
                  A criança aprende a contar objetos tocando neles. Os números aparecem
                  na sequência em que são tocados, ajudando a desenvolver a noção de
                  quantidade e ordem numérica.
                </Text>
              </View>

              <View style={styles.jogoCard}>
                <Text style={styles.jogoNome}>➕ Jogo de Soma</Text>
                <Text style={styles.texto}>
                  Apresenta problemas de adição simples, começando com números pequenos
                  e aumentando gradualmente a dificuldade. Ideal para praticar operações
                  matemáticas básicas.
                </Text>
              </View>

              <View style={styles.jogoCard}>
                <Text style={styles.jogoNome}>⚖️ Jogo de Comparação</Text>
                <Text style={styles.texto}>
                  Ensina conceitos de maior, menor e igual. A criança compara números
                  e quantidades, desenvolvendo raciocínio lógico e senso numérico.
                </Text>
              </View>
            </View>

            {/* Sistema de Fases */}
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>🌟 Sistema de Fases e Estrelas</Text>
              <Text style={styles.texto}>
                Cada jogo possui 5 fases progressivas que desbloqueiam conforme a criança
                avança e cada fase tem 5 questões. O sistema de estrelas motiva a melhoria contínua:
              </Text>
              <View style={styles.lista}>
                <Text style={styles.itemLista}>⭐ 1 estrela: 1 a 2 acertos</Text>
                <Text style={styles.itemLista}>⭐⭐ 2 estrelas: 3 a 4 acertos</Text>
                <Text style={styles.itemLista}>⭐⭐⭐ 3 estrelas: 100% de acertos (perfeito!)</Text>
              </View>
            </View>

            {/* Conquistas */}
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>🏆 Conquistas</Text>
              <Text style={styles.texto}>
                As conquistas são medalhas especiais que a criança ganha ao atingir
                objetivos específicos, como completar uma fase com pontuação perfeita
                ou jogar várias partidas seguidas. Elas incentivam o engajamento e
                celebram o progresso.
              </Text>
            </View>

            {/* Acompanhamento */}
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>📊 Acompanhando o Progresso</Text>
              <Text style={styles.texto}>
                A página inicial mostra o progresso geral em cada jogo com barras visuais
                e estatísticas. Você pode verificar:
              </Text>
              <View style={styles.lista}>
                <Text style={styles.itemLista}>• Pontuação total acumulada</Text>
                <Text style={styles.itemLista}>• Porcentagem de conclusão</Text>
                <Text style={styles.itemLista}>• Número de fases completadas</Text>
                <Text style={styles.itemLista}>• Histórico de partidas jogadas</Text>
              </View>
            </View>

            {/* Perfil */}
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>👤 Perfil da Criança</Text>
              <Text style={styles.texto}>
                Na aba Perfil você pode visualizar informações detalhadas, como ver todas
                as conquistas desbloqueadas.
              </Text>
            </View>

            {/* Dicas */}
            <View style={styles.secao}>
              <Text style={styles.secaoTitulo}>💡 Dicas para Responsáveis</Text>
              <View style={styles.lista}>
                <Text style={styles.itemLista}>
                  ✓ Incentive a criança a jogar regularmente, mesmo que por poucos minutos
                </Text>
                <Text style={styles.itemLista}>
                  ✓ Celebre as conquistas e o progresso, mesmo pequeno
                </Text>
                <Text style={styles.itemLista}>
                  ✓ Não pressione por perfeição - o aprendizado é um processo
                </Text>
                <Text style={styles.itemLista}>
                  ✓ Use o histórico para identificar áreas que precisam de mais prática
                </Text>
                <Text style={styles.itemLista}>
                  ✓ Deixe a criança jogar no seu próprio ritmo
                </Text>
              </View>
            </View>

          
          </ScrollView>

          <TouchableOpacity style={styles.botaoEntendi} onPress={onClose}>
            <Text style={styles.botaoEntendidoTexto}>Entendi!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#E0F2FE',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0EA5E9',
    flex: 1,
  },
  botaoFechar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoFecharTexto: {
    fontSize: 20,
    color: '#64748B',
    fontWeight: 'bold',
  },
  conteudo: {
    padding: 20,
  },
  secao: {
    marginBottom: 24,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  texto: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  jogoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  jogoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0EA5E9',
    marginBottom: 8,
  },
  lista: {
    marginTop: 8,
  },
  itemLista: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 6,
  },
  botaoEntendi: {
    backgroundColor: '#0EA5E9',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoEntendidoTexto: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
