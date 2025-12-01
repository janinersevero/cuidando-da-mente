import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../../../store/gameStore';
import BackButton from '../../../components/ui/BackButton';
import { playElementSound, playFeedbackSound } from '../../../utils/audioUtils';
import { detectHoldDuration } from '../../../utils/gestureUtils';
import flowerBackground from '../../../assets/figma/flower_background.jpg';
import seedsSprite from '../../../assets/figma/seeds.png';
import flowerSprite from '../../../assets/figma/flower.png';
import wateringCanSprite from '../../../assets/figma/watering_can.png';
import parchmentSprite from '../../../assets/figma/parchment.png';

const EarthGame = () => {
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
  const [holdStartTime, setHoldStartTime] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [gamePhase, setGamePhase] = useState('planting');
  const [showCelebration, setShowCelebration] = useState(false);
  const [plantStage, setPlantStage] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  useEffect(() => {
    startGame();
    playElementSound('earth');

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
    if (timeRemaining <= 0 && isGameActive && gamePhase !== 'completed') {
      endGame();
    }
  }, [timeRemaining, isGameActive, endGame, gamePhase]);

  const handleSuccessfulHold = useCallback(() => {
    setIsHolding(false);
    setHoldStartTime(null);
    setCalmState(true);
    incrementHits();
    playFeedbackSound(true);

    if (gamePhase === 'planting') {
      setPlantStage(0);
      setCurrentProgress(33);
      setGamePhase('watering');
    } else if (gamePhase === 'watering') {
      if (plantStage === 0) {
        setPlantStage(1);
        setCurrentProgress(66);
      } else if (plantStage === 1) {
        setPlantStage(2);
        setCurrentProgress(100);
        setGamePhase('completed');
        setShowCelebration(true);

        setTimeout(() => {
          setShowCelebration(false);
          endGame();
        }, 3000);
      }
    }

    setTimeout(() => {
      setCalmState(false);
    }, 1000);
  }, [gamePhase, plantStage, setCalmState, incrementHits, endGame]);

  const holdProgressRef = useRef(null);

  useEffect(() => {
    if (isHolding && holdStartTime) {
      holdProgressRef.current = setInterval(() => {
        const elapsed = Date.now() - holdStartTime;
        const progress = Math.min((elapsed / 3000) * 100, 100);
        setHoldProgress(progress);

        if (progress >= 100) {
          handleSuccessfulHold();
        }
      }, 50);
    } else {
      if (holdProgressRef.current) {
        clearInterval(holdProgressRef.current);
        holdProgressRef.current = null;
      }
      setHoldProgress(0);
    }

    return () => {
      if (holdProgressRef.current) {
        clearInterval(holdProgressRef.current);
      }
    };
  }, [isHolding, holdStartTime, handleSuccessfulHold]);

  const handleTouchStart = useCallback(() => {
    if (gamePhase === 'completed') return;

    const startTime = Date.now();
    setHoldStartTime(startTime);
    setIsHolding(true);
  }, [gamePhase]);

  const handleTouchEnd = useCallback(() => {
    if (!holdStartTime) return;
    
    const endTime = Date.now();
    const duration = detectHoldDuration(holdStartTime, endTime);
    
    setIsHolding(false);
    setHoldStartTime(null);
    setHoldProgress(0);
    
    if (duration < 3) {
      incrementMisses();
      playFeedbackSound(false);
      
      setCalmState(false);
      setTimeout(() => setCalmState(false), 200);
    }
  }, [holdStartTime, incrementMisses]);

  const getInstructions = () => {
    if (gamePhase === 'completed') {
      return "Parabéns, sua paciência fez florescer!";
    } else if (gamePhase === 'planting') {
      return "SEGURE por 3 segundos para plantar as sementes";
    } else if (gamePhase === 'watering' && plantStage === 0) {
      return "SEGURE por 3 segundos para regar e fazer brotar";
    } else if (gamePhase === 'watering' && plantStage === 1) {
      return "SEGURE por 3 segundos para regar e fazer florescer";
    }
    return "Tenha paciência e segure para cuidar da planta";
  };

  const getPlantDisplay = () => {
    if (plantStage === 0 && gamePhase === 'planting') {
      return (
        <motion.img
          src={seedsSprite}
          alt="Sementes para plantar"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            width: '120px',
            height: '120px',
            imageRendering: 'pixelated',
            filter: calm ? 'brightness(1.3) drop-shadow(0 0 15px rgba(34, 197, 94, 0.8))' : 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
          }}
        />
      );
    } else if (plantStage === 0 && gamePhase === 'watering') {
      return (
        <motion.img
          src={seedsSprite}
          alt="Sementes plantadas"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            width: '120px',
            height: '120px',
            imageRendering: 'pixelated',
            filter: calm ? 'brightness(1.3) drop-shadow(0 0 15px rgba(34, 197, 94, 0.8))' : 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
          }}
        />
      );
    } else if (plantStage === 1) {
      return (
        <motion.img
          src={seedsSprite}
          alt="Sementes brotando"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1.1 }}
          transition={{ duration: 0.8, type: "spring" }}
          style={{
            width: '130px',
            height: '130px',
            imageRendering: 'pixelated',
            filter: calm ? 'brightness(1.3) drop-shadow(0 0 15px rgba(34, 197, 94, 0.8))' : 'brightness(1.1) drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))'
          }}
        />
      );
    } else if (plantStage === 2) {
      return (
        <motion.img
          src={flowerSprite}
          alt="Flor florescida"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1.2 }}
          transition={{ duration: 1, type: "spring", bounce: 0.6 }}
          style={{
            width: '160px',
            height: '160px',
            imageRendering: 'pixelated',
            filter: 'brightness(1.2) drop-shadow(0 0 20px rgba(219, 39, 119, 0.6))'
          }}
        />
      );
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #a7f3d0 0%, #6ee7b7 100%)',
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
            🌱 Terra
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
            Estágio: {plantStage + 1}/3
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
          backgroundImage: `url(${flowerBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '20px',
          border: '5px solid #22c55e',
          boxShadow: '0 15px 30px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.1)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
      >
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 5
        }}>
          <img
            src={parchmentSprite}
            alt="Pergaminho de fundo"
            style={{
              width: '200px',
              height: '200px',
              imageRendering: 'pixelated',
              opacity: 0.8,
              filter: 'sepia(0.3) brightness(1.1)'
            }}
          />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          {getPlantDisplay()}
        </div>

        <AnimatePresence>
          {(isHolding && gamePhase === 'watering') && (
            <motion.img
              src={wateringCanSprite}
              alt="Regador"
              initial={{ opacity: 0, x: -120, y: -120, rotate: -45 }}
              animate={{
                opacity: 1,
                x: [40, 50, 45, 50],
                y: [-100, -90, -95, -90],
                rotate: [-20, -15, -25, -15]
              }}
              exit={{ opacity: 0, x: -120, y: -120, rotate: -45 }}
              transition={{
                duration: 3,
                x: { repeat: Infinity, duration: 0.6, ease: "easeInOut" },
                y: { repeat: Infinity, duration: 0.6, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 0.6, ease: "easeInOut" }
              }}
              style={{
                position: 'absolute',
                width: '100px',
                height: '100px',
                imageRendering: 'pixelated',
                zIndex: 10
              }}
            />
          )}
        </AnimatePresence>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: calm
              ? 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)'
              : 'transparent',
            borderRadius: '15px',
            transition: 'background 0.3s ease',
            pointerEvents: 'none'
          }}
        />
      </motion.div>

      {isHolding && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'absolute',
            bottom: '180px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '300px',
            zIndex: 15
          }}
        >
          <div style={{
            background: 'linear-gradient(145deg, #DEB887, #CD853F)',
            padding: '15px',
            borderRadius: '15px',
            border: '3px solid #8B4513',
            boxShadow: '0 8px 20px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.3)'
          }}>
            <div style={{
              width: '100%',
              height: '12px',
              background: 'linear-gradient(145deg, #8B4513, #654321)',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '2px solid #4B2F00'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${holdProgress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                  borderRadius: '4px'
                }}
              />
            </div>
            <p style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '8px',
              color: '#4B2F00',
              textAlign: 'center',
              marginTop: '8px',
              marginBottom: '0'
            }}>
              Continue segurando...
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        style={{
          position: 'absolute',
          bottom: plantStage === 2 ? '20px' : '60px',
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
                background: 'linear-gradient(90deg, #22c55e, #16a34a)',
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
            Crescimento: {Math.round(currentProgress)}%
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
                Sua paciência fez florescer!<br/>
                A planta cresceu linda!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EarthGame;
