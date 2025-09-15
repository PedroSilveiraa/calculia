import { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

const mensagens = [
    "Olá! Eu sou o Calculinho, seu amigo dos números!",
    "Vamos aprender matemática juntos de forma divertida?",
    "Preparado para uma aventura matemática?",
    "Matemática pode ser fácil e divertida!",
    "Cada pequeno passo é uma grande conquista!",
    "Vamos descobrir o mundo dos números!",
    "Jogos especiais para você aprender no seu ritmo",
    "Aqui você aprende matemática sem pressa, sem pressão"
  ];

export default function Index() {

const [mensagemAtual, setMensagemAtual] = useState("");

  useEffect(() => {
    // Função para escolher uma mensagem aleatória
    const escolherMensagemAleatoria = () => {
      // Math.random() gera um número entre 0 e 1
      // Math.floor() arredonda para baixo
      // Isso nos dá um índice aleatório do array
      const indiceAleatorio = Math.floor(Math.random() * mensagens.length);
      return mensagens[indiceAleatorio];
    };

    // Define a mensagem quando o componente carrega
    setMensagemAtual(escolherMensagemAleatoria());
  }, []); // Array vazio significa que roda apenas uma vez

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/calculia/logo.png')} style={styles.logo} />
      
       <View style={styles.speechBubbleContainer}>
          <View style={styles.speechBubble}>
             <Text style={styles.speechText}>{mensagemAtual}</Text>
            
            {/* PONTA DO BALÃO (triângulo) */}
            <View style={styles.speechTail} />
          </View>
        </View>
      
      <Image source={require('../assets/images/calculia/avatar-robo.png')} style={styles.logo}/>
      <Button title="Click me!" onPress={() => alert("Hello, world!")} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
  flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },

  
  speechBubbleContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  
  speechBubble: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    maxWidth: 280,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra no iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Sombra no Android
    elevation: 3,
    position: 'relative',
    borderWidth: 2,              // Espessura da borda
    borderColor: '#d1d5db',        // Cor da borda
  },
  
  speechText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  
  // PONTA DO BALÃO (triângulo)
  speechTail: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#d1d5db',
  },

});