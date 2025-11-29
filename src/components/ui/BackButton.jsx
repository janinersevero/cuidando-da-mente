import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BackButton = ({ to = '/' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '2px 2px 0px rgba(0,0,0,0.3)'
      }}
      whileTap={{ 
        scale: 0.98,
        boxShadow: 'none',
        transform: 'translate(4px, 4px)'
      }}
      className="pixel-button pixel-font pixel-font-small"
      style={{ 
        padding: '12px 16px',
        minWidth: '120px'
      }}
      aria-label="Voltar"
    >
      &lt; VOLTAR
    </motion.button>
  );
};

export default BackButton;
