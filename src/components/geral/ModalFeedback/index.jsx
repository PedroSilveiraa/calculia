import { useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSound } from '../../../hooks/useSound';

const MENSAGENS_ACERTO = [
  "Mandou bem! 🌟",
  "Você acertou! 🧠👏",
  "Uau! Que gênio! 🤩",
  "Acertou em cheio! 🎯",
  "Show de bola! ⚡",
  "Você arrasou! 🥳",
  "Boa! Você está voando! 🚀",
  "Isso aí! Continue assim! 💪"
];

const MENSAGENS_ERRO = [
  "Quase lá! 🌈 Tenta de novo!",
  "Você tá aprendendo! 💡",
  "Não tem problema errar, é assim que a gente cresce! 🌱",
  "Boa tentativa! 🙌 Vamos tentar mais uma vez?",
  "Errou? Tudo bem! Agora você vai acertar! 💫",
  "Você tá indo muito bem, continua tentando! 🧩",
  "Errar faz parte do jogo! 💪",
  "Não desiste! Cada erro te deixa mais esperto! 🦉",
  "Ops! Vamos juntos descobrir a certa? 🔍",
  "Você consegue! 🌟 Só mais uma tentativa!"
];

export function ModalFeedback({ visible, isCorrect, onNext }) {
  const { playAcertou, playErrou } = useSound();

  useEffect(() => {
    if (visible) {
      if (isCorrect) {
        playAcertou();
      } else {
        playErrou();
      }
    }
  }, [visible, isCorrect]);

  const getMensagemAleatoria = () => {
    const mensagens = isCorrect ? MENSAGENS_ACERTO : MENSAGENS_ERRO;
    const indiceAleatorio = Math.floor(Math.random() * mensagens.length);
    return mensagens[indiceAleatorio];
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onNext}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.modalContainer,
          isCorrect ? styles.modalCorrect : styles.modalWrong
        ]}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>
              {isCorrect ? '✅' : '💡'}
            </Text>
          </View>

          <Text style={styles.message}>
            {getMensagemAleatoria()}
          </Text>

          <TouchableOpacity
            style={[
              styles.button,
              isCorrect ? styles.buttonCorrect : styles.buttonWrong
            ]}
            onPress={onNext}
          >
            <Text style={styles.buttonText}>
               {isCorrect ? 'Próxima Pergunta!' : 'Tente Novamente!'}
            </Text>
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
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
  },
  modalCorrect: {
    borderColor: '#10B981',
  },
  modalWrong: {
    borderColor: '#F59E0B',
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    fontSize: 80,
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E293B',
    marginBottom: 32,
    lineHeight: 32,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonCorrect: {
    backgroundColor: '#10B981',
  },
  buttonWrong: {
    backgroundColor: '#F59E0B',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
