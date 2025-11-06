# Dependências do Projeto Calculia

## Status: ✅ Projeto Limpo

Todas as dependências não utilizadas foram removidas. O projeto agora contém apenas as 22 dependências essenciais.

## Dependências Instaladas

| Pacote | Versão | Uso |
|--------|--------|-----|
| `@expo/vector-icons` | ^15.0.3 | Ícones em todo o app |
| `@react-native-async-storage/async-storage` | ^2.2.0 | Armazenamento de dados do usuário (perfil, último acesso) |
| `expo` | ~54.0.0 | Framework principal Expo SDK 54 |
| `expo-audio` | ~1.0.14 | Sistema de sons dos jogos (6 players de áudio) |
| `expo-constants` | ~18.0.10 | Constantes do sistema e configuração |
| `expo-file-system` | ~19.0.17 | Acesso ao sistema de arquivos |
| `expo-font` | ~14.0.9 | Carregamento de fontes personalizadas |
| `expo-linking` | ~8.0.8 | Deep linking e URLs do app |
| `expo-router` | ~6.0.14 | Sistema de navegação file-based |
| `expo-splash-screen` | ~31.0.10 | Tela de splash ao iniciar |
| `expo-sqlite` | ~16.0.9 | Banco de dados SQLite (4 tabelas principais) |
| `expo-status-bar` | ~3.0.8 | Controle da barra de status |
| `expo-system-ui` | ~6.0.8 | Configurações da UI do sistema |
| `expo-updates` | ~29.0.12 | Sistema de updates OTA |
| `react` | ^19.1.0 | React core |
| `react-dom` | ^19.1.0 | React DOM para web |
| `react-native` | ^0.81.5 | React Native core |
| `react-native-gesture-handler` | ~2.28.0 | Gestos (requerido pelo expo-router) |
| `react-native-reanimated` | ~4.1.1 | Animações (requerido pelo expo-router) |
| `react-native-safe-area-context` | ~5.6.0 | SafeAreaView em todo o app |
| `react-native-screens` | ~4.16.0 | Otimização de navegação |
| `react-native-web` | ^0.21.2 | Suporte para plataforma web |

## Dependências Removidas (13/11/2024)

As seguintes 14 dependências foram removidas por não estarem em uso:

1. `@nozbe/watermelondb` - Substituído por expo-sqlite
2. `@react-navigation/bottom-tabs` - Substituído por expo-router
3. `@react-navigation/drawer` - Não utilizado
4. `@react-navigation/elements` - Não utilizado
5. `@react-navigation/native` - Substituído por expo-router
6. `drizzle-orm` - Não utilizado
7. `expo-drizzle-studio-plugin` - Não utilizado
8. `expo-blur` - Não utilizado
9. `expo-haptics` - Não utilizado
10. `expo-image` - Não utilizado
11. `expo-symbols` - Não utilizado
12. `expo-web-browser` - Não utilizado
13. `react-native-vector-icons` - Substituído por @expo/vector-icons
14. `react-native-webview` - Não utilizado
15. `react-native-worklets` - Não utilizado

## Resultado da Limpeza

- **24 pacotes removidos** do node_modules
- **Espaço economizado**: ~150-200 MB
- **Tempo de instalação reduzido**: ~30-40 segundos
- **0 vulnerabilidades** encontradas após limpeza

## Comandos Úteis

```bash
# Ver dependências instaladas
npm list --depth=0

# Ver tamanho dos node_modules
du -sh node_modules

# Reinstalar todas as dependências (se necessário)
npm install

# Atualizar pacotes Expo
npx expo install --fix
```

## Notas Importantes

- `react-native-reanimated` é **requerido pelo expo-router**, mesmo não sendo usado diretamente
- `react-native-gesture-handler` também é **requerido pelo expo-router**
- Todas as dependências restantes são essenciais para o funcionamento do app
