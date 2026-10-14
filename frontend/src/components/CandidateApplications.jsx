import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Building2, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ExternalLink,
  Sparkles,
  Inbox,
  Filter,
  ArrowRight
} from 'lucide-react';
import { applicationsApi } from '../services/api';
import MatchScoreBadge from './MatchScoreBadge';

export default function CandidateApplications({ candidate, onSelectJobId }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    if (candidate?.id) {
      loadApplications();
    }
  }, [candidate]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await applicationsApi.getByCandidate(candidate.id);
      setApplications(data || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'HIRED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white shadow-md shadow-emerald-500/30 flex items-center gap-1.5 border border-emerald-300">
            <CheckCircle2 size={13} className="stroke-[3]" />
            Offer Accepted / Hired
          </span>
        );
      case 'INTERVIEW':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/50 flex items-center gap-1.5">
            <Calendar size={13} />
            Interview Scheduled
          </span>
        );
      case 'SHORTLISTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 text-white border-2 border-white/40 flex items-center gap-1.5">
            <Sparkles size={13} className="text-emerald-400" />
            Shortlisted ⭐
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-slate-200 border border-white/20 flex items-center gap-1.5">
            <Clock size={13} />
            Under Recruiter Review
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-red-500/20 text-red-300 border-2 border-red-500/50 flex items-center gap-1.5">
            <XCircle size={13} className="stroke-[2.5]" />
            Application Declined
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-slate-300 border border-white/15">
            Application Received
          </span>
        );
    }
  };

  const filtered = applications.filter(app => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'SUCCESS') return ['HIRED', 'SHORTLISTED', 'INTERVIEW'].includes(app.status);
    if (filterStatus === 'DECLINED') return app.status === 'REJECTED';
    if (filterStatus === 'ACTIVE') return ['APPLIED', 'UNDER_REVIEW'].includes(app.status);
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/20 bg-slate-900 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <FileText size={14} />
              Applicant Tracking System
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            My Tracked Job Applications
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Review your submissions, skill compatibility ratings, and hiring pipeline status updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-2xl bg-white/10 text-white font-extrabold text-sm border border-white/20 text-center">
            <div className="text-xl font-black text-emerald-400">{applications.length}</div>
            <div className="text-[10px] uppercase text-slate-300">Total Applied</div>
          </div>
        </div>
      </div>

      {/* Interactive Status Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mr-1 flex items-center gap-1">
          <Filter size={13} />
          Filter:
        </span>
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            filterStatus === 'ALL'
              ? 'bg-white text-slate-900 border-white shadow-md'
              : 'bg-white/5 text-slate-300 border-white/15 hover:bg-white/10 hover:text-white'
          }`}
        >
          All ({applications.length})
        </button>
        <button
          onClick={() => setFilterStatus('SUCCESS')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            filterStatus === 'SUCCESS'
              ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30'
              : 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/40'
          }`}
        >
          Active / Shortlisted ({applications.filter(a => ['HIRED', 'SHORTLISTED', 'INTERVIEW'].includes(a.status)).length})
        </button>
        <button
          onClick={() => setFilterStatus('DECLINED')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            filterStatus === 'DECLINED'
              ? 'bg-red-500 text-white border-red-400 shadow-md shadow-red-500/30'
              : 'bg-red-950/30 text-red-300 border-red-500/30 hover:bg-red-900/40'
          }`}
        >
          Declined ({applications.filter(a => a.status === 'REJECTED').length})
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading your applications...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-white/15 bg-slate-900/90">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-slate-300 mx-auto mb-4 border border-white/20">
            <Inbox size={28} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Applications In This Category</h3>
          <p className="text-xs text-slate-300 max-w-sm mx-auto mb-4">
            Browse open positions on the job board to find roles matching your tech stack.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div 
              key={app.id} 
              className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/20 bg-slate-900/90 hover:border-emerald-500/50 hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider flex items-center gap-1">
                    <Building2 size={13} />
                    {app.company}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Calendar size={13} />
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white">
                  {app.jobTitle}
                </h3>

                {/* Matched Skills List in Green */}
                {app.matchedSkills && app.matchedSkills.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Matched Skills:
                    </span>
                    {app.matchedSkills.map((skill, idx) => (
                      <span key={idx} className="skill-chip matched text-xs font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {app.coverNote && (
                  <div className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-white/10 max-w-xl italic">
                    "{app.coverNote}"
                  </div>
                )}
              </div>

              {/* Status and Match Score */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div className="flex flex-col items-start md:items-end gap-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Review Status</span>
                  {getStatusBadge(app.status)}
                </div>

                <div className="flex items-center gap-2">
                  <MatchScoreBadge 
                    score={app.matchScore} 
                    size="sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
