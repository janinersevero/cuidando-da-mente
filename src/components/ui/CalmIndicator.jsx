import React from 'react';

const CalmIndicator = ({ calm, intensity = 0 }) => {
  const getIndicatorColor = () => {
    if (calm) {
      return 'bg-green-500';
    } else if (intensity > 0.7) {
      return 'bg-red-500';
    } else if (intensity > 0.4) {
      return 'bg-yellow-500';
    } else {
      return 'bg-gray-400';
    }
  };

  const getIndicatorText = () => {
    if (calm) {
      return 'Calmo';
    } else if (intensity > 0.7) {
      return 'Muito Intenso';
    } else if (intensity > 0.4) {
      return 'Moderado';
    } else {
      return 'Começando';
    }
  };

  const getPulseClass = () => {
    if (calm) {
      return 'animate-pulse';
    } else if (intensity > 0.7) {
      return 'animate-bounce';
    } else {
      return '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${getIndicatorColor()} ${getPulseClass()}`}
      >
        <div className={`w-8 h-8 rounded-full bg-white/30 ${calm ? 'animate-pulse' : ''}`} />
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">
          {getIndicatorText()}
        </p>

        {intensity > 0 && (
          <div className="mt-1">
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getIndicatorColor()}`}
                style={{ width: `${Math.min(intensity * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalmIndicator;
