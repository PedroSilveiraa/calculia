import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_DATA: '@calculia:userData',
  FIRST_TIME: '@calculia:firstTime',
  LAST_ACCESS: '@calculia:lastAccess',
  PREVIOUS_ACCESS: '@calculia:previousAccess'
};

export const StorageService = {
  // Verifica se é a primeira vez do usuário
  async isFirstTime() {
    try {
      const firstTime = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_TIME);
      return firstTime === null;
    } catch (error) {
      console.error('Erro ao verificar primeira vez:', error);
      return true;
    }
  },

  // Salva/Atualiza dados do usuário
  async saveUserData(name, age) {
    try {
      // Mantém a data de criação original se já existir
      const existingData = await this.getUserData();
      const userData = {
        name,
        age,
        createdAt: existingData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER_DATA, JSON.stringify(userData)],
        [STORAGE_KEYS.FIRST_TIME, 'false'],
        [STORAGE_KEYS.LAST_ACCESS, new Date().toISOString()]
      ]);

      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
      return { success: false, error };
    }
  },

  // Atualiza o último acesso (salva o anterior antes de atualizar)
  async updateLastAccess() {
    try {
      // Pega o último acesso atual e salva como acesso anterior
      const currentLastAccess = await AsyncStorage.getItem(STORAGE_KEYS.LAST_ACCESS);

      if (currentLastAccess) {
        await AsyncStorage.setItem(STORAGE_KEYS.PREVIOUS_ACCESS, currentLastAccess);
      }

      // Atualiza o último acesso para agora
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_ACCESS, new Date().toISOString());
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar último acesso:', error);
      return { success: false, error };
    }
  },

  // Obtém dados do usuário
  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  },

  // Obtém último acesso (retorna o acesso anterior, não o atual)
  async getLastAccess() {
    try {
      const previousAccess = await AsyncStorage.getItem(STORAGE_KEYS.PREVIOUS_ACCESS);
      return previousAccess;
    } catch (error) {
      console.error('Erro ao obter último acesso:', error);
      return null;
    }
  },

  // Limpa todos os dados (útil para testes)
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.FIRST_TIME,
        STORAGE_KEYS.LAST_ACCESS,
        STORAGE_KEYS.PREVIOUS_ACCESS
      ]);
      return { success: true };
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      return { success: false, error };
    }
  },

  // Debug - Mostra todos os dados salvos no console
  async debugStorage() {
    try {
      const userData = await this.getUserData();
      const previousAccess = await AsyncStorage.getItem(STORAGE_KEYS.PREVIOUS_ACCESS);
      const currentAccess = await AsyncStorage.getItem(STORAGE_KEYS.LAST_ACCESS);
      const isFirst = await this.isFirstTime();

      console.log('====== DADOS DO ASYNCSTORAGE ======');
      console.log('É primeira vez?', isFirst);
      console.log('Dados do usuário:', userData);
      console.log('Acesso anterior (mostrado na tela):', previousAccess);
      console.log('Acesso atual (este acesso):', currentAccess);
      console.log('===================================');

      return { userData, lastAccess: previousAccess, isFirst };
    } catch (error) {
      console.error('Erro ao fazer debug do storage:', error);
      return null;
    }
  }
};
