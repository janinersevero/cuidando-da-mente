import React from 'react';

const ProgressCircle = ({ value, size = 120, strokeWidth = 8, calm = false }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const centerX = size / 2;
  const centerY = size / 2;

  const progressColor = calm ? '#22c55e' : '#ef4444';
  const backgroundColor = '#e5e7eb';

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />

        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-gray-700 text-lg font-bold transform rotate-90"
          style={{ fontSize: '16px' }}
        >
          {Math.round(value)}%
        </text>
      </svg>
    </div>
  );
};

export default ProgressCircle;
