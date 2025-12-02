import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

const Results = () => {
  const navigate = useNavigate();
  const {
    element,
    hits,
    misses,
    progress,
    getSuccessRate,
    getTimeElapsed,
    resetGame
  } = useGameStore();

  const successRate = getSuccessRate();
  const timeElapsed = getTimeElapsed();

  const getElementInfo = () => {
    const elements = {
      fire: { name: 'Fogo', emoji: '🔥', color: 'from-red-400 to-orange-500' },
      water: { name: 'Água', emoji: '💧', color: 'from-blue-400 to-cyan-500' },
      wind: { name: 'Vento', emoji: '🌬️', color: 'from-cyan-400 to-blue-500' },
      earth: { name: 'Terra', emoji: '🌱', color: 'from-green-400 to-emerald-500' }
    };
    return elements[element] || { name: 'Desconhecido', emoji: '❓', color: 'from-gray-400 to-gray-500' };
  };

  const elementInfo = getElementInfo();

  const getPerformanceMessage = () => {
    if (successRate >= 80) {
      return {
        title: 'Excelente! 🌟',
        message: 'Você demonstrou grande controle e foco. Continue assim!',
        color: 'text-green-600'
      };
    } else if (successRate >= 60) {
      return {
        title: 'Muito Bem! 👏',
        message: 'Você está no caminho certo. A prática leva à perfeição.',
        color: 'text-blue-600'
      };
    } else if (successRate >= 40) {
      return {
        title: 'Bom Esforço! 💪',
        message: 'Cada tentativa é um aprendizado. Continue praticando!',
        color: 'text-yellow-600'
      };
    } else {
      return {
        title: 'Continue Tentando! 🎯',
        message: 'A jornada do mindfulness é gradual. Você vai melhorar!',
        color: 'text-purple-600'
      };
    }
  };

  const performance = getPerformanceMessage();

  const handleTryAgain = () => {
    resetGame();
    navigate(-1);
  };

  const handleChooseAnother = () => {
    resetGame();
    navigate('/selecionar');
  };

  const handleGoHome = () => {
    resetGame();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-6">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className={`bg-gradient-to-r ${elementInfo.color} text-white rounded-2xl p-6 shadow-lg`}>
            <div className="text-6xl mb-2">{elementInfo.emoji}</div>
            <h1 className="text-2xl font-bold">Sessão Completa!</h1>
            <p className="text-lg opacity-90">{elementInfo.name}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className={`text-xl font-bold mb-2 ${performance.color}`}>
              {performance.title}
            </h2>
            <p className="text-gray-700">{performance.message}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {Math.round(progress)}%
            </div>
            <div className="text-sm text-gray-600">Progresso</div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {Math.round(successRate)}%
            </div>
            <div className="text-sm text-gray-600">Precisão</div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              {hits}
            </div>
            <div className="text-sm text-gray-600">Acertos</div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {Math.round(timeElapsed)}s
            </div>
            <div className="text-sm text-gray-600">Tempo</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">
              🏆 Conquistas desta Sessão
            </h3>
            <div className="space-y-2">
              {hits > 10 && (
                <div className="flex items-center space-x-2 text-sm">
                  <span>⭐</span>
                  <span>Mais de 10 acertos!</span>
                </div>
              )}
              {successRate >= 70 && (
                <div className="flex items-center space-x-2 text-sm">
                  <span>🎯</span>
                  <span>Alta precisão alcançada!</span>
                </div>
              )}
              {progress >= 80 && (
                <div className="flex items-center space-x-2 text-sm">
                  <span>🚀</span>
                  <span>Excelente progresso!</span>
                </div>
              )}
              {timeElapsed >= 110 && (
                <div className="flex items-center space-x-2 text-sm">
                  <span>⏰</span>
                  <span>Sessão quase completa!</span>
                </div>
              )}
              {hits === 0 && misses === 0 && (
                <div className="flex items-center space-x-2 text-sm">
                  <span>🌱</span>
                  <span>Primeiro passo dado!</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-3"
        >
          <button
            onClick={handleTryAgain}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            🔄 Tentar Novamente
          </button>

          <button
            onClick={handleChooseAnother}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            🌟 Escolher Outro Elemento
          </button>

          <button
            onClick={handleGoHome}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            🏠 Voltar ao Início
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-6 text-center"
        >
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Dica:</strong> Pratique regularmente para melhores resultados.
              Cada elemento trabalha diferentes aspectos do mindfulness.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
