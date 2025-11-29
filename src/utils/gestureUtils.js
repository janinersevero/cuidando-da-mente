// Utilitários para detecção de gestos

/**
 * Calcula a velocidade do gesto baseado em eventos de touch
 * @param {TouchEvent} currentEvent - Evento atual
 * @param {TouchEvent} previousEvent - Evento anterior
 * @param {number} timeThreshold - Threshold de tempo em ms
 * @returns {number} Velocidade do gesto
 */
export const detectGestureSpeed = (currentEvent, previousEvent, timeThreshold = 16) => {
  if (!currentEvent || !previousEvent) return 0;
  
  const currentTouch = currentEvent.touches[0] || currentEvent.changedTouches[0];
  const previousTouch = previousEvent.touches[0] || previousEvent.changedTouches[0];
  
  if (!currentTouch || !previousTouch) return 0;
  
  const deltaX = currentTouch.clientX - previousTouch.clientX;
  const deltaY = currentTouch.clientY - previousTouch.clientY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  const deltaTime = currentEvent.timeStamp - previousEvent.timeStamp;
  
  if (deltaTime === 0) return 0;
  
  // Velocidade em pixels por milissegundo
  return distance / Math.max(deltaTime, timeThreshold);
};

/**
 * Calcula a duração de um hold (toque mantido)
 * @param {number} startTime - Timestamp do início
 * @param {number} endTime - Timestamp do fim
 * @returns {number} Duração em segundos
 */
export const detectHoldDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  return (endTime - startTime) / 1000;
};

/**
 * Detecta a direção do drag
 * @param {TouchEvent} startEvent - Evento de início
 * @param {TouchEvent} currentEvent - Evento atual
 * @returns {Object} Objeto com direção e magnitude
 */
export const detectDragDirection = (startEvent, currentEvent) => {
  if (!startEvent || !currentEvent) {
    return { direction: null, magnitude: 0, deltaX: 0, deltaY: 0 };
  }
  
  const startTouch = startEvent.touches[0] || startEvent.changedTouches[0];
  const currentTouch = currentEvent.touches[0] || currentEvent.changedTouches[0];
  
  if (!startTouch || !currentTouch) {
    return { direction: null, magnitude: 0, deltaX: 0, deltaY: 0 };
  }
  
  const deltaX = currentTouch.clientX - startTouch.clientX;
  const deltaY = currentTouch.clientY - startTouch.clientY;
  const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  let direction = null;
  
  if (magnitude > 10) { // Threshold mínimo para considerar movimento
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    if (angle >= -45 && angle <= 45) direction = 'right';
    else if (angle >= 45 && angle <= 135) direction = 'down';
    else if (angle >= 135 || angle <= -135) direction = 'left';
    else direction = 'up';
  }
  
  return { direction, magnitude, deltaX, deltaY };
};

/**
 * Detecta se o movimento é suave (para o jogo da água)
 * @param {number} speed - Velocidade atual
 * @param {number} threshold - Threshold de suavidade
 * @returns {boolean} True se o movimento é suave
 */
export const isSmoothMovement = (speed, threshold = 0.5) => {
  return speed <= threshold;
};

/**
 * Detecta se o gesto é muito intenso (para o jogo do fogo)
 * @param {number} speed - Velocidade atual
 * @param {number} threshold - Threshold de intensidade
 * @returns {boolean} True se o movimento é muito intenso
 */
export const isIntenseMovement = (speed, threshold = 2.0) => {
  return speed > threshold;
};

/**
 * Verifica se a duração do hold está dentro do range esperado
 * @param {number} duration - Duração em segundos
 * @param {number} targetMin - Tempo mínimo esperado
 * @param {number} targetMax - Tempo máximo esperado
 * @returns {boolean} True se está dentro do range
 */
export const isValidHoldDuration = (duration, targetMin = 3.5, targetMax = 5.5) => {
  return duration >= targetMin && duration <= targetMax;
};

/**
 * Calcula a intensidade do gesto baseado na velocidade e pressão
 * @param {number} speed - Velocidade do movimento
 * @param {number} pressure - Pressão do toque (se disponível)
 * @returns {number} Intensidade normalizada (0-1)
 */
export const calculateGestureIntensity = (speed, pressure = 0.5) => {
  // Normaliza a velocidade (assumindo max de 10 pixels/ms)
  const normalizedSpeed = Math.min(speed / 10, 1);
  
  // Combina velocidade e pressão
  const intensity = (normalizedSpeed * 0.7) + (pressure * 0.3);
  
  return Math.max(0, Math.min(1, intensity));
};
