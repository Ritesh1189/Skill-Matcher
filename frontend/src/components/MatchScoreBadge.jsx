import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function MatchScoreBadge({ score, matchedCount, totalCount, size = 'md', onClick }) {
  if (score === undefined || score === null) return null;

  const numScore = Number(score);
  let tier = 'low';
  let tierLabel = 'Low Match';
  let badgeClass = 'badge-low';
  let progressColor = '#f43f5e';

  if (numScore >= 80) {
    tier = 'strong';
    tierLabel = 'Strong Match';
    badgeClass = 'badge-strong';
    progressColor = '#10b981';
  } else if (numScore >= 50) {
    tier = 'moderate';
    tierLabel = 'Good Match';
    badgeClass = 'badge-moderate';
    progressColor = '#f59e0b';
  }

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      }`}
      style={{
        backgroundColor: numScore >= 80 ? 'rgba(16, 185, 129, 0.12)' : numScore >= 50 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(244, 63, 94, 0.12)',
        borderColor: numScore >= 80 ? 'rgba(16, 185, 129, 0.35)' : numScore >= 50 ? 'rgba(245, 158, 11, 0.35)' : 'rgba(244, 63, 94, 0.35)',
      }}
      title={onClick ? "Click to see skill match breakdown" : ""}
    >
      {/* Circular Progress Gauge */}
      <div className="relative flex items-center justify-center" style={{ width: isLarge ? 44 : isSmall ? 24 : 32, height: isLarge ? 44 : isSmall ? 24 : 32 }}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="3.5"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={progressColor}
            strokeWidth="3.5"
            strokeDasharray={`${numScore}, 100`}
            strokeLinecap="round"
          />
        </svg>
        <span 
          className="absolute font-bold"
          style={{ 
            fontSize: isLarge ? '0.85rem' : isSmall ? '0.65rem' : '0.72rem',
            color: progressColor 
          }}
        >
          {Math.round(numScore)}%
        </span>
      </div>

      <div className="flex flex-col">
        <span 
          className="font-bold flex items-center gap-1"
          style={{ 
            fontSize: isLarge ? '0.9rem' : isSmall ? '0.75rem' : '0.8rem',
            color: progressColor 
          }}
        >
          {numScore >= 80 ? <Sparkles size={isSmall ? 12 : 14} /> : numScore >= 50 ? <CheckCircle2 size={isSmall ? 12 : 14} /> : <AlertCircle size={isSmall ? 12 : 14} />}
          {tierLabel}
        </span>
        {matchedCount !== undefined && totalCount !== undefined && (
          <span className="text-xs text-slate-400" style={{ fontSize: '0.7rem' }}>
            {matchedCount} of {totalCount} skills matched
          </span>
        )}
      </div>
    </div>
  );
}
