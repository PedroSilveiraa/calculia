import { useAudioPlayer } from 'expo-audio';

const acertouSound = require('../assets/sounds/acertou.mp3');
const errouSound = require('../assets/sounds/errou.mp3');
const jogarSound = require('../assets/sounds/jogar.mp3');
const ganhouSound = require('../assets/sounds/ganhou.mp3');
const perdeuSound = require('../assets/sounds/perdeu.mp3');
const conquistaSound = require('../assets/sounds/conquista.mp3');

export function useSound() {
  const acertouPlayer = useAudioPlayer(acertouSound, {
    shouldPlay: false
  });
  const errouPlayer = useAudioPlayer(errouSound, {
    shouldPlay: false
  });
  const jogarPlayer = useAudioPlayer(jogarSound, {
    shouldPlay: false
  });
  const ganhouPlayer = useAudioPlayer(ganhouSound, {
    shouldPlay: false
  });
  const perdeuPlayer = useAudioPlayer(perdeuSound, {
    shouldPlay: false
  });
  const conquistaPlayer = useAudioPlayer(conquistaSound, {
    shouldPlay: false
  });

  const playSound = async (player, source) => {
    try {
      if (!player) {
        console.warn('Player não está disponível');
        return;
      }

      // Para o som se estiver tocando
      if (player.playing) {
        player.pause();
      }

      // Recarrega o source e toca
      player.replace(source);
      player.play();
    } catch (error) {
      console.error('Erro ao tocar som:', error);
    }
  };

  return {
    playAcertou: () => playSound(acertouPlayer, acertouSound),
    playErrou: () => playSound(errouPlayer, errouSound),
    playJogar: () => playSound(jogarPlayer, jogarSound),
    playGanhou: () => playSound(ganhouPlayer, ganhouSound),
    playPerdeu: () => playSound(perdeuPlayer, perdeuSound),
    playConquista: () => playSound(conquistaPlayer, conquistaSound),
  };
}
