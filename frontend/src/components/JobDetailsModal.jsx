import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Send, 
  Info,
  Check,
  Building2,
  Share2,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import MatchScoreBadge from './MatchScoreBadge';

export default function JobDetailsModal({ 
  job, 
  matchResult, 
  onClose, 
  onApply, 
  hasApplied, 
  isCandidate 
}) {
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onApply(job, coverNote);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#ffffff', '#ef4444']
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content relative p-6 sm:p-8 border border-white/20 bg-slate-900/95 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/90 text-white hover:bg-red-500 hover:text-white transition-all border border-white/10"
          title="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pr-10">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 size={13} />
              {job.company}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/20">
              {job.type}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {job.experienceLevel}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            {job.title}
          </h2>

          <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-400" />
              <strong className="text-white">{job.location}</strong>
            </span>
            {job.salaryRange && (
              <span className="flex items-center gap-1 text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30">
                <DollarSign size={13} />
                {job.salaryRange}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-slate-400">
              <Clock size={14} />
              Posted by <span className="text-white font-medium">{job.recruiterName || 'Talent Partner'}</span>
            </span>
            <button 
              onClick={handleCopy}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] underline ml-auto"
            >
              <Share2 size={12} />
              {copiedLink ? 'Link Copied!' : 'Share Role'}
            </button>
          </div>
        </div>

        {/* Skill Match Breakdown Card (For Candidates) */}
        {isCandidate && matchResult && (
          <div className="mb-6 p-5 rounded-2xl bg-slate-950/80 border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/10">
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Algorithmic Skill Compatibility</h3>
                  <p className="text-[11px] text-slate-400">Automated overlap scoring between your profile and job specs</p>
                </div>
              </div>
              <MatchScoreBadge 
                score={matchResult.matchPercentage}
                matchedCount={matchResult.matchedCount}
                totalCount={matchResult.totalRequiredCount}
                size="md"
              />
            </div>

            {/* Transparent Mathematical Formula Box */}
            <div className="p-3.5 mb-4 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-200">
              <div className="text-[11px] text-emerald-400 font-bold mb-1 flex items-center gap-1.5 font-sans uppercase tracking-wider">
                <Info size={13} />
                <span>Deterministic Overlap Equation</span>
              </div>
              <div className="text-sm py-0.5">
                Match score = (<span className="text-emerald-400 font-bold">{matchResult.matchedCount} matched</span> / <span className="text-white font-bold">{matchResult.totalRequiredCount} required</span>) × 100 = <span className="text-emerald-400 font-extrabold text-base">{matchResult.matchPercentage}%</span>
              </div>
              <div className="text-slate-400 text-xs mt-1.5 font-sans leading-relaxed">
                {matchResult.explanation}
              </div>
            </div>

            {/* Side-by-Side Green (Matched) vs Red (Missing) Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Green Matched Column */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="stroke-[2.5]" />
                  <span>Skills You Have ({matchResult.matchedSkills?.length || 0})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchResult.matchedSkills?.length > 0 ? (
                    matchResult.matchedSkills.map((skill, i) => (
                      <span key={i} className="skill-chip matched text-xs font-bold">
                        <Check size={12} className="stroke-[3]" />
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No direct skill matches found in profile</span>
                  )}
                </div>
              </div>

              {/* Red Missing Column */}
              <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30">
                <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <XCircle size={14} className="stroke-[2.5]" />
                  <span>Missing Requirements ({matchResult.missingSkills?.length || 0})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchResult.missingSkills?.length > 0 ? (
                    matchResult.missingSkills.map((skill, i) => (
                      <span key={i} className="skill-chip missing text-xs font-bold">
                        <X size={11} className="stroke-[3]" />
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Award size={14} />
                      Perfect 100% Match! All requirements met.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Job Description */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Role Overview & Responsibilities</h4>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-white/10">
            {job.description}
          </p>
        </div>

        {/* Bonus / Nice to Have Skills */}
        {job.niceToHaveSkills && job.niceToHaveSkills.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Bonus / Nice to Have Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {job.niceToHaveSkills.map((skill, index) => (
                <span key={index} className="skill-chip text-xs bg-white/10 text-white border border-white/20 font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Application Submission Form */}
        {isCandidate && (
          <div className="pt-4 border-t border-slate-800">
            {hasApplied ? (
              <div className="p-4 rounded-xl bg-emerald-950/50 border-2 border-emerald-500/50 text-emerald-200 flex items-center gap-3 shadow-lg shadow-emerald-900/30">
                <CheckCircle2 size={28} className="text-emerald-400 shrink-0" />
                <div>
                  <div className="font-extrabold text-sm text-white">Application Successfully Submitted!</div>
                  <div className="text-xs text-emerald-300">
                    The hiring team has your profile and match score ({matchResult?.matchPercentage}%). Track status in "My Applications".
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <label className="form-label flex items-center justify-between">
                  <span>Cover Note to Recruiter (Optional)</span>
                  <span className="text-[11px] text-slate-400 font-normal">{coverNote.length}/300 chars</span>
                </label>
                <textarea
                  rows="3"
                  maxLength={300}
                  className="form-control"
                  placeholder="Tell the hiring manager why your background makes you a strong candidate for this position..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                />
                
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={onClose} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-green text-sm sm:btn-lg font-extrabold">
                    <Send size={16} />
                    <span>{submitting ? 'Submitting Application...' : 'Apply with Profile'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {!isCandidate && (
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button onClick={onClose} className="btn btn-white font-bold">
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
