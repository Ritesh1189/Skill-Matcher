import React from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  Check, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Award,
  Users
} from 'lucide-react';
import MatchScoreBadge from './MatchScoreBadge';

export default function JobCard({ 
  job, 
  matchResult, 
  onSelectJob, 
  onApply, 
  hasApplied, 
  isCandidate,
  isRecruiter,
  onViewApplicants
}) {
  const normalizedCandidateMatched = new Set(
    (matchResult?.matchedSkills || []).map(s => s.toLowerCase().trim())
  );

  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/40 hover:shadow-indigo-500/10 hover:shadow-xl transition-all duration-300 group">
      <div>
        {/* Top Header: Company, Location, & Match Score */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                {job.company}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                {job.type}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400">
                {job.experienceLevel}
              </span>
            </div>

            <h3 
              onClick={() => onSelectJob(job)}
              className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer"
            >
              {job.title}
            </h3>
          </div>

          {/* Match Score Badge for Candidates */}
          {isCandidate && matchResult && (
            <MatchScoreBadge 
              score={matchResult.matchPercentage}
              matchedCount={matchResult.matchedCount}
              totalCount={matchResult.totalRequiredCount}
              size="md"
              onClick={() => onSelectJob(job)}
            />
          )}

          {/* Applicants pill for Recruiters */}
          {isRecruiter && (
            <div 
              onClick={() => onViewApplicants && onViewApplicants(job)}
              className="badge badge-primary cursor-pointer hover:scale-105"
            >
              <Users size={12} />
              <span>{job.applicantsCount || 0} Applicants</span>
            </div>
          )}
        </div>

        {/* Location & Salary meta */}
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 flex-wrap">
          <div className="flex items-center gap-1">
            <MapPin size={13} className="text-slate-500" />
            <span>{job.location}</span>
          </div>
          {job.salaryRange && (
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <DollarSign size={13} />
              <span>{job.salaryRange}</span>
            </div>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Required Skills list */}
        <div className="mb-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Required Skills</span>
            {isCandidate && matchResult && (
              <span className="text-[10px] text-indigo-400 font-normal">
                {matchResult.matchedCount} of {matchResult.totalRequiredCount} match your profile
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {job.requiredSkills.map((skill, index) => {
              const isMatched = normalizedCandidateMatched.has(skill.toLowerCase().trim());
              return (
                <span
                  key={index}
                  className={`skill-chip ${isMatched ? 'matched' : ''}`}
                >
                  {isMatched && <Check size={11} className="stroke-[3] text-emerald-400" />}
                  <span>{skill}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        <button
          onClick={() => onSelectJob(job)}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group/btn transition-colors"
        >
          <span>View Details & Match Breakdown</span>
          <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>

        {isCandidate && (
          hasApplied ? (
            <span className="badge badge-strong py-1.5 px-3">
              <CheckCircle2 size={13} />
              <span>Applied</span>
            </span>
          ) : (
            <button
              onClick={() => onApply(job)}
              className="btn btn-sm btn-primary"
            >
              <span>Apply Now</span>
            </button>
          )
        )}

        {isRecruiter && (
          <button
            onClick={() => onViewApplicants && onViewApplicants(job)}
            className="btn btn-sm btn-secondary"
          >
            <span>Review Applicants</span>
          </button>
        )}
      </div>
    </div>
  );
}
