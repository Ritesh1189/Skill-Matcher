import React from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  Check, 
  X, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Users,
  Award
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

  const matchedList = job.requiredSkills.filter(skill => 
    normalizedCandidateMatched.has(skill.toLowerCase().trim())
  );

  const missingList = job.requiredSkills.filter(skill => 
    !normalizedCandidateMatched.has(skill.toLowerCase().trim())
  );

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/20 transition-all duration-300 group relative overflow-hidden">
      
      {/* Decorative subtle border top accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        matchResult?.matchPercentage >= 70 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : matchResult?.matchPercentage >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-red-500 to-rose-400'
      }`}></div>

      <div>
        {/* Top Header: Company, Location, and Match Score */}
        <div className="flex items-start justify-between gap-3 mb-3 pt-1">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                {job.company}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                {job.type}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {job.experienceLevel}
              </span>
            </div>

            <h3 
              onClick={() => onSelectJob(job)}
              className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors cursor-pointer leading-tight"
            >
              {job.title}
            </h3>
          </div>

          {/* Dynamic Match Score Badge for Candidates */}
          {isCandidate && matchResult && (
            <MatchScoreBadge 
              score={matchResult.matchPercentage}
              matchedCount={matchResult.matchedCount}
              totalCount={matchResult.totalRequiredCount}
              size="md"
              onClick={() => onSelectJob(job)}
            />
          )}

          {/* Recruiter view applicant count */}
          {isRecruiter && (
            <div 
              onClick={() => onViewApplicants && onViewApplicants(job)}
              className="px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold cursor-pointer hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <Users size={13} className="text-emerald-400" />
              <span>{job.applicantsCount || 0} Applicants</span>
            </div>
          )}
        </div>

        {/* Location & Compensation info */}
        <div className="flex items-center gap-4 text-xs text-slate-300 mb-4 flex-wrap">
          <div className="flex items-center gap-1 text-slate-300">
            <MapPin size={13} className="text-emerald-400" />
            <span>{job.location}</span>
          </div>
          {job.salaryRange && (
            <div className="flex items-center gap-1 text-white font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              <DollarSign size={13} className="text-emerald-400" />
              <span>{job.salaryRange}</span>
            </div>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Green vs Red Skills Comparison Box */}
        {isCandidate ? (
          <div className="mb-4 p-3 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
            
            {/* Green Matched Skills */}
            {matchedList.length > 0 && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1">
                  <Check size={11} className="stroke-[3]" />
                  <span>Skills You Have ({matchedList.length}):</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {matchedList.map((skill, idx) => (
                    <span key={idx} className="skill-chip matched text-xs">
                      <Check size={11} className="stroke-[3]" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Red Missing Skills */}
            {missingList.length > 0 && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1 flex items-center gap-1">
                  <X size={11} className="stroke-[3]" />
                  <span>Missing Skills Needed ({missingList.length}):</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {missingList.map((skill, idx) => (
                    <span key={idx} className="skill-chip missing text-xs">
                      <X size={11} className="stroke-[3]" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {missingList.length === 0 && (
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 py-1">
                <CheckCircle2 size={14} />
                <span>Perfect 100% Skill Alignment! You meet all requirements.</span>
              </div>
            )}

          </div>
        ) : (
          <div className="mb-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Required Skills ({job.requiredSkills.length})
            </div>
            <div className="flex flex-wrap gap-1">
              {job.requiredSkills.map((skill, idx) => (
                <span key={idx} className="skill-chip neutral text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 mt-auto">
        <button
          onClick={() => onSelectJob(job)}
          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group/btn transition-colors"
        >
          <span>Deep Skill Breakdown</span>
          <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>

        {isCandidate && (
          hasApplied ? (
            <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Applied</span>
            </span>
          ) : (
            <button
              onClick={() => onApply(job)}
              className="btn btn-sm btn-green"
            >
              <span>Quick Apply</span>
            </button>
          )
        )}

        {isRecruiter && (
          <button
            onClick={() => onViewApplicants && onViewApplicants(job)}
            className="btn btn-sm btn-secondary"
          >
            <span>Inspect Candidates</span>
          </button>
        )}
      </div>

    </div>
  );
}
