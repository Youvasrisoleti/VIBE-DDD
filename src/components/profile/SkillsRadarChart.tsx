import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface SkillsRadarChartProps {
  skills: Array<{
    name: string;
    value: number;
  }>;
}

const SkillsRadarChart: React.FC<SkillsRadarChartProps> = ({ skills }) => {
  const { darkMode } = useTheme();
  
  // Calculate points for radar chart
  const numberOfSkills = skills.length;
  const angleSlice = (Math.PI * 2) / numberOfSkills;
  const radius = 120;
  const center = { x: 150, y: 150 };
  
  // Calculate points for each skill level
  const calculatePoint = (value: number, i: number) => {
    const angle = angleSlice * i - Math.PI / 2;
    const adjustedValue = value / 100;
    return {
      x: center.x + radius * adjustedValue * Math.cos(angle),
      y: center.y + radius * adjustedValue * Math.sin(angle),
    };
  };
  
  // Calculate points for grid
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];
  const gridPoints = gridLevels.map(level => {
    return Array.from({ length: numberOfSkills }, (_, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      return {
        x: center.x + radius * level * Math.cos(angle),
        y: center.y + radius * level * Math.sin(angle),
      };
    });
  });
  
  // Calculate skill points
  const skillPoints = skills.map((skill, i) => calculatePoint(skill.value, i));
  
  // Create polygon points string
  const polygonPoints = skillPoints.map(point => `${point.x},${point.y}`).join(' ');
  
  return (
    <div className="flex justify-center">
      <svg width="300" height="300" viewBox="0 0 300 300">
        {/* Grid */}
        {gridLevels.map((level, levelIndex) => (
          <polygon
            key={`grid-${levelIndex}`}
            points={gridPoints[levelIndex].map(point => `${point.x},${point.y}`).join(' ')}
            fill="none"
            stroke={darkMode ? '#374151' : '#e5e7eb'}
            strokeWidth="1"
          />
        ))}
        
        {/* Axes */}
        {skills.map((_, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const point = {
            x: center.x + radius * Math.cos(angle),
            y: center.y + radius * Math.sin(angle),
          };
          return (
            <line
              key={`axis-${i}`}
              x1={center.x}
              y1={center.y}
              x2={point.x}
              y2={point.y}
              stroke={darkMode ? '#374151' : '#e5e7eb'}
              strokeWidth="1"
            />
          );
        })}
        
        {/* Skill polygon */}
        <polygon
          points={polygonPoints}
          fill={darkMode ? 'rgba(79, 70, 229, 0.2)' : 'rgba(79, 70, 229, 0.1)'}
          stroke="#4F46E5"
          strokeWidth="2"
        />
        
        {/* Skill points */}
        {skillPoints.map((point, i) => (
          <circle
            key={`point-${i}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#4F46E5"
          />
        ))}
        
        {/* Skill labels */}
        {skills.map((skill, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const labelRadius = radius + 20;
          const point = {
            x: center.x + labelRadius * Math.cos(angle),
            y: center.y + labelRadius * Math.sin(angle),
          };
          
          // Adjust text anchor based on position
          let textAnchor = 'middle';
          if (angle < -Math.PI * 0.25 || angle > Math.PI * 0.75) textAnchor = 'end';
          else if (angle > -Math.PI * 0.25 && angle < Math.PI * 0.25) textAnchor = 'start';
          
          return (
            <text
              key={`label-${i}`}
              x={point.x}
              y={point.y}
              textAnchor={textAnchor}
              alignmentBaseline="middle"
              fontSize="12"
              fill={darkMode ? '#e5e7eb' : '#4b5563'}
            >
              {skill.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default SkillsRadarChart;