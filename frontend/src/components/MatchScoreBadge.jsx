import React from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, XCircle } from 'lucide-react';

export default function MatchScoreBadge({ score, matchedCount, totalCount, size = 'md', onClick }) {
  if (score === undefined || score === null) return null;

  const numScore = Number(score);
  let tierLabel = 'Low Match';
  let progressColor = '#ef4444'; // Red
  let bgColor = 'rgba(239, 68, 68, 0.16)';
  let borderColor = 'rgba(239, 68, 68, 0.45)';
  let icon = <XCircle size={14} className="text-red-400" />;

  if (numScore >= 70) {
    tierLabel = 'Strong Match';
    progressColor = '#10b981'; // Green
    bgColor = 'rgba(16, 185, 129, 0.16)';
    borderColor = 'rgba(16, 185, 129, 0.45)';
    icon = <CheckCircle2 size={14} className="text-emerald-400" />;
  } else if (numScore >= 50) {
    tierLabel = 'Good Match';
    progressColor = '#f59e0b'; // Amber
    bgColor = 'rgba(245, 158, 11, 0.16)';
    borderColor = 'rgba(245, 158, 11, 0.45)';
    icon = <AlertTriangle size={14} className="text-amber-400" />;
  }

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all ${
        onClick ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : ''
      }`}
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
      title={onClick ? "Click to view transparent skill match calculation" : ""}
    >
      {/* Circular Progress Gauge */}
      <div 
        className="relative flex items-center justify-center shrink-0" 
        style={{ width: isLarge ? 48 : isSmall ? 26 : 34, height: isLarge ? 48 : isSmall ? 26 : 34 }}
      >
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="3.5"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={progressColor}
            strokeWidth="3.8"
            strokeDasharray={`${numScore}, 100`}
            strokeLinecap="round"
          />
        </svg>
        <span 
          className="absolute font-black font-mono tracking-tight"
          style={{ 
            fontSize: isLarge ? '0.9rem' : isSmall ? '0.65rem' : '0.75rem',
            color: '#ffffff'
          }}
        >
          {Math.round(numScore)}%
        </span>
      </div>

      <div className="flex flex-col">
        <span 
          className="font-bold flex items-center gap-1.5 leading-tight"
          style={{ 
            fontSize: isLarge ? '0.95rem' : isSmall ? '0.75rem' : '0.82rem',
            color: progressColor 
          }}
        >
          {icon}
          {tierLabel}
        </span>
        {matchedCount !== undefined && totalCount !== undefined && (
          <span className="text-[11px] text-slate-300 font-medium">
            <span className="text-emerald-400 font-bold">{matchedCount}</span> of {totalCount} skills
          </span>
        )}
      </div>
    </div>
  );
}
