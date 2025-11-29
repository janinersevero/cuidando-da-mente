import { Howl, Howler } from 'howler';

// Configuração dos sons do jogo
const SOUNDS = {
  fire: {
    src: ['/sounds/fire.mp3', '/sounds/fire.wav'],
    loop: true,
    volume: 0.4
  },
  water: {
    src: ['/sounds/water.mp3', '/sounds/water.wav'],
    loop: true,
    volume: 0.4
  },
  wind: {
    src: ['/sounds/wind.mp3', '/sounds/wind.wav'],
    loop: true,
    volume: 0.4
  },
  earth: {
    src: ['/sounds/birds.mp3', '/sounds/birds.wav'],
    loop: true,
    volume: 0.4
  },
  success: {
    src: ['/sounds/success.mp3', '/sounds/success.wav'],
    loop: false,
    volume: 0.6
  },
  error: {
    src: ['/sounds/error.mp3', '/sounds/error.wav'],
    loop: false,
    volume: 0.5
  }
};

// Cache dos objetos Howl
const soundCache = {};

/**
 * Inicializa um som e o adiciona ao cache
 * @param {string} soundKey - Chave do som
 * @returns {Howl} Objeto Howl inicializado
 */
export const initializeSound = (soundKey) => {
  if (soundCache[soundKey]) {
    return soundCache[soundKey];
  }
  
  const soundConfig = SOUNDS[soundKey];
  if (!soundConfig) {
    console.warn(`Som ${soundKey} não encontrado`);
    return null;
  }
  
  const howl = new Howl(soundConfig);
  soundCache[soundKey] = howl;
  
  return howl;
};

/**
 * Toca um som específico
 * @param {string} soundKey - Chave do som
 * @param {Object} options - Opções adicionais
 */
export const playSound = (soundKey, options = {}) => {
  try {
    let sound = soundCache[soundKey];
    
    if (!sound) {
      sound = initializeSound(soundKey);
    }
    
    if (!sound) {
      console.warn(`Não foi possível inicializar o som ${soundKey}`);
      return;
    }
    
    // Aplica opções específicas se fornecidas
    if (options.volume !== undefined) {
      sound.volume(options.volume);
    }
    
    if (options.loop !== undefined) {
      sound.loop(options.loop);
    }
    
    // Para o som se já estiver tocando e não for loop
    if (!sound._loop && sound.playing()) {
      sound.stop();
    }
    
    sound.play();
    
    return sound;
  } catch (error) {
    console.error(`Erro ao tocar som ${soundKey}:`, error);
  }
};

/**
 * Para um som específico
 * @param {string} soundKey - Chave do som
 */
export const stopSound = (soundKey) => {
  try {
    const sound = soundCache[soundKey];
    if (sound && sound.playing()) {
      sound.stop();
    }
  } catch (error) {
    console.error(`Erro ao parar som ${soundKey}:`, error);
  }
};

/**
 * Para todos os sons
 */
export const stopAllSounds = () => {
  try {
    Object.keys(soundCache).forEach(soundKey => {
      stopSound(soundKey);
    });
  } catch (error) {
    console.error('Erro ao parar todos os sons:', error);
  }
};

/**
 * Ajusta o volume de um som
 * @param {string} soundKey - Chave do som
 * @param {number} volume - Volume (0-1)
 */
export const setVolume = (soundKey, volume) => {
  try {
    const sound = soundCache[soundKey];
    if (sound) {
      sound.volume(Math.max(0, Math.min(1, volume)));
    }
  } catch (error) {
    console.error(`Erro ao ajustar volume do som ${soundKey}:`, error);
  }
};

/**
 * Ajusta o volume global de todos os sons
 * @param {number} volume - Volume global (0-1)
 */
export const setGlobalVolume = (volume) => {
  try {
    Howler.volume(Math.max(0, Math.min(1, volume)));
  } catch (error) {
    console.error('Erro ao ajustar volume global:', error);
  }
};

/**
 * Toca o som ambiente do elemento atual
 * @param {string} element - Elemento atual (fire, water, wind, earth)
 */
export const playElementSound = (element) => {
  // Para todos os sons ambiente antes de tocar o novo
  stopSound('fire');
  stopSound('water');
  stopSound('wind');
  stopSound('earth');
  
  if (element && SOUNDS[element]) {
    playSound(element);
  }
};

/**
 * Toca som de feedback (sucesso ou erro)
 * @param {boolean} success - True para sucesso, false para erro
 */
export const playFeedbackSound = (success) => {
  const soundKey = success ? 'success' : 'error';
  playSound(soundKey);
};

/**
 * Pré-carrega todos os sons
 */
export const preloadSounds = () => {
  return new Promise((resolve) => {
    const soundKeys = Object.keys(SOUNDS);
    let loadedCount = 0;
    
    const checkComplete = () => {
      loadedCount++;
      if (loadedCount >= soundKeys.length) {
        resolve();
      }
    };
    
    soundKeys.forEach(soundKey => {
      const sound = initializeSound(soundKey);
      if (sound) {
        sound.once('load', checkComplete);
        sound.once('loaderror', checkComplete);
      } else {
        checkComplete();
      }
    });
    
    // Timeout para evitar travamento
    setTimeout(resolve, 5000);
  });
};

/**
 * Limpa o cache de sons
 */
export const clearSoundCache = () => {
  Object.values(soundCache).forEach(sound => {
    if (sound) {
      sound.unload();
    }
  });
  
  Object.keys(soundCache).forEach(key => {
    delete soundCache[key];
  });
};

// Exporta também as constantes para uso externo
export { SOUNDS };
