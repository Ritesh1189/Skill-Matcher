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
  UserCheck
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

  if (!job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onApply(job, coverNote);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content relative p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pr-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/40">
              {job.company}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {job.type}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400">
              {job.experienceLevel}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">{job.title}</h2>

          <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-slate-500" />
              {job.location}
            </span>
            {job.salaryRange && (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <DollarSign size={13} />
                {job.salaryRange}
              </span>
            )}
            <span className="flex items-center gap-1 text-slate-400">
              <Clock size={13} />
              Posted by {job.recruiterName || 'Talent Partner'}
            </span>
          </div>
        </div>

        {/* Live Skill Match Breakdown Card (For Candidates) */}
        {isCandidate && matchResult && (
          <div className="mb-6 p-4 rounded-xl bg-slate-900/80 border border-indigo-500/30">
            <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Skill Matching Analysis</h3>
              </div>
              <MatchScoreBadge 
                score={matchResult.matchPercentage}
                matchedCount={matchResult.matchedCount}
                totalCount={matchResult.totalRequiredCount}
                size="md"
              />
            </div>

            {/* Formula Explanation box */}
            <div className="p-3 mb-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-300">
              <div className="text-[11px] text-indigo-400 font-semibold mb-1 flex items-center gap-1.5 font-sans">
                <Info size={12} />
                <span>Transparent Scoring Rule</span>
              </div>
              <div>
                Match score = ({matchResult.matchedCount} matched / {matchResult.totalRequiredCount} required) × 100 = <span className="text-emerald-400 font-bold">{matchResult.matchPercentage}%</span>
              </div>
              <div className="text-slate-400 text-[11px] mt-1 font-sans">
                {matchResult.explanation}
              </div>
            </div>

            {/* Matched vs Missing Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Matched Skills ({matchResult.matchedSkills?.length || 0})</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {matchResult.matchedSkills?.length > 0 ? (
                    matchResult.matchedSkills.map((skill, i) => (
                      <span key={i} className="skill-chip matched text-xs">
                        <Check size={11} className="stroke-[3]" />
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">None matched</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <XCircle size={12} />
                  <span>Missing Skills ({matchResult.missingSkills?.length || 0})</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {matchResult.missingSkills?.length > 0 ? (
                    matchResult.missingSkills.map((skill, i) => (
                      <span key={i} className="skill-chip missing text-xs">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-400 font-medium">All required skills met!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Job Description */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">About The Role</h4>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Nice to Have Skills */}
        {job.niceToHaveSkills && job.niceToHaveSkills.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Bonus / Nice to Have Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {job.niceToHaveSkills.map((skill, index) => (
                <span key={index} className="skill-chip text-xs">
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
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
                <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-sm">Application Already Submitted!</div>
                  <div className="text-xs text-emerald-400/80">You can track your interview and review status in the "My Applications" tab.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <label className="form-label">
                  Note to Recruiter (Optional)
                </label>
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Share a brief introduction or highlights of your projects..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                />
                
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={onClose} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    <Send size={15} />
                    <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {!isCandidate && (
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button onClick={onClose} className="btn btn-secondary">
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
