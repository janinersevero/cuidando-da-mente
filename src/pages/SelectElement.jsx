import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '../components/ui/BackButton';
import useGameStore from '../store/gameStore';
import backgroundHome from '../assets/figma/background_home.jpg';
import parchmentSprite from '../assets/figma/parchment.png';
import fireSprite from '../assets/figma/fire.png';
import waterSprite from '../assets/figma/water.png';
import windSprite from '../assets/figma/wind.png';
import earthSprite from '../assets/figma/earth.png';

const SelectElement = () => {
  const navigate = useNavigate();
  const { setElement, resetGame } = useGameStore();

  const elements = [
    {
      id: 'fire',
      title: 'Fogo',
      sprite: fireSprite,
      description: 'Controle seus movimentos com gestos suaves',
      route: '/jogo/fogo'
    },
    {
      id: 'water',
      title: 'Água',
      sprite: waterSprite,
      description: 'Pratique respiração 4-4 com ritmo controlado',
      route: '/jogo/agua'
    },
    {
      id: 'wind',
      title: 'Vento',
      sprite: windSprite,
      description: 'Movimentos contínuos e suaves como a brisa',
      route: '/jogo/vento'
    },
    {
      id: 'earth',
      title: 'Terra',
      sprite: earthSprite,
      description: 'Desenvolva paciência e foco sustentado',
      route: '/jogo/terra'
    }
  ];

  const handleElementSelect = (element) => {
    resetGame();
    setElement(element.id);
    navigate(element.route);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundHome})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 10
      }}>
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '36px',
            color: '#8B4513',
            textShadow:
              '-2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff, ' +
              '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, ' +
              '3px 3px 0 #654321, 5px 5px 0 rgba(0,0,0,0.4)',
            marginBottom: '20px',
            letterSpacing: '2px'
          }}
        >
          Escolha um elemento!
        </motion.h1>
      </div>

      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 20 }}>
        <BackButton to="/" />
      </div>

      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -20%)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '60px',
        width: '85%',
        maxWidth: '1000px'
      }}>
        {elements.map((element, index) => (
          <motion.div
            key={element.id}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: "easeOut"
            }}
            whileHover={{ scale: 1.08, y: -8 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleElementSelect(element)}
            style={{
              position: 'relative',
              cursor: 'pointer',
              width: '200px',
              height: '200px'
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundImage: `url(${parchmentSprite})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                imageRendering: 'pixelated'
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120px',
                height: '120px',
                backgroundImage: `url(${element.sprite})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                imageRendering: 'pixelated'
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: '15px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '14px',
                color: '#654321',
                textAlign: 'center',
                textShadow: '1px 1px 0 rgba(255,255,255,0.8)'
              }}
            >
              {element.title}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center'
        }}
      >
        <p style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '10px',
          color: '#654321',
          textShadow: '1px 1px 0 rgba(255,255,255,0.7)',
          maxWidth: '500px',
          lineHeight: '1.6'
        }}>
          Cada exercicio ajuda a desenvolver diferentes habilidades de mindfulness
        </p>
      </motion.div>
    </div>
  );
};

export default SelectElement;
