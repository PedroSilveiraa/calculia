import { Alert } from 'react-native';
import * as Updates from 'expo-updates';
import { StorageService } from '../services/storage';
import { JogosDatabase } from '../services/jogosDatabase';
import { ProgressoFasesDatabase } from '../services/progressoFasesDatabase';
import { ConquistasDatabase } from '../services/conquistasDatabase';

/**
 * Visualiza dados do AsyncStorage no console
 */
export const visualizarDados = async () => {
  await StorageService.debugStorage();
  Alert.alert('Dados no Console', 'Verifique o terminal para ver os dados!');
};

/**
 * Navega para tela de editar perfil
 */
export const editarDados = (router) => {
  router.push('/editarPerfil');
};

/**
 * Navega para tela de debug do banco de dados
 */
export const debugDatabase = (router) => {
  router.push('/debug/database');
};

/**
 * Reinicia o aplicativo
 */
export const reiniciarApp = () => {
  Alert.alert(
    'Reiniciar App',
    'Deseja reiniciar o aplicativo?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Reiniciar',
        onPress: async () => {
          await Updates.reloadAsync();
        }
      }
    ]
  );
};

/**
 * Exclui todos os dados do aplicativo (AsyncStorage + SQLite)
 * @param {Function} resetarEstado - Callback para resetar o estado do componente
 */
export const excluirTodosDados = (resetarEstado) => {
  Alert.alert(
    'Excluir TODOS os Dados',
    'Isso vai apagar:\n• Dados do perfil (AsyncStorage)\n• Histórico de jogos (SQLite)\n• Progresso das fases (SQLite)\n• Conquistas (SQLite)\n\nTem certeza?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir Tudo',
        style: 'destructive',
        onPress: async () => {
          try {
            // Limpa AsyncStorage
            const resultStorage = await StorageService.clearAll();

            // Limpa histórico de jogos do SQLite
            const resultJogos = await JogosDatabase.clearHistory();

            // Reseta progresso das fases (todos os jogos)
            const resultSoma = await ProgressoFasesDatabase.resetarProgresso('soma');
            const resultContagem = await ProgressoFasesDatabase.resetarProgresso('contagem');
            const resultComparacao = await ProgressoFasesDatabase.resetarProgresso('comparacao');

            // Reseta conquistas
            const resultConquistas = await ConquistasDatabase.resetarConquistas();

            // Verifica se todas as operações foram bem-sucedidas
            if (
              resultStorage.success &&
              resultJogos.success &&
              resultSoma.success &&
              resultContagem.success &&
              resultComparacao.success &&
              resultConquistas.success
            ) {
              Alert.alert(
                'Sucesso',
                'Todos os dados foram excluídos com sucesso!',
                [
                  {
                    text: 'OK',
                    onPress: resetarEstado
                  }
                ]
              );
            } else {
              Alert.alert('Erro', 'Não foi possível excluir todos os dados. Verifique o console.');
              console.error('Erros na exclusão:', {
                storage: !resultStorage.success,
                jogos: !resultJogos.success,
                soma: !resultSoma.success,
                contagem: !resultContagem.success,
                comparacao: !resultComparacao.success,
                conquistas: !resultConquistas.success
              });
            }
          } catch (error) {
            Alert.alert('Erro', `Erro ao excluir dados: ${error.message}`);
            console.error('Erro na exclusão completa:', error);
          }
        }
      }
    ]
  );
};
