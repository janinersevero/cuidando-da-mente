import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../../../store/gameStore';
import BackButton from '../../../components/ui/BackButton';
import { playElementSound, playFeedbackSound } from '../../../utils/audioUtils';
import { detectGestureSpeed, isIntenseMovement, calculateGestureIntensity } from '../../../utils/gestureUtils';
import fireBackground from '../../../assets/figma/fire_background.jpg';
import fireGif from '../../../assets/figma/fire_gif.gif';

const FireGame = () => {
  const {
    calm,
    isGameActive,
    timeRemaining,
    setCalmState,
    incrementHits,
    incrementMisses,
    setGestureIntensity,
    gestureIntensity,
    startGame,
    endGame,
    updateTimeRemaining
  } = useGameStore();

  const intervalRef = useRef(null);
  const [lastTouchEvent, setLastTouchEvent] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [gamePhase, setGamePhase] = useState('playing');
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    startGame();
    playElementSound('fire');

    return () => {
      endGame();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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

  useEffect(() => {
    if (timeRemaining <= 0 && isGameActive && gamePhase === 'playing') {
      endGame();
    }
  }, [timeRemaining, isGameActive, endGame, gamePhase]);

  const handleTouchStart = useCallback((e) => {
    if (gamePhase !== 'playing') return;
    setLastTouchEvent(e);
  }, [gamePhase]);

  const handleTouchMove = useCallback((e) => {
    if (!lastTouchEvent || gamePhase !== 'playing') return;

    const speed = detectGestureSpeed(e, lastTouchEvent);
    const intensity = calculateGestureIntensity(speed);
    const isIntense = isIntenseMovement(speed);

    setGestureIntensity(intensity);

    if (isIntense) {
      setCalmState(false);
      setCurrentProgress(prev => Math.max(0, prev - 2));
      incrementMisses();
      playFeedbackSound(false);
    } else {
      setCalmState(true);
      setCurrentProgress(prev => {
        const newProgress = Math.min(100, prev + 0.5);

        if (newProgress >= 100 && gamePhase === 'playing') {
          setTimeout(() => {
            setGamePhase('completed');
            setShowCelebration(true);

            setTimeout(() => {
              setShowCelebration(false);
              endGame();
            }, 3000);
          }, 0);
        }

        return newProgress;
      });
      incrementHits();
      playFeedbackSound(true);
    }

    setLastTouchEvent(e);

    setTimeout(() => setCalmState(false), 500);
  }, [lastTouchEvent, gamePhase, setGestureIntensity, setCalmState, incrementHits, incrementMisses, endGame]);

  const handleTouchEnd = useCallback(() => {
    setLastTouchEvent(null);
    setCalmState(false);

    setTimeout(() => {
      setGestureIntensity(0);
    }, 500);
  }, [setCalmState, setGestureIntensity]);

  const getInstructions = () => {
    if (gamePhase === 'completed') {
      return "Parabéns, você controlou o fogo com calma!";
    } else if (gestureIntensity > 0.7) {
      return "Muito rápido! Toque e arraste devagar";
    } else if (calm) {
      return "Ótimo! Continue movendo suavemente";
    } else if (currentProgress > 0) {
      return "Continue! Toque e arraste lentamente";
    } else {
      return "CLIQUE no fogo e ARRASTE devagar em círculos";
    }
  };

  const getFlameStyle = () => {
    const baseSize = calm ? 180 : 150;
    const intensitySize = gestureIntensity * 60;
    const finalSize = baseSize + intensitySize;

    return {
      width: `${finalSize}px`,
      height: `${finalSize}px`,
      borderRadius: '50%',
      filter: calm 
        ? 'brightness(1.3) drop-shadow(0 0 30px rgba(34, 197, 94, 0.8))'
        : gestureIntensity > 0.7
          ? 'brightness(1.5) drop-shadow(0 0 35px rgba(239, 68, 68, 0.9))'
          : 'drop-shadow(0 0 25px rgba(255, 107, 53, 0.7))',
      transform: `scale(${calm ? 1.2 : 1})`,
      transition: 'all 0.3s ease-out'
    };
  };

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #FF6B35 0%, #D32F2F 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 20 }}>
        <BackButton to="/selecionar" />
      </div>

      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 10,
        textAlign: 'center'
      }}>
        <div style={{
          background: 'linear-gradient(145deg, #DEB887, #CD853F)',
          padding: '15px 20px',
          borderRadius: '15px',
          border: '4px solid #8B4513',
          boxShadow: '0 8px 15px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.2)',
          fontFamily: '"Press Start 2P", monospace'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#4B2F00',
            marginBottom: '8px',
            textShadow: '1px 1px 0 rgba(255,255,255,0.3)'
          }}>
            🔥 Fogo
          </p>
          <p style={{
            fontSize: '16px',
            color: '#2C1810',
            marginBottom: '8px',
            textShadow: '1px 1px 0 rgba(255,255,255,0.3)'
          }}>
            {Math.ceil(timeRemaining)}s
          </p>
          <p style={{
            fontSize: '10px',
            color: '#1F4F2F',
            margin: 0,
            textShadow: '1px 1px 0 rgba(255,255,255,0.3)'
          }}>
            Progresso: {Math.round(currentProgress)}%
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'absolute',
          top: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 15
        }}
      >
        <div style={{
          background: 'linear-gradient(145deg, #DEB887, #CD853F)',
          padding: '20px 40px',
          borderRadius: '20px',
          border: '4px solid #8B4513',
          boxShadow: '0 12px 25px rgba(0,0,0,0.4), inset 0 3px 0 rgba(255,255,255,0.3)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            right: '8px',
            bottom: '8px',
            background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139,69,19,0.1) 2px, rgba(139,69,19,0.1) 4px)',
            borderRadius: '12px'
          }} />

          <h1 style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: gamePhase === 'completed' ? '14px' : '16px',
            color: '#4B2F00',
            textShadow: '2px 2px 0 rgba(255,255,255,0.4), 1px 1px 0 rgba(139,69,19,0.5)',
            margin: 0,
            lineHeight: '1.4',
            position: 'relative',
            zIndex: 1
          }}>
            {getInstructions()}
          </h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{
          position: 'relative',
          width: '750px',
          height: '500px',
          marginTop: '60px',
          backgroundImage: `url(${fireBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '20px',
          border: '5px solid #D32F2F',
          boxShadow: '0 15px 30px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.1)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
      >
        <motion.img
          src={fireGif}
          alt="Chama controlada"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: calm ? 1.4 : gestureIntensity > 0.7 ? 1.6 : 1.2
          }}
          transition={{ duration: 0.3 }}
          style={{
            ...getFlameStyle(),
            objectFit: 'contain',
            imageRendering: 'pixelated',
            cursor: 'pointer',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: calm
              ? 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)'
              : gestureIntensity > 0.7
                ? 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)'
                : 'transparent',
            borderRadius: '15px',
            transition: 'background 0.3s ease',
            pointerEvents: 'none'
          }}
        />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '350px',
          zIndex: 10
        }}
      >
        <div style={{
          background: 'linear-gradient(145deg, #DEB887, #CD853F)',
          padding: '20px',
          borderRadius: '20px',
          border: '4px solid #8B4513',
          boxShadow: '0 12px 25px rgba(0,0,0,0.4), inset 0 3px 0 rgba(255,255,255,0.3)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            right: '8px',
            bottom: '8px',
            background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139,69,19,0.1) 2px, rgba(139,69,19,0.1) 4px)',
            borderRadius: '12px'
          }} />

          <div style={{
            width: '100%',
            height: '20px',
            background: 'linear-gradient(145deg, #8B4513, #654321)',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '2px solid #4B2F00',
            position: 'relative',
            zIndex: 1
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #ff6b35, #ff8a00)',
                borderRadius: '8px',
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)'
              }}
            />
          </div>
          <p style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '12px',
            color: '#4B2F00',
            textShadow: '1px 1px 0 rgba(255,255,255,0.4)',
            textAlign: 'center',
            marginTop: '12px',
            marginBottom: '0',
            position: 'relative',
            zIndex: 1
          }}>
            Controle: {Math.round(currentProgress)}%
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 25,
              textAlign: 'center'
            }}
          >
            <div style={{
              background: 'linear-gradient(145deg, #FFB74D, #FF9800)',
              padding: '40px',
              borderRadius: '30px',
              border: '6px solid #F57C00',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 4px 0 rgba(255,255,255,0.4)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                right: '12px',
                bottom: '12px',
                background: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(245,124,0,0.1) 3px, rgba(245,124,0,0.1) 6px)',
                borderRadius: '20px'
              }} />

              <h2 style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '24px',
                color: '#BF360C',
                textShadow: '3px 3px 0 rgba(255,255,255,0.5), 2px 2px 0 rgba(245,124,0,0.7)',
                margin: '0 0 20px 0',
                position: 'relative',
                zIndex: 1
              }}>
                PARABÉNS! 🎉
              </h2>
              <p style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '12px',
                color: '#BF360C',
                textShadow: '1px 1px 0 rgba(255,255,255,0.5)',
                margin: 0,
                lineHeight: '1.5',
                position: 'relative',
                zIndex: 1
              }}>
                Você domou o fogo!<br/>
                Seu controle foi perfeito!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FireGame;
