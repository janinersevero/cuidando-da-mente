/**
 * Calcula a velocidade do gesto baseado em eventos de touch
 * @param {TouchEvent} currentEvent - Evento atual
 * @param {TouchEvent} previousEvent - Evento anterior
 * @param {number} timeThreshold - Threshold de tempo em ms
 * @returns {number} Velocidade do gesto
 */
export const detectGestureSpeed = (currentEvent, previousEvent, timeThreshold = 16) => {
  if (!currentEvent || !previousEvent) return 0;

  const getCurrentPosition = (event) => {
    if (event.touches && event.touches.length > 0) {
      return { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY };
    } else if (event.changedTouches && event.changedTouches.length > 0) {
      return { clientX: event.changedTouches[0].clientX, clientY: event.changedTouches[0].clientY };
    } else {
      return { clientX: event.clientX, clientY: event.clientY };
    }
  };

  const currentPos = getCurrentPosition(currentEvent);
  const previousPos = getCurrentPosition(previousEvent);

  if (!currentPos || !previousPos) return 0;

  const deltaX = currentPos.clientX - previousPos.clientX;
  const deltaY = currentPos.clientY - previousPos.clientY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  const deltaTime = currentEvent.timeStamp - previousEvent.timeStamp;

  if (deltaTime === 0) return 0;

  return distance / Math.max(deltaTime, timeThreshold);
};

/**
 * Calcula a duração de um hold (toque mantido)
 * @param {number} startTime
 * @param {number} endTime
 * @returns {number}
 */
export const detectHoldDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  return (endTime - startTime) / 1000;
};

/**
 * Detecta a direção do drag
 * @param {TouchEvent} startEvent
 * @param {TouchEvent} currentEvent
 * @returns {Object}
 */
export const detectDragDirection = (startEvent, currentEvent) => {
  if (!startEvent || !currentEvent) {
    return { direction: null, magnitude: 0, deltaX: 0, deltaY: 0 };
  }

  const getPosition = (event) => {
    if (event.touches && event.touches.length > 0) {
      return { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY };
    } else if (event.changedTouches && event.changedTouches.length > 0) {
      return { clientX: event.changedTouches[0].clientX, clientY: event.changedTouches[0].clientY };
    } else {
      return { clientX: event.clientX, clientY: event.clientY };
    }
  };

  const startPos = getPosition(startEvent);
  const currentPos = getPosition(currentEvent);

  if (!startPos || !currentPos) {
    return { direction: null, magnitude: 0, deltaX: 0, deltaY: 0 };
  }

  const deltaX = currentPos.clientX - startPos.clientX;
  const deltaY = currentPos.clientY - startPos.clientY;
  const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  let direction = null;

  if (magnitude > 10) {
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
 * @param {number} speed
 * @param {number} threshold
 * @returns {boolean}
 */
export const isSmoothMovement = (speed, threshold = 0.5) => {
  return speed <= threshold;
};

/**
 * Detecta se o gesto é muito intenso (para o jogo do fogo)
 * @param {number} speed
 * @param {number} threshold
 * @returns {boolean}
 */
export const isIntenseMovement = (speed, threshold = 2.0) => {
  return speed > threshold;
};

/**
 * Verifica se a duração do hold está dentro do range esperado
 * @param {number} duration
 * @param {number} targetMin
 * @param {number} targetMax
 * @returns {boolean}
 */
export const isValidHoldDuration = (duration, targetMin = 3.5, targetMax = 5.5) => {
  return duration >= targetMin && duration <= targetMax;
};

/**
 * Calcula a intensidade do gesto baseado na velocidade e pressão
 * @param {number} speed
 * @param {number} pressure
 * @returns {number}
 */
export const calculateGestureIntensity = (speed, pressure = 0.5) => {
  const normalizedSpeed = Math.min(speed / 10, 1);

  const intensity = (normalizedSpeed * 0.7) + (pressure * 0.3);

  return Math.max(0, Math.min(1, intensity));
};
