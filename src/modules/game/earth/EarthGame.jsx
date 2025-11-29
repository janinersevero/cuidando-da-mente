import React, { useState, useEffect, useRef, useCallback } from 'react';
import useGameStore from '../../../store/gameStore';
import TouchArea from '../../../components/ui/TouchArea';
import ProgressCircle from '../../../components/ui/ProgressCircle';
import CalmIndicator from '../../../components/ui/CalmIndicator';
import { detectHoldDuration } from '../../../utils/gestureUtils';
import { playElementSound, playFeedbackSound } from '../../../utils/audioUtils';

const EarthGame = () => {
  const {
    progress,
    calm,
    hits,
    misses,
    isGameActive,
    timeRemaining,
    updateProgress,
    setCalmState,
    incrementHits,
    incrementMisses,
    startGame,
    endGame,
    updateTimeRemaining
  } = useGameStore();

  const [plantStage, setPlantStage] = useState(0); // 0: semente, 1: broto, 2: flor
  const [isHolding, setIsHolding] = useState(false);
  const [holdStartTime, setHoldStartTime] = useState(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [plantsGrown, setPlantsGrown] = useState(0);
  const intervalRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Inicia o jogo
  useEffect(() => {
    startGame();
    playElementSound('earth');
    
    return () => {
      endGame();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
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

  const handleTouchStart = useCallback(() => {
    if (!isHolding) {
      setIsHolding(true);
      setHoldStartTime(Date.now());
      setHoldProgress(0);
      setCalmState(true);
      
      // Inicia o progresso visual do hold
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - Date.now();
        const progress = Math.min(elapsed / 3000, 1) * 100; // 3 segundos
        setHoldProgress(progress);
      }, 50);
    }
  }, [isHolding, setCalmState]);

  const handleTouchEnd = useCallback(() => {
    if (isHolding && holdStartTime) {
      const holdDuration = detectHoldDuration(holdStartTime, Date.now());
      
      setIsHolding(false);
      setCalmState(false);
      setHoldProgress(0);
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      if (holdDuration >= 3.0) {
        // Hold bem-sucedido - planta cresce
        incrementHits();
        updateProgress(15);
        playFeedbackSound(true);
        
        if (plantStage < 2) {
          setPlantStage(prev => prev + 1);
        } else {
          // Planta completa - reinicia ciclo
          setPlantStage(0);
          setPlantsGrown(prev => prev + 1);
        }
      } else {
        // Hold muito curto - erro
        incrementMisses();
        updateProgress(-5);
        playFeedbackSound(false);
      }
      
      setHoldStartTime(null);
    }
  }, [isHolding, holdStartTime, plantStage, incrementHits, incrementMisses, updateProgress, setCalmState]);

  // Atualiza progresso visual do hold em tempo real
  useEffect(() => {
    if (isHolding && holdStartTime) {
      const updateProgress = () => {
        const elapsed = Date.now() - holdStartTime;
        const progress = Math.min(elapsed / 3000, 1) * 100;
        setHoldProgress(progress);
        
        if (progress < 100) {
          requestAnimationFrame(updateProgress);
        }
      };
      
      requestAnimationFrame(updateProgress);
    }
  }, [isHolding, holdStartTime]);

  // Para o jogo quando o tempo acabar
  useEffect(() => {
    if (timeRemaining <= 0 && isGameActive) {
      endGame();
    }
  }, [timeRemaining, isGameActive, endGame]);

  const getPlantVisual = () => {
    const baseSize = 40;
    const growthMultiplier = isHolding ? 1.2 : 1;
    
    switch (plantStage) {
      case 0: // Semente
        return {
          component: (
            <div 
              className="rounded-full bg-amber-800 transition-all duration-300"
              style={{
                width: `${baseSize * 0.5 * growthMultiplier}px`,
                height: `${baseSize * 0.5 * growthMultiplier}px`,
              }}
            />
          ),
          color: '#92400e',
          stage: 'Semente'
        };
      
      case 1: // Broto
        return {
          component: (
            <div className="flex flex-col items-center transition-all duration-300">
              <div 
                className="rounded-full bg-green-400"
                style={{
                  width: `${baseSize * 0.3 * growthMultiplier}px`,
                  height: `${baseSize * 0.3 * growthMultiplier}px`,
                  marginBottom: '4px'
                }}
              />
              <div 
                className="bg-green-600 rounded-t-full"
                style={{
                  width: `${baseSize * 0.2 * growthMultiplier}px`,
                  height: `${baseSize * 0.8 * growthMultiplier}px`,
                }}
              />
            </div>
          ),
          color: '#22c55e',
          stage: 'Broto'
        };
      
      case 2: // Flor
        return {
          component: (
            <div className="flex flex-col items-center transition-all duration-300">
              <div className="flex space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className="rounded-full bg-pink-400"
                    style={{
                      width: `${baseSize * 0.2 * growthMultiplier}px`,
                      height: `${baseSize * 0.2 * growthMultiplier}px`,
                    }}
                  />
                ))}
              </div>
              <div 
                className="bg-green-600 rounded-t-full"
                style={{
                  width: `${baseSize * 0.15 * growthMultiplier}px`,
                  height: `${baseSize * 0.6 * growthMultiplier}px`,
                }}
              />
            </div>
          ),
          color: '#ec4899',
          stage: 'Flor'
        };
      
      default:
        return {
          component: null,
          color: '#6b7280',
          stage: 'Vazio'
        };
    }
  };

  const plant = getPlantVisual();

  const getInstructions = () => {
    if (isHolding) {
      return `Continue segurando... ${Math.round(holdProgress)}%`;
    } else {
      return `Toque e segure por 3 segundos para ${plantStage < 2 ? 'crescer' : 'plantar nova semente'}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-emerald-100 p-6">
      <div className="max-w-md mx-auto">
        {/* Header com informações */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">🌱 Terra</h2>
            <p className="text-sm text-gray-600">Paciência e crescimento</p>
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

        {/* Status da planta */}
        <div className="text-center mb-4">
          <p className="text-lg font-bold text-green-700">
            {plantsGrown} plantas completas
          </p>
          <p className="text-sm text-gray-600">
            Estágio atual: {plant.stage}
          </p>
        </div>

        {/* Área do jogo */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
          <div className="text-center mb-6">
            <p className="text-lg font-medium text-gray-700 mb-2">
              {getInstructions()}
            </p>
          </div>

          <TouchArea
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex flex-col items-center justify-center h-64 bg-gradient-to-b from-amber-50 to-green-50 rounded-xl relative overflow-hidden"
          >
            {/* Solo */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-amber-900 rounded-b-xl" />
            
            {/* Progresso do hold */}
            {isHolding && (
              <div className="absolute top-4 left-4 right-4">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-100 ease-out"
                    style={{ width: `${holdProgress}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Planta */}
            <div className="flex items-end justify-center h-32 mb-8">
              {plant.component}
            </div>
            
            {/* Efeito de crescimento */}
            {isHolding && (
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `radial-gradient(circle at center, ${plant.color}20 0%, transparent 70%)`,
                    animation: 'pulse 1s infinite'
                  }}
                />
              </div>
            )}
          </TouchArea>
        </div>

        {/* Indicador de calma */}
        <div className="flex justify-center">
          <CalmIndicator calm={calm} intensity={holdProgress / 100} />
        </div>
      </div>
    </div>
  );
};

export default EarthGame;
