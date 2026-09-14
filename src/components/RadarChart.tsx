import React from 'react';
import { SkillData } from '../types';

interface RadarChartProps {
  skills: SkillData[];
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ skills, size = 320 }) => {
  const center = size / 2;
  const radius = (size / 2) - 45;
  const numAxes = skills.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Concentric polygon levels (25, 50, 75, 100)
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (index: number, valueRatio: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const x = center + radius * valueRatio * Math.cos(angle);
    const y = center + radius * valueRatio * Math.sin(angle);
    return { x, y };
  };

  // Generate data polygon points
  const points = skills.map((skill, index) => {
    const coords = getCoordinates(index, skill.score / 100);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  return (
    <div className="radar-chart-container" aria-label="Skill Radar Chart">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Grid Concentric Polygons */}
        {levels.map((level) => {
          const levelPoints = skills.map((_, index) => {
            const coords = getCoordinates(index, level);
            return `${coords.x},${coords.y}`;
          }).join(' ');
          return (
            <polygon
              key={level}
              points={levelPoints}
              fill="none"
              stroke="var(--border-subtle)"
              strokeWidth="1"
            />
          );
        })}

        {/* Radial Axis Lines */}
        {skills.map((_, index) => {
          const coords = getCoordinates(index, 1.0);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={coords.x}
              y2={coords.y}
              stroke="var(--border-subtle)"
              strokeWidth="1"
            />
          );
        })}

        {/* Filled Student Skill Polygon */}
        <polygon
          points={points}
          fill="rgba(79, 70, 229, 0.12)"
          stroke="var(--accent-indigo)"
          strokeWidth="2"
        />

        {/* Data Points */}
        {skills.map((skill, index) => {
          const coords = getCoordinates(index, skill.score / 100);
          return (
            <circle
              key={skill.id}
              cx={coords.x}
              cy={coords.y}
              r="3.5"
              fill="var(--accent-indigo)"
              stroke="var(--bg-surface)"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Labels */}
        {skills.map((skill, index) => {
          const labelCoords = getCoordinates(index, 1.2);
          return (
            <text
              key={`label-${skill.id}`}
              x={labelCoords.x}
              y={labelCoords.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fontWeight="600"
              fill="var(--text-secondary)"
            >
              {skill.name.split(' ')[0]} ({skill.score})
            </text>
          );
        })}
      </svg>

      <style>{`
        .radar-chart-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: var(--space-2);
        }
      `}</style>
    </div>
  );
};
