import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/selecionar');
  };

  return (
    <div className="tablet-container" style={{ background: 'var(--pixel-bg)', minHeight: '100vh' }}>
      <div className="w-full text-center flex flex-col items-center justify-center h-full">
        {/* Logo/Título Pixel Art */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="pixel-card pixel-water p-8 mb-6">
            <h1 className="pixel-font pixel-font-large" style={{ color: 'white', textAlign: 'center' }}>
              CUIDANDO DA MENTE
            </h1>
            <p className="child-friendly-font mt-4" style={{ color: 'white', textAlign: 'center' }}>
              Jogos divertidos para relaxar e se sentir bem!
            </p>
          </div>
        </motion.div>

        {/* Emojis dos Elementos - LADO A LADO HORIZONTAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: '40px',
            flexDirection: 'row',
            flexWrap: 'nowrap'
          }}>
            <motion.span
              style={{ 
                fontSize: '120px',
                lineHeight: '1',
                display: 'inline-block'
              }}
              animate={{ 
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              🔥
            </motion.span>
            <motion.span
              style={{ 
                fontSize: '120px',
                lineHeight: '1',
                display: 'inline-block'
              }}
              animate={{ 
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5
              }}
            >
              💧
            </motion.span>
            <motion.span
              style={{ 
                fontSize: '120px',
                lineHeight: '1',
                display: 'inline-block'
              }}
              animate={{ 
                x: [0, 4, -4, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1
              }}
            >
              🌬️
            </motion.span>
            <motion.span
              style={{ 
                fontSize: '120px',
                lineHeight: '1',
                display: 'inline-block'
              }}
              animate={{ 
                y: [0, -4, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1.5
              }}
            >
              🌱
            </motion.span>
          </div>
        </motion.div>

        {/* Descrição Pixel Art */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <div className="pixel-card p-6" style={{ background: 'var(--pixel-bg-light)' }}>
            <p className="pixel-font pixel-font-small" style={{ color: 'var(--pixel-text)' }}>
              Explore os quatro elementos da natureza atraves de exercicios simples
              que ajudam a desenvolver foco, paciencia e autocontrole.
            </p>
          </div>
        </motion.div>

        {/* Botão Pixel Art */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-8"
        >
          <motion.button
            onClick={handleStart}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '2px 2px 0px rgba(0,0,0,0.3)'
            }}
            whileTap={{ 
              scale: 0.98,
              boxShadow: 'none',
              transform: 'translate(4px, 4px)'
            }}
            className="pixel-button pixel-fire pixel-font"
            style={{ 
              width: '100%',
              maxWidth: '400px',
              padding: '20px 40px',
              fontSize: '14px'
            }}
          >
            COMECAR JORNADA
          </motion.button>
        </motion.div>

        {/* Info Cards Pixel Art */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="tablet-grid-2 max-w-md mb-8"
        >
          <div className="pixel-card pixel-earth p-4">
            <div className="pixel-font pixel-font-small" style={{ color: 'var(--pixel-text-dark)' }}>
              <div className="font-bold">DURACAO</div>
              <div className="mt-2">2 min por elemento</div>
            </div>
          </div>
          <div className="pixel-card pixel-wind p-4">
            <div className="pixel-font pixel-font-small" style={{ color: 'var(--pixel-text-dark)' }}>
              <div className="font-bold">OBJETIVO</div>
              <div className="mt-2">Exercitar mindfulness</div>
            </div>
          </div>
        </motion.div>

        {/* Footer Pixel Art */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <p className="pixel-font pixel-font-small" style={{ color: 'var(--pixel-text)', opacity: 0.8 }}>
            Projeto desenvolvido para apoiar criancas com TDAH, ansiedade e depressao leve
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
