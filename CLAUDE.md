# CLAUDE.md

Este arquivo fornece orientações para o Claude Code (claude.ai/code) ao trabalhar com o código neste repositório.

## Visão Geral do Projeto

**Calculia** é um aplicativo educacional móvel React Native construído com Expo SDK 54 focado no ensino de matemática para crianças através de jogos interativos. O app possui três tipos de jogos (soma, contagem, comparação), sistema de progressão de fases, conquistas e materiais de estudo.

## Comandos de Desenvolvimento

### Executando o App
```bash
# Iniciar servidor de desenvolvimento (preferencial)
npx expo start

# Iniciar com cache limpo (usar quando encontrar problemas de módulos)
npx expo start --clear

# Executar em plataformas específicas
npx expo start --android
npx expo start --ios
npx expo start --web
```

### Gerenciamento de Dependências
```bash
# Instalar dependências
npm install

# Instalar pacotes Expo (sempre use expo install para pacotes expo)
npx expo install <nome-do-pacote>
```

### Gerenciamento do Banco de Dados
O banco de dados SQLite (`calculia.db`) é inicializado automaticamente ao iniciar o app. Para resetar dados durante desenvolvimento, delete todos os dados via botão "Excluir todos os dados" na tela de perfil, ou use os métodos dos serviços de banco de dados para limpar tabelas específicas.

## Dependências do Projeto

```json
{
  "@expo/vector-icons": "^15.0.3",           // Ícones do app
  "@react-native-async-storage/async-storage": "^2.2.0",  // Armazenamento local
  "expo": "~54.0.0",                         // Framework Expo SDK 54
  "expo-audio": "~1.0.14",                   // Sons dos jogos
  "expo-constants": "~18.0.10",              // Constantes do sistema
  "expo-file-system": "~19.0.17",            // Sistema de arquivos
  "expo-font": "~14.0.9",                    // Fontes personalizadas
  "expo-linking": "~8.0.8",                  // Deep linking
  "expo-router": "~6.0.14",                  // Navegação file-based
  "expo-splash-screen": "~31.0.10",          // Tela de splash
  "expo-sqlite": "~16.0.9",                  // Banco de dados SQLite
  "expo-status-bar": "~3.0.8",               // Barra de status
  "expo-system-ui": "~6.0.8",                // UI do sistema
  "expo-updates": "~29.0.12",                // Updates OTA
  "react": "^19.1.0",                        // React
  "react-dom": "^19.1.0",                    // React DOM (web)
  "react-native": "^0.81.5",                 // React Native
  "react-native-gesture-handler": "~2.28.0", // Gestos (requerido pelo expo-router)
  "react-native-reanimated": "~4.1.1",       // Animações (requerido pelo expo-router)
  "react-native-safe-area-context": "~5.6.0", // SafeArea
  "react-native-screens": "~4.16.0",         // Otimização de telas
  "react-native-web": "^0.21.2"              // Suporte web
}
```

## Visão Geral da Arquitetura

### Stack Tecnológico
- **Framework**: Expo SDK 54 com React Native 0.81.5
- **Roteamento**: Expo Router (roteamento baseado em arquivos)
- **Banco de Dados**: expo-sqlite (banco de dados SQLite)
- **Armazenamento**: @react-native-async-storage/async-storage
- **Áudio**: expo-audio (efeitos sonoros dos jogos)
- **Gerenciamento de Estado**: React hooks (useState, useEffect)

### Estrutura do Projeto

```
src/
├── app/                    # Rotas baseadas em arquivos do Expo Router
│   ├── _layout.jsx        # Layout raiz com inicialização do BD
│   ├── index.jsx          # Tela inicial (registro/boas-vindas)
│   ├── (tabs)/            # Navegação por abas inferiores
│   │   ├── index.jsx      # Tela principal/home
│   │   ├── jogos.jsx      # Seleção de jogos
│   │   ├── estudar.jsx    # Materiais de estudo
│   │   └── perfil.jsx     # Perfil do usuário
│   ├── jogos/             # Telas dos jogos
│   │   ├── jogoSoma.jsx
│   │   ├── jogoContagem.jsx
│   │   └── jogoComparacao.jsx
│   └── editarPerfil.jsx   # Edição de perfil
├── components/
│   ├── geral/             # Componentes compartilhados
│   │   ├── ModalConquista/    # Modal de desbloqueio de conquista
│   │   ├── ModalFeedback/     # Modal de feedback de resposta
│   │   └── ModalAjuda/        # Modal de ajuda
│   └── jogos/             # Componentes específicos dos jogos
│       ├── TelaJogoSoma/
│       ├── TelaJogoContagem/
│       ├── TelaJogoComparacao/
│       ├── SeletorFases/
│       ├── ResultadoJogo/
│       └── HistoricoPartidas/
├── config/                # Configurações das fases dos jogos
│   ├── fasesSoma.js
│   ├── fasesContagem.js
│   ├── fasesComparacao.js
│   └── etapasEstudo.js
├── database/
│   └── initializeDatabase.jsx  # Schema e inicialização do BD
├── services/              # Classes de serviços do banco de dados
│   ├── jogosDatabase.js        # Registros de sessões de jogo
│   ├── progressoFasesDatabase.js  # Progressão de fases
│   ├── conquistasDatabase.js   # Sistema de conquistas
│   └── storage.js             # Wrapper do AsyncStorage
├── hooks/
│   └── useSound.js        # Hook do player de áudio
└── assets/
    ├── images/
    └── sounds/            # Arquivos de áudio dos jogos
```

### Schema do Banco de Dados

O app usa quatro tabelas principais:

1. **sessoes_jogo**: Armazena sessões de jogo completas com pontuações e metadados
2. **respostas_jogo**: Respostas individuais para cada questão de uma sessão
3. **progresso_fases**: Status de desbloqueio de fases e melhores pontuações para cada tipo de jogo
4. **conquistas**: Definições de conquistas e status de desbloqueio

Todos os serviços de banco de dados são implementados como métodos de classe estáticos. Veja os arquivos de serviço para API detalhada.

### Arquitetura dos Jogos

Cada jogo (soma/contagem/comparacao) segue este padrão:

1. **Configuração de Fases** (`src/config/fases*.js`): Define 5 fases com progressão de dificuldade
2. **Tela do Jogo** (`src/app/jogos/jogo*.jsx`): Lógica principal do jogo, geração de questões, gerenciamento de estado
3. **Componente do Jogo** (`src/components/jogos/TelaJogo*/`): Renderiza UI e questões do jogo
4. **Seletor de Fases** (`src/components/jogos/SeletorFases/`): Mostra fases disponíveis com status bloqueado/desbloqueado

Fluxo do jogo:
- Selecionar fase → Gerar questões → Jogar → Mostrar modal de feedback por questão → Mostrar tela de resultados → Salvar no banco de dados → Verificar conquistas → Desbloquear próxima fase se completada

### Sistema de Som

O hook `useSound` gerencia seis players de áudio:
- `acertouPlayer`: Som de resposta correta
- `errouPlayer`: Som de resposta errada
- `jogarPlayer`: Som de seleção de fase
- `ganhouPlayer`: Som de vitória do jogo (pelo menos 1 acerto)
- `perdeuPlayer`: Som de derrota do jogo (0 acertos)
- `conquistaPlayer`: Som de desbloqueio de conquista

**Importante**: Sempre chame `player.replace(source)` antes de `player.play()` para garantir que os sons toquem corretamente. O hook faz isso automaticamente.

### Sistema de Conquistas

As conquistas são verificadas automaticamente após cada jogo via `ConquistasDatabase.verificarConquistas()`. O sistema verifica:
- Conquistas gerais (primeira vitória, pontuação perfeita, marcos)
- Conquistas específicas do jogo (conclusões de fases, conquistas mestre)
- Conquistas de performance (pontuações altas, corridas rápidas)

Conquistas recém-desbloqueadas são mostradas via `ModalConquista` na tela principal.

## Padrões Principais de Desenvolvimento

### Adicionando um Novo Jogo

1. Criar configuração de fases em `src/config/fases<NomeDoJogo>.js` com 5 fases
2. Inicializar fases em `initializeDatabase.jsx` (adicionar entradas na tabela)
3. Adicionar tela do jogo em `src/app/jogos/jogo<NomeDoJogo>.jsx`
4. Criar componente do jogo em `src/components/jogos/TelaJogo<NomeDoJogo>/`
5. Adicionar conquistas para fases 1, 3, 5 e conquista mestre
6. Atualizar `ConquistasDatabase.verificarConquistas()` para verificar novas conquistas
7. Adicionar card do jogo em `src/app/(tabs)/jogos.jsx`

### Padrão de Serviço de Banco de Dados

Todas as operações de banco de dados usam este padrão:
```javascript
static async nomeDoMetodo(params) {
  try {
    const result = await db.getFirstAsync('SQL', [params]);
    return { success: true, data: result };
  } catch (error) {
    console.error('Descrição do erro:', error);
    return { success: false, error: error.message };
  }
}
```

Sempre retorne objetos `{ success, ... }` para tratamento consistente de erros.

### Tratamento de Teclado para Formulários

Use o padrão `KeyboardAvoidingView` + `ScrollView` para formulários:
```jsx
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? offset : offset}
>
  <ScrollView
    contentContainerStyle={styles.scrollContent}
    keyboardShouldPersistTaps="handled"
  >
    {/* Conteúdo do formulário */}
  </ScrollView>
</KeyboardAvoidingView>
```

### Navegação com Expo Router

- Use `router.push('/caminho')` para navegação
- Use `router.back()` para voltar
- Rotas de abas estão em `src/app/(tabs)/`
- Rotas de pilha estão em `src/app/`
- Não precisa importar, `router` é do `expo-router`

## Notas Importantes

### Inicialização do Banco de Dados
O banco de dados é inicializado em `src/app/_layout.jsx` antes do app renderizar. Isso garante que todas as tabelas e dados iniciais existam antes de qualquer tela carregar.

### Timestamps Locais
Todos os timestamps usam horário local com correção de fuso horário:
```javascript
const now = new Date();
const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();
```

### Storage vs Banco de Dados
- **AsyncStorage** (`StorageService`): Dados de perfil do usuário, flag de primeira vez, último acesso
- **Banco de Dados SQLite**: Dados de jogos, progresso, conquistas (persistente, consultável)

### Progressão de Fases
Fases desbloqueiam sequencialmente. Fase 1 está sempre desbloqueada. Completar uma fase desbloqueia a próxima via `ProgressoFasesDatabase.desbloquearProximaFase()`. Melhores pontuações são sempre mantidas (nunca sobrescritas por pontuações menores).

### Implementação de Sons
Sons são acionados em:
- `ModalFeedback`: acertou/errou quando o modal abre
- `ResultadoJogo`: ganhou/perdeu na montagem do componente
- `ModalConquista`: conquista quando o modal abre
- Telas de jogo: jogar quando a fase é selecionada

### Uso de Emojis
Adicione emojis ao código/comentários apenas quando explicitamente solicitado pelo usuário. O código usa emojis em strings da UI, mas não em nomes de variáveis ou lógica de código.

### Exclusão de Dados
A tela de perfil inclui um botão "Excluir todos os dados" que:
1. Limpa AsyncStorage (dados do usuário)
2. Limpa todas as tabelas do banco de dados
3. Reseta o estado do app
4. NÃO reinicia o app (apenas reseta para o estado inicial)

## Tarefas Comuns de Desenvolvimento

### Depuração do Banco de Dados
Use console.log com os métodos dos serviços de banco de dados. Todos os serviços incluem logging extensivo (✅ sucesso, ❌ erros, 🔄 operações).

### Testando o Fluxo do Jogo
1. Criar novo usuário ou usar existente
2. Selecionar um jogo na aba "Jogos"
3. Jogar uma fase completa
4. Verificar se a pontuação salva no banco de dados
5. Verificar se as conquistas desbloqueiam corretamente
6. Verificar se a próxima fase desbloqueia
7. Testar reprodução de som em cada etapa

### Atualizando o Expo SDK
Ao atualizar o Expo SDK:
1. Atualizar o pacote `expo` no `package.json`
2. Executar `npx expo install --fix` para atualizar todos os pacotes expo
3. Atualizar React e React Native para versões compatíveis
4. Testar inicialização do banco de dados, áudio e navegação
5. Limpar cache com `npx expo start --clear`
