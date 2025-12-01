import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../../../store/gameStore';
import BackButton from '../../../components/ui/BackButton';
import { playElementSound, playFeedbackSound } from '../../../utils/audioUtils';
import riverBackground from '../../../assets/figma/river_background.jpg';
import leafSprite from '../../../assets/figma/leaf.png';

const WaterGame = () => {
  const {
    calm,
    isGameActive,
    timeRemaining,
    updateProgress,
    setCalmState,
    incrementHits,
    startGame,
    endGame,
    updateTimeRemaining
  } = useGameStore();

  const intervalRef = useRef(null);
  const totalLeaves = 12;

  const [leaves, setLeaves] = useState(() => {
    const initialLeaves = [];
    for (let i = 0; i < totalLeaves; i++) {
      initialLeaves.push({
        id: i,
        initialX: 150 + Math.random() * 450,
        x: 150 + Math.random() * 450,
        initialY: 100 + Math.random() * 300,
        y: 100 + Math.random() * 300,
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.4,
        removed: false,
        isFloating: true,
        driftSpeed: 0.3 + Math.random() * 0.5,
        floatOffset: Math.random() * 2 * Math.PI
      });
    }
    return initialLeaves;
  });
  const [removedLeaves, setRemovedLeaves] = useState(0);
  const [gamePhase, setGamePhase] = useState('playing');
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    startGame();
    playElementSound('water');

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
    if (!isGameActive || gamePhase !== 'playing') return;

    const moveInterval = setInterval(() => {
      setLeaves(prevLeaves =>
        prevLeaves.map(leaf => {
          if (leaf.removed) return leaf;

          let newX = leaf.x + leaf.driftSpeed;

          if (newX > 700) {
            newX = 50;
          }

          const timeOffset = Date.now() * 0.001 + leaf.floatOffset;
          const verticalDrift = Math.sin(timeOffset * leaf.driftSpeed) * 10;

          return {
            ...leaf,
            x: newX,
            y: leaf.initialY + verticalDrift,
            rotation: leaf.rotation + Math.sin(timeOffset) * 5
          };
        })
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [isGameActive, gamePhase]);

  useEffect(() => {
    if (timeRemaining <= 0 && isGameActive && gamePhase === 'playing') {
      endGame();
    }
  }, [timeRemaining, isGameActive, endGame, gamePhase]);

  const handleLeafClick = useCallback((leafId) => {
    if (gamePhase !== 'playing') return;

    setLeaves(prevLeaves =>
      prevLeaves.map(leaf =>
        leaf.id === leafId ? { ...leaf, removed: true } : leaf
      )
    );

    const newRemovedCount = removedLeaves + 1;
    setRemovedLeaves(newRemovedCount);
    incrementHits();
    updateProgress(100 / totalLeaves);
    setCalmState(true);
    playFeedbackSound(true);

    if (newRemovedCount >= totalLeaves) {
      setGamePhase('completed');
      setShowCelebration(true);

      setTimeout(() => {
        setShowCelebration(false);
        endGame();
      }, 3000);
    }

    setTimeout(() => setCalmState(false), 500);
  }, [gamePhase, removedLeaves, incrementHits, updateProgress, setCalmState, totalLeaves, endGame]);

  const getInstructions = () => {
    if (gamePhase === 'completed') {
      return "Parabéns, sua tranquilidade tirou todas as folhas!";
    }
    return "Com calma, remova as folhas do rio";
  };

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #87CEEB 0%, #4682B4 100%)',
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
            💧 Água
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
            {removedLeaves}/{totalLeaves} folhas
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
          backgroundImage: `url(${riverBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '20px',
          border: '5px solid #4682B4',
          boxShadow: '0 15px 30px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.1)',
          overflow: 'hidden'
        }}
      >
        {leaves.map((leaf) => (
          !leaf.removed && (
            <img
              key={leaf.id}
              src={leafSprite}
              alt={`Folha ${leaf.id + 1}`}
              onClick={() => handleLeafClick(leaf.id)}
              style={{
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: '50px',
                height: '50px',
                cursor: 'pointer',
                zIndex: 5,
                imageRendering: 'pixelated',
                filter: calm ? 'brightness(1.3) drop-shadow(0 0 15px rgba(34, 197, 94, 0.8))' : 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                transform: `translate(${leaf.x}px, ${leaf.y}px) rotate(${leaf.rotation}deg) scale(${leaf.scale})`,
                transition: 'transform 0.1s ease-out',
                opacity: 1
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = `translate(${leaf.x}px, ${leaf.y}px) rotate(${leaf.rotation + 20}deg) scale(${leaf.scale * 1.2})`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = `translate(${leaf.x}px, ${leaf.y}px) rotate(${leaf.rotation}deg) scale(${leaf.scale})`;
              }}
            />
          )
        ))}
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
              animate={{ width: `${(removedLeaves / totalLeaves) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
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
            Progresso: {Math.round((removedLeaves / totalLeaves) * 100)}%
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
              background: 'linear-gradient(145deg, #90EE90, #32CD32)',
              padding: '40px',
              borderRadius: '30px',
              border: '6px solid #228B22',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 4px 0 rgba(255,255,255,0.4)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                right: '12px',
                bottom: '12px',
                background: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(34,139,34,0.1) 3px, rgba(34,139,34,0.1) 6px)',
                borderRadius: '20px'
              }} />

              <h2 style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '24px',
                color: '#0F4F0F',
                textShadow: '3px 3px 0 rgba(255,255,255,0.5), 2px 2px 0 rgba(34,139,34,0.7)',
                margin: '0 0 20px 0',
                position: 'relative',
                zIndex: 1
              }}>
                PARABÉNS! 🎉
              </h2>
              <p style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '12px',
                color: '#0F4F0F',
                textShadow: '1px 1px 0 rgba(255,255,255,0.5)',
                margin: 0,
                lineHeight: '1.5',
                position: 'relative',
                zIndex: 1
              }}>
                Você limpou todo o rio!<br/>
                Sua tranquilidade foi perfeita!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WaterGame;
