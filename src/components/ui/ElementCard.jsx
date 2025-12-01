import React from 'react';
import { motion } from 'framer-motion';

const ElementCard = ({ element, title, description, onClick, disabled = false }) => {
  const getElementEmoji = (element) => {
    switch (element) {
      case 'fire':
        return '🔥';
      case 'water':
        return '💧';
      case 'wind':
        return '🌬️';
      case 'earth':
        return '🌱';
      default:
        return '🔥';
    }
  };

  const getPixelClass = (element) => {
    const classes = {
      fire: 'pixel-fire',
      water: 'pixel-water',
      wind: 'pixel-wind',
      earth: 'pixel-earth'
    };
    return classes[element] || 'pixel-fire';
  };

  const getElementColors = (element) => {
    switch (element) {
      case 'fire':
        return { primary: '#FF6B6B', secondary: '#FFE66D' };
      case 'water':
        return { primary: '#4ECDC4', secondary: '#45B7D1' };
      case 'wind':
        return { primary: '#A8E6CF', secondary: '#C7CEEA' };
      case 'earth':
        return { primary: '#98D8C8', secondary: '#FDCB6E' };
      default:
        return { primary: '#FF6B6B', secondary: '#FFE66D' };
    }
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? {
        scale: 1.05,
        y: -5
      } : {}}
      whileTap={!disabled ? {
        scale: 0.95
      } : {}}
      className={`
        w-full h-full
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${getPixelClass(element)} p-8
        flex flex-col items-center justify-center space-y-6
        rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200
      `}
      style={{
        border: 'none',
        minHeight: '300px',
        background: `linear-gradient(135deg, ${getElementColors(element).primary}, ${getElementColors(element).secondary})`
      }}
    >
      <div style={{ fontSize: '120px', margin: '20px 0' }}>
        {getElementEmoji(element)}
      </div>

      <h3 className="child-friendly-font child-friendly-font-large" style={{ color: 'white', textAlign: 'center', margin: '16px 0' }}>
        {title}
      </h3>

      <p className="child-friendly-font text-center" style={{ color: 'white', opacity: 0.9, margin: '8px 0' }}>
        {description}
      </p>

    </motion.button>
  );
};

export default ElementCard;
