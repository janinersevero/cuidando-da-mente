import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/pixelButtons.css';
import backgroundHome from '../assets/figma/background_home.jpg';
import cloudsSprite from '../assets/figma/clouds.png';

const Home = () => {
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate('/selecionar');
  };

  const handleInstructions = () => {
    alert('Como jogar:\n\n🔥 Fogo: Movimente devagar para controlar\n💧 Água: Respire no ritmo 4-4\n🌬️ Vento: Gestos suaves e contínuos\n🌱 Terra: Pratique paciência');
  };

  const handleAbout = () => {
    alert('Cuidando da Mente\n\nJogo desenvolvido para ajudar crianças com TDAH, ansiedade e depressão leve a praticar exercícios de mindfulness através dos 4 elementos da natureza.');
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
      <motion.img
        src={cloudsSprite}
        alt="Nuvem 1"
        style={{
          position: 'absolute',
          top: '4%',
          left: '6%',
          width: '300px',
          height: '200px',
          objectFit: 'contain',
          imageRendering: 'pixelated',
          zIndex: 1,
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          margin: 0,
          padding: 0
        }}
        animate={{
          x: [0, 35, 0],
          y: [0, -18, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.img
        src={cloudsSprite}
        alt="Nuvem 2"
        style={{
          position: 'absolute',
          top: '10%',
          right: '8%',
          width: '270px',
          height: '180px',
          objectFit: 'contain',
          imageRendering: 'pixelated',
          zIndex: 1,
          transform: 'scaleX(-1)',
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          margin: 0,
          padding: 0
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, 15, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <motion.img
        src={cloudsSprite}
        alt="Nuvem 3"
        style={{
          position: 'absolute',
          top: '1%',
          right: '2%',
          width: '240px',
          height: '160px',
          objectFit: 'contain',
          imageRendering: 'pixelated',
          zIndex: 1,
          opacity: 0.95,
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          margin: 0,
          padding: 0
        }}
        animate={{
          x: [0, 25, 0],
          y: [0, -12, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />

      <div className="figma-home-container">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="figma-title"
        >
          Cuidando da Mente
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="figma-buttons-container"
        >
          <motion.button
            className="figma-scroll-button"
            onClick={handleInstructions}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            COMO JOGAR
          </motion.button>

          <motion.button
            className="figma-scroll-button"
            onClick={handlePlay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{
              background: 'linear-gradient(145deg, #90EE90, #32CD32)',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            JOGAR
          </motion.button>

          <motion.button
            className="figma-scroll-button"
            onClick={handleAbout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            SOBRE
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{
            position: 'absolute',
            bottom: '120px',
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
            maxWidth: '400px',
            lineHeight: '1.6'
          }}>
            Exercicios de mindfulness para criancas
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
