import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../../../store/gameStore';
import BackButton from '../../../components/ui/BackButton';
import { playElementSound, playFeedbackSound } from '../../../utils/audioUtils';
import windBackground from '../../../assets/figma/wind_background.jpg';
import bubbleSprite from '../../../assets/figma/bubble.png';

const WindGame = () => {
  const {
    calm,
    isGameActive,
    timeRemaining,
    setCalmState,
    incrementHits,
    incrementMisses,
    startGame,
    endGame,
    updateTimeRemaining
  } = useGameStore();

  const intervalRef = useRef(null);
  const [bubbles, setBubbles] = useState([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [bubblesPopped, setBubblesPopped] = useState(0);
  const [targetBubbles] = useState(15);

  useEffect(() => {
    startGame();
    playElementSound('wind');

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
    if (timeRemaining <= 0 && isGameActive) {
      endGame();
    }
  }, [timeRemaining, isGameActive, endGame]);

  useEffect(() => {
    if (!isGameActive) return;

    const createBubble = () => {
      const randomId = Math.random();
      const randomX = Math.random() * 650;
      const randomSize = 50 + Math.random() * 60;
      const randomSpeed = 1 + Math.random() * 2;
      const randomOpacity = 0.7 + Math.random() * 0.3;
      const randomHue = Math.random() * 60;
      const randomBrightness = 0.8 + Math.random() * 0.4;

      const newBubble = {
        id: randomId,
        x: randomX,
        y: 500,
        size: randomSize,
        speed: randomSpeed,
        opacity: randomOpacity,
        hue: randomHue,
        brightness: randomBrightness
      };

      setBubbles(prev => [...prev, newBubble]);
    };

    const bubbleInterval = setInterval(createBubble, 800);

    return () => clearInterval(bubbleInterval);
  }, [isGameActive]);

  useEffect(() => {
    if (!isGameActive) return;

    const moveInterval = setInterval(() => {
      setBubbles(prev => prev
        .map(bubble => ({
          ...bubble,
          y: bubble.y - bubble.speed,
          x: bubble.x + Math.sin(bubble.y * 0.01) * 0.5
        }))
        .filter(bubble => bubble.y > -100)
      );
    }, 16);

    return () => clearInterval(moveInterval);
  }, [isGameActive]);

  useEffect(() => {
    if (bubblesPopped >= targetBubbles) {
      setCurrentProgress(100);
      setShowCelebration(true);

      setTimeout(() => {
        endGame();
      }, 3000);
    } else {
      setCurrentProgress((bubblesPopped / targetBubbles) * 100);
    }
  }, [bubblesPopped, targetBubbles, endGame]);

  const handleBubbleClick = useCallback((bubbleId) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== bubbleId));

    setBubblesPopped(prev => prev + 1);
    incrementHits();
    playFeedbackSound(true);

    setCalmState(true);
    setTimeout(() => setCalmState(false), 300);
  }, [incrementHits, setCalmState]);

  const handleMissClick = useCallback(() => {
    incrementMisses();
    playFeedbackSound(false);
  }, [incrementMisses]);

  const getInstructions = () => {
    if (showCelebration) {
      return "Parabéns! Você estourou todas as bolhas!";
    } else if (bubblesPopped >= targetBubbles * 0.8) {
      return "Quase lá! Continue estourando as bolhas!";
    } else {
      return "Com foco, estoure as bolhas de ar!";
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #87ceeb 0%, #98d8e8 100%)',
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
            🌬️ Vento
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
            Bolhas: {bubblesPopped}/{targetBubbles}
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
            fontSize: showCelebration ? '14px' : '16px',
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
          backgroundImage: `url(${windBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '20px',
          border: '5px solid #87ceeb',
          boxShadow: '0 15px 30px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.1)',
          overflow: 'hidden',
          cursor: 'crosshair'
        }}
        onClick={handleMissClick}
      >
        <AnimatePresence>
          {bubbles.map(bubble => (
            <motion.div
              key={bubble.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: bubble.opacity,
                scale: 1,
                x: bubble.x,
                y: bubble.y
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                cursor: 'pointer',
                zIndex: 10
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleBubbleClick(bubble.id);
              }}
            >
              <img
                src={bubbleSprite}
                alt="Bolha"
                style={{
                  width: '100%',
                  height: '100%',
                  imageRendering: 'pixelated',
                  filter: `hue-rotate(${bubble.hue}deg) brightness(${bubble.brightness})`,
                  transition: 'transform 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: calm
              ? 'radial-gradient(circle, rgba(135, 206, 235, 0.3) 0%, transparent 70%)'
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
                background: 'linear-gradient(90deg, #87ceeb, #4682b4)',
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
            Progresso: {Math.round(currentProgress)}%
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
              background: 'linear-gradient(145deg, #87ceeb, #4682b4)',
              padding: '40px',
              borderRadius: '30px',
              border: '6px solid #4169e1',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 4px 0 rgba(255,255,255,0.4)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                right: '12px',
                bottom: '12px',
                background: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(65,105,225,0.1) 3px, rgba(65,105,225,0.1) 6px)',
                borderRadius: '20px'
              }} />

              <h2 style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '24px',
                color: '#ffffff',
                textShadow: '3px 3px 0 rgba(65,105,225,0.8), 2px 2px 0 rgba(70,130,180,0.7)',
                margin: '0 0 20px 0',
                position: 'relative',
                zIndex: 1
              }}>
                PARABÉNS! 🎉
              </h2>
              <p style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '12px',
                color: '#ffffff',
                textShadow: '1px 1px 0 rgba(65,105,225,0.8)',
                margin: 0,
                lineHeight: '1.5',
                position: 'relative',
                zIndex: 1
              }}>
                Seu foco estourou todas as bolhas!<br/>
                Concentração perfeita!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WindGame;
