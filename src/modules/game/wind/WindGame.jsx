import React, { useState, useEffect, useRef, useCallback } from 'react';
import useGameStore from '../../../store/gameStore';
import TouchArea from '../../../components/ui/TouchArea';
import ProgressCircle from '../../../components/ui/ProgressCircle';
import CalmIndicator from '../../../components/ui/CalmIndicator';
import { detectDragDirection, isSmoothMovement, detectGestureSpeed } from '../../../utils/gestureUtils';
import { playElementSound, playFeedbackSound } from '../../../utils/audioUtils';

const WindGame = () => {
  const {
    progress,
    calm,
    hits,
    misses,
    gestureIntensity,
    isGameActive,
    timeRemaining,
    updateProgress,
    setCalmState,
    incrementHits,
    incrementMisses,
    setGestureIntensity,
    startGame,
    endGame,
    updateTimeRemaining
  } = useGameStore();

  // Cria folhas iniciais com valores pré-definidos
  const [leaves, setLeaves] = useState(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: (i * 40) + (i % 3) * 20,
      y: 100 + (i * 30),
      size: 12 + (i % 4) * 2,
      rotation: i * 45,
      originalX: (i * 40) + (i % 3) * 20
    }))
  );
  const [dragStart, setDragStart] = useState(null);
  const [lastTouchEvent, setLastTouchEvent] = useState(null);
  const [windIntensity, setWindIntensity] = useState(0);
  const intervalRef = useRef(null);

  // Inicia o jogo
  useEffect(() => {
    startGame();
    playElementSound('wind');
    
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

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0] || e.changedTouches[0];
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setLastTouchEvent(e);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!dragStart || !lastTouchEvent) return;

    const { direction, magnitude } = detectDragDirection({ touches: [dragStart] }, e);
    const speed = detectGestureSpeed(e, lastTouchEvent);
    const isSmooth = isSmoothMovement(speed, 1.5);

    setGestureIntensity(speed);
    setWindIntensity(Math.min(magnitude / 100, 1));

    if (isSmooth && direction === 'right') {
      // Movimento suave para a direita - sucesso
      setCalmState(true);
      updateProgress(3);
      incrementHits();
      
      // Move as folhas suavemente
      setLeaves(prevLeaves => 
        prevLeaves.map(leaf => ({
          ...leaf,
          x: Math.min(leaf.x + speed * 5, 350),
          rotation: leaf.rotation + speed * 10
        }))
      );
    } else if (!isSmooth || (direction && direction !== 'right')) {
      // Movimento brusco ou direção errada - erro
      setCalmState(false);
      updateProgress(-2);
      incrementMisses();
      playFeedbackSound(false);
      
      // Folhas se dispersam
      setLeaves(prevLeaves => 
        prevLeaves.map(leaf => ({
          ...leaf,
          x: leaf.x + (Math.random() - 0.5) * 20,
          y: leaf.y + (Math.random() - 0.5) * 10,
          rotation: leaf.rotation + Math.random() * 90
        }))
      );
    }

    setLastTouchEvent(e);
  }, [dragStart, lastTouchEvent, setGestureIntensity, setCalmState, updateProgress, incrementHits, incrementMisses]);

  const handleTouchEnd = useCallback(() => {
    setDragStart(null);
    setLastTouchEvent(null);
    setCalmState(false);
    
    // Gradualmente reduz a intensidade do vento
    setTimeout(() => {
      setWindIntensity(0);
      setGestureIntensity(0);
    }, 500);
  }, [setCalmState, setGestureIntensity]);

  // Para o jogo quando o tempo acabar
  useEffect(() => {
    if (timeRemaining <= 0 && isGameActive) {
      endGame();
    }
  }, [timeRemaining, isGameActive, endGame]);

  // Reseta posições das folhas quando saem da tela
  useEffect(() => {
    const resetTimer = setInterval(() => {
      setLeaves(prevLeaves => 
        prevLeaves.map(leaf => 
          leaf.x > 400 ? { ...leaf, x: -20, y: 100 + Math.random() * 150 } : leaf
        )
      );
    }, 2000);

    return () => clearInterval(resetTimer);
  }, []);

  const getInstructions = () => {
    if (gestureIntensity > 1.5) {
      return "Muito rápido! Mova mais suavemente";
    } else if (calm) {
      return "Perfeito! Continue movendo suavemente";
    } else {
      return "Arraste suavemente da esquerda para direita";
    }
  };

  const getWindEffect = () => ({
    filter: `blur(${windIntensity * 2}px)`,
    transform: `translateX(${windIntensity * 10}px)`,
    transition: 'all 0.2s ease-out'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-100 to-blue-100 p-6">
      <div className="max-w-md mx-auto">
        {/* Header com informações */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">🌬️ Vento</h2>
            <p className="text-sm text-gray-600">Movimento contínuo</p>
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

        {/* Intensidade do vento */}
        <div className="text-center mb-4">
          <p className="text-lg font-bold text-cyan-700">
            Intensidade: {Math.round(windIntensity * 100)}%
          </p>
        </div>

        {/* Área do jogo */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-6 overflow-hidden">
          <div className="text-center mb-4">
            <p className="text-lg font-medium text-gray-700 mb-2">
              {getInstructions()}
            </p>
          </div>

          <TouchArea
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative h-64 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl overflow-hidden"
          >
            {/* Nuvens de fundo */}
            <div className="absolute inset-0 opacity-20">
              <div 
                className="absolute top-4 left-8 w-16 h-8 bg-white rounded-full"
                style={getWindEffect()}
              />
              <div 
                className="absolute top-12 right-12 w-20 h-10 bg-white rounded-full"
                style={getWindEffect()}
              />
              <div 
                className="absolute bottom-16 left-4 w-12 h-6 bg-white rounded-full"
                style={getWindEffect()}
              />
            </div>

            {/* Folhas */}
            {leaves.map(leaf => (
              <div
                key={leaf.id}
                className="absolute transition-all duration-200 ease-out"
                style={{
                  left: `${leaf.x}px`,
                  top: `${leaf.y}px`,
                  width: `${leaf.size}px`,
                  height: `${leaf.size}px`,
                  transform: `rotate(${leaf.rotation}deg)`,
                  backgroundColor: '#10b981',
                  borderRadius: '0 50% 0 50%',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            ))}

            {/* Indicador de direção */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-gray-500">
              <span>←</span>
              <span className="text-xs">Arraste para a direita</span>
              <span>→</span>
            </div>
          </TouchArea>
        </div>

        {/* Indicador de calma */}
        <div className="flex justify-center">
          <CalmIndicator calm={calm} intensity={gestureIntensity / 3} />
        </div>
      </div>
    </div>
  );
};

export default WindGame;
