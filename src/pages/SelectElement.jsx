import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ElementCard from '../components/ui/ElementCard';
import BackButton from '../components/ui/BackButton';
import useGameStore from '../store/gameStore';

const SelectElement = () => {
  const navigate = useNavigate();
  const { setElement, resetGame } = useGameStore();

  const elements = [
    {
      id: 'fire',
      title: 'Fogo',
      description: 'Controle seus movimentos com gestos suaves',
      route: '/jogo/fogo'
    },
    {
      id: 'water',
      title: 'Água',
      description: 'Pratique respiração 4-4 com ritmo controlado',
      route: '/jogo/agua'
    },
    {
      id: 'wind',
      title: 'Vento',
      description: 'Movimentos contínuos e suaves como a brisa',
      route: '/jogo/vento'
    },
    {
      id: 'earth',
      title: 'Terra',
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
    <div className="tablet-container" style={{ background: 'var(--pixel-bg)', minHeight: '100vh' }}>
      <div className="w-full">
        {/* Header Simples - SEM posição fixa */}
        <div className="flex items-center justify-between p-4 mb-6">
          <BackButton to="/" />
          <h1 className="pixel-font pixel-font-large" style={{ color: 'var(--pixel-text)' }}>
            ESCOLHA SEU ELEMENTO
          </h1>
          <div className="w-20"></div>
        </div>

        <div className="px-4">
          {/* Descrição Pixel Art */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="pixel-card p-6" style={{ background: 'var(--pixel-bg-light)' }}>
              <p className="pixel-font pixel-font-small" style={{ color: 'var(--pixel-text)' }}>
                Cada elemento oferece um tipo diferente de exercicio de mindfulness.
                Escolha o que mais desperta sua curiosidade hoje!
              </p>
            </div>
          </motion.div>

          {/* Grid de elementos */}
          <div className="tablet-grid mb-8">
            {elements.map((element, index) => (
              <motion.div
                key={element.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1 
                }}
              >
                <ElementCard
                  element={element.id}
                  title={element.title}
                  description={element.description}
                  onClick={() => handleElementSelect(element)}
                />
              </motion.div>
            ))}
          </div>


          {/* Dicas Pixel Art */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="pixel-card pixel-earth p-4">
              <div className="pixel-font pixel-font-small" style={{ color: 'var(--pixel-text-dark)' }}>
                <div className="font-bold mb-2">DICA:</div>
                <div>Cada sessao dura 2 minutos. Encontre um local tranquilo e relaxe antes de comecar.</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SelectElement;
