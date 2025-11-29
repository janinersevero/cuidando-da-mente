import React, { useState, useEffect, useRef, useCallback } from 'react';
import useGameStore from '../../../store/gameStore';
import TouchArea from '../../../components/ui/TouchArea';
import ProgressCircle from '../../../components/ui/ProgressCircle';
import CalmIndicator from '../../../components/ui/CalmIndicator';
import { detectGestureSpeed, isIntenseMovement, calculateGestureIntensity } from '../../../utils/gestureUtils';
import { playElementSound, playFeedbackSound } from '../../../utils/audioUtils';

const FireGame = () => {
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

  const [flameSize, setFlameSize] = useState(50);
  const [flameColor, setFlameColor] = useState('#ff6b35');
  const [lastTouchEvent, setLastTouchEvent] = useState(null);
  const intervalRef = useRef(null);

  // Inicia o jogo
  useEffect(() => {
    startGame();
    playElementSound('fire');
    
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

  // Calcula o visual da chama baseado no estado
  const flameVisual = React.useMemo(() => {
    if (calm) {
      return {
        size: 40 + (progress / 100) * 60,
        color: '#22c55e'
      };
    } else {
      return {
        size: 50 + gestureIntensity * 50,
        color: gestureIntensity > 0.7 ? '#ef4444' : '#ff6b35'
      };
    }
  }, [calm, progress, gestureIntensity]);

  // Atualiza o visual quando necessário
  useEffect(() => {
    setFlameSize(flameVisual.size);
    setFlameColor(flameVisual.color);
  }, [flameVisual]);

  const handleTouchStart = useCallback((e) => {
    setLastTouchEvent(e);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!lastTouchEvent) return;

    const speed = detectGestureSpeed(e, lastTouchEvent);
    const intensity = calculateGestureIntensity(speed);
    const isIntense = isIntenseMovement(speed);

    setGestureIntensity(intensity);

    if (isIntense) {
      // Movimento muito intenso - erro
      setCalmState(false);
      updateProgress(-5);
      incrementMisses();
      playFeedbackSound(false);
    } else {
      // Movimento controlado - sucesso
      setCalmState(true);
      updateProgress(2);
      incrementHits();
    }

    setLastTouchEvent(e);
  }, [lastTouchEvent, setGestureIntensity, setCalmState, updateProgress, incrementHits, incrementMisses]);

  const handleTouchEnd = useCallback(() => {
    setLastTouchEvent(null);
    setCalmState(false);
    
    // Gradualmente reduz a intensidade
    setTimeout(() => {
      setGestureIntensity(0);
    }, 500);
  }, [setCalmState, setGestureIntensity]);

  // Para o jogo quando o tempo acabar
  useEffect(() => {
    if (timeRemaining <= 0 && isGameActive) {
      endGame();
    }
  }, [timeRemaining, isGameActive, endGame]);

  const getFlameStyle = () => ({
    width: `${flameSize}px`,
    height: `${flameSize}px`,
    backgroundColor: flameColor,
    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
    filter: 'blur(2px)',
    boxShadow: `0 0 ${flameSize/2}px ${flameColor}`,
    transform: calm ? 'scale(1.1)' : 'scale(1)',
    transition: 'all 0.3s ease-out'
  });

  const getInstructions = () => {
    if (gestureIntensity > 0.7) {
      return "Muito rápido! Movimente mais devagar";
    } else if (calm) {
      return "Perfeito! Continue assim";
    } else {
      return "Toque e mova suavemente para controlar o fogo";
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #FF6B6B, #FFE66D)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header com informações */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '20px',
          padding: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: 'white',
              margin: '0 0 8px 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              🔥 Fogo
            </h2>
            <p style={{ 
              fontSize: '18px', 
              color: 'white',
              opacity: 0.9,
              margin: 0
            }}>
              Controle seus movimentos
            </p>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <p style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: 'white',
              margin: '0 0 8px 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              {Math.ceil(timeRemaining)}s
            </p>
            <p style={{ 
              fontSize: '16px', 
              color: 'white',
              opacity: 0.9,
              margin: 0
            }}>
              {hits} acertos | {misses} erros
            </p>
          </div>
        </div>

        {/* Progresso */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          <ProgressCircle value={progress} calm={calm} />
        </div>

        {/* Área do jogo */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '30px',
          padding: '40px',
          marginBottom: '30px',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <p style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: 'white', 
              margin: 0,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              {getInstructions()}
            </p>
          </div>

          <TouchArea
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '300px',
              background: 'rgba(0,0,0,0.1)',
              borderRadius: '20px',
              border: '2px solid rgba(255,255,255,0.3)'
            }}
          >
            {/* Chama visual */}
            <div 
              style={getFlameStyle()}
              className="relative"
            >
              <div 
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  backgroundColor: flameColor,
                  opacity: 0.3,
                  transform: 'scale(1.2)'
                }}
              />
            </div>
          </TouchArea>
        </div>

        {/* Indicador de calma */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CalmIndicator calm={calm} intensity={gestureIntensity} />
        </div>
      </div>
    </div>
  );
};

export default FireGame;
