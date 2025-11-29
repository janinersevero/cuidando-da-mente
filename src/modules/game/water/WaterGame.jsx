import React, { useState, useEffect, useRef, useCallback } from 'react';
import useGameStore from '../../../store/gameStore';
import TouchArea from '../../../components/ui/TouchArea';
import ProgressCircle from '../../../components/ui/ProgressCircle';
import CalmIndicator from '../../../components/ui/CalmIndicator';
import { detectHoldDuration, isValidHoldDuration } from '../../../utils/gestureUtils';
import { playElementSound, playFeedbackSound } from '../../../utils/audioUtils';

const WaterGame = () => {
  const {
    progress,
    calm,
    hits,
    misses,
    breathingRhythm,
    isGameActive,
    timeRemaining,
    updateProgress,
    setCalmState,
    incrementHits,
    incrementMisses,
    setBreathingRhythm,
    startGame,
    endGame,
    updateTimeRemaining
  } = useGameStore();

  const [isInhaling, setIsInhaling] = useState(false);
  const [holdStartTime, setHoldStartTime] = useState(null);
  const [breathingCycles, setBreathingCycles] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('waiting'); // 'waiting', 'inhaling', 'exhaling'
  const intervalRef = useRef(null);

  // Inicia o jogo
  useEffect(() => {
    startGame();
    playElementSound('water');
    
    return () => {
      endGame();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startGame, endGame]);

  // Timer do jogo
  useEffect(() => {
    if (isGameActive) {
      intervalRef.current = setInterval(() => {
        updateTimeRemaining();
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isGameActive, updateTimeRemaining]);

  // Atualiza o ritmo de respiração baseado nos ciclos
  useEffect(() => {
    if (breathingCycles > 0) {
      const rhythm = Math.min(breathingCycles * 10, 100);
      setBreathingRhythm(rhythm);
    }
  }, [breathingCycles, setBreathingRhythm]);

  const handleTouchStart = useCallback(() => {
    if (!isInhaling && currentPhase === 'waiting') {
      setHoldStartTime(Date.now());
      setIsInhaling(true);
      setCurrentPhase('inhaling');
      setCalmState(true);
    }
  }, [isInhaling, currentPhase, setCalmState]);

  const handleTouchEnd = useCallback(() => {
    if (isInhaling && holdStartTime && currentPhase === 'inhaling') {
      const holdDuration = detectHoldDuration(holdStartTime, Date.now());
      const isValidDuration = isValidHoldDuration(holdDuration, 3.5, 5.5);

      setIsInhaling(false);
      setCurrentPhase('exhaling');
      
      if (isValidDuration) {
        // Respiração correta
        incrementHits();
        updateProgress(8);
        setBreathingCycles(prev => prev + 1);
        playFeedbackSound(true);
      } else {
        // Respiração incorreta (muito rápida ou muito lenta)
        incrementMisses();
        updateProgress(-3);
        playFeedbackSound(false);
      }

      // Fase de expiração
      setTimeout(() => {
        setCurrentPhase('waiting');
        setCalmState(false);
        setHoldStartTime(null);
      }, 1000);
    }
  }, [isInhaling, holdStartTime, currentPhase, incrementHits, incrementMisses, updateProgress, setCalmState]);

  // Para o jogo quando o tempo acabar
  useEffect(() => {
    if (timeRemaining <= 0 && isGameActive) {
      endGame();
    }
  }, [timeRemaining, isGameActive, endGame]);

  // Animação do círculo baseado no estado
  const getCircleStyle = () => {
    let size = 80;
    let opacity = 0.7;
    
    if (currentPhase === 'inhaling') {
      size = 80 + Math.min(breathingCycles * 10, 40);
      opacity = 0.9;
    } else if (currentPhase === 'exhaling') {
      size = 60;
      opacity = 0.5;
    }

    return {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: calm ? '#3b82f6' : '#60a5fa',
      borderRadius: '50%',
      opacity,
      transform: isInhaling ? 'scale(1.5)' : 'scale(1)',
      transition: 'all 0.5s ease-out',
      boxShadow: `0 0 ${size/2}px rgba(59, 130, 246, 0.4)`
    };
  };

  const getInstructions = () => {
    switch (currentPhase) {
      case 'inhaling':
        return "Inspire... segure por 4 segundos";
      case 'exhaling':
        return "Expire... relaxe";
      default:
        return "Toque e segure para inspirar (4 segundos)";
    }
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhaling':
        return "INSPIRANDO";
      case 'exhaling':
        return "EXPIRANDO";
      default:
        return "PRONTO";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-cyan-100 p-6">
      <div className="max-w-md mx-auto">
        {/* Header com informações */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">💧 Água</h2>
            <p className="text-sm text-gray-600">Respiração 4-4</p>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-bold text-gray-700">
              {Math.ceil(timeRemaining)}s
            </p>
            <p className="text-sm text-gray-600">
              {hits} acertos | {misses} erros
            </p>
          </div>
        </div>

        {/* Progresso */}
        <div className="flex justify-center mb-6">
          <ProgressCircle value={progress} calm={calm} />
        </div>

        {/* Ciclos de respiração */}
        <div className="text-center mb-4">
          <p className="text-lg font-bold text-blue-700">
            {breathingCycles} ciclos completos
          </p>
        </div>

        {/* Área do jogo */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
          <div className="text-center mb-6">
            <p className="text-lg font-medium text-gray-700 mb-2">
              {getInstructions()}
            </p>
            <p className="text-sm font-bold text-blue-600">
              {getPhaseText()}
            </p>
          </div>

          <TouchArea
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex justify-center items-center h-64 bg-gradient-to-b from-blue-50 to-cyan-50 rounded-xl"
          >
            {/* Círculo de respiração */}
            <div className="relative flex items-center justify-center">
              <div style={getCircleStyle()} />
              
              {/* Ondas concêntricas */}
              {isInhaling && (
                <>
                  <div 
                    className="absolute rounded-full border-2 border-blue-300 animate-ping"
                    style={{ 
                      width: '120px', 
                      height: '120px',
                      animationDuration: '2s'
                    }} 
                  />
                  <div 
                    className="absolute rounded-full border-2 border-blue-200 animate-ping"
                    style={{ 
                      width: '160px', 
                      height: '160px',
                      animationDuration: '2.5s',
                      animationDelay: '0.5s'
                    }} 
                  />
                </>
              )}
            </div>
          </TouchArea>
        </div>

        {/* Indicador de calma */}
        <div className="flex justify-center">
          <CalmIndicator calm={calm} intensity={breathingRhythm / 100} />
        </div>
      </div>
    </div>
  );
};

export default WaterGame;
