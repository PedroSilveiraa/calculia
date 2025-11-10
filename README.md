# Calculia

**Calculia** é um aplicativo educacional móvel desenvolvido em React Native com Expo SDK 54, focado no ensino de matemática para crianças através de jogos interativos e divertidos.


## Como Rodar o Projeto

### Passo 1: Clonar o Repositório

Abra o CMD e entre no caminho que quer salvar o projeto.
Clone o projeto do GitHub:
```bash
git clone https://github.com/PedroSilveiraa/calculia.git
cd calculia
```

**Não tem o Git instalado?** Baixe em: [git-scm.com/install]
(https://git-scm.com/install)

**Alternativa:** Você também pode baixar o projeto como ZIP diretamente do [repositório](https://github.com/PedroSilveiraa/calculia) clicando em **Code → Download ZIP**.

### Passo 2: Instalar o Node.js

Este projeto requer a versão **22.18.0** do Node.js.

**Download:** [nodejs.org/download/release/v22.18.0](https://nodejs.org/download/release/v22.18.0)

Após a instalação, verifique se a versão está correta:
```bash
node -v
```

### Passo 3: Instalar Dependências

No terminal, dentro da pasta do projeto, execute:
```bash
npm install
```

Aguarde enquanto todas as dependências são instaladas.

### Passo 4: Configurar o Android Studio

#### 4.1 Instalar o Android Studio

 **Download:** [developer.android.com/studio](https://developer.android.com/studio)

#### 4.2 Criar um Dispositivo Virtual

1. Abra o Android Studio
2. Clique em **More Actions → Virtual Device Manager**
3. Clique no botão **+** (Create Device)
4. Selecione **Medium Phone** (recomendado para este projeto)
5. Siga o assistente para concluir a criação
6. No Device Manager, clique em **▶ Start** para iniciar o emulador


###  Passo 5: Iniciar o Projeto

Com o emulador Android em execução, rode um dos comandos abaixo:

#### Modo padrão
```bash
npx expo start
```
Após carregar, pressione **A** no teclado para abrir no emulador Android.

#### Modo com cache limpo (recomendado em caso de erros)
```bash
npx expo start --clear
```

#### Modo tunnel (para testar no celular físico)
```bash
npx expo start --tunnel
```

**Para celular físico:**
1. Instale o app **Expo Go** Android (Play Store) / IOS (Apple Store)
2. Escaneie o QR Code que aparece no terminal
3. O app abrirá automaticamente no Expo Go

## Outro modo de iniciar o projeto:
**Visual Studio Code**
Fazer os mesmos passos do CMD, no terminal do VSCODE, aonde fica mais facil de visualizar o projeto todo.



## Problemas Comuns

### Erro de módulos ou cache
```bash
npx expo start --clear
```

### Emulador não abre
- Verifique se o emulador está em execução no Android Studio
- Certifique-se de que a virtualização está habilitada na BIOS

### Erro de versão do Node
```bash
node -v
# Deve retornar v22.18.0
```
## SENHA ABA PERFIL: 123
