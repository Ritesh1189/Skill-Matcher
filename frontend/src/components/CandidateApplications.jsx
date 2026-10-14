import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Building2, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Sparkles,
  Inbox
} from 'lucide-react';
import { applicationsApi } from '../services/api';
import MatchScoreBadge from './MatchScoreBadge';

export default function CandidateApplications({ candidate, onSelectJobId }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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
        return <span className="badge badge-strong py-1 px-3 text-xs">🎉 Hired</span>;
      case 'INTERVIEW':
        return <span className="badge badge-primary py-1 px-3 text-xs bg-purple-900/40 text-purple-300 border-purple-500/40">📅 Interview Scheduled</span>;
      case 'SHORTLISTED':
        return <span className="badge badge-strong py-1 px-3 text-xs bg-indigo-900/40 text-indigo-300 border-indigo-500/40">⭐ Shortlisted</span>;
      case 'UNDER_REVIEW':
        return <span className="badge badge-moderate py-1 px-3 text-xs">⏳ Under Review</span>;
      case 'REJECTED':
        return <span className="badge badge-low py-1 px-3 text-xs">Declined</span>;
      default:
        return <span className="badge badge-neutral py-1 px-3 text-xs">Applied</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText size={24} className="text-indigo-400" />
            <span>My Job Applications</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your applied roles, status changes, and skill match ratings
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700/60">
          Total Applications: {applications.length}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading your applications...</div>
      ) : applications.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <Inbox size={28} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Applications Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Explore open jobs matching your skills and submit applications to start tracking them here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div 
              key={app.id} 
              className="glass-panel p-5 rounded-2xl border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                    {app.company}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {app.jobTitle}
                </h3>

                {/* Matched skills pill */}
                {app.matchedSkills && app.matchedSkills.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400">Matched Skills:</span>
                    {app.matchedSkills.map((skill, idx) => (
                      <span key={idx} className="skill-chip matched text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {app.coverNote && (
                  <div className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 max-w-xl italic">
                    "{app.coverNote}"
                  </div>
                )}
              </div>

              {/* Status and Match Score */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Status:</span>
                  {getStatusBadge(app.status)}
                </div>

                <MatchScoreBadge 
                  score={app.matchScore} 
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
