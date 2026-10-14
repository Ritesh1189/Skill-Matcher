import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  PlusCircle, 
  Users, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Clock, 
  MapPin, 
  DollarSign, 
  Filter, 
  ChevronRight,
  ExternalLink,
  Sparkles,
  Award,
  Send,
  UserCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { jobsApi, applicationsApi } from '../services/api';
import MatchScoreBadge from './MatchScoreBadge';

export default function RecruiterDashboard({ recruiter, onOpenPostJob }) {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    if (recruiter?.id) {
      loadRecruiterJobs();
    }
  }, [recruiter]);

  const loadRecruiterJobs = async () => {
    setLoading(true);
    try {
      const data = await jobsApi.getRecruiterJobs(recruiter.id);
      setJobs(data || []);
      if (data && data.length > 0 && !selectedJob) {
        selectJobToReview(data[0]);
      }
    } catch (err) {
      console.error('Failed to load recruiter jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectJobToReview = async (job) => {
    setSelectedJob(job);
    setLoadingApps(true);
    try {
      const apps = await applicationsApi.getByJob(job.id);
      setApplications(apps || []);
    } catch (err) {
      console.error('Failed to load applicants:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationsApi.updateStatus(appId, newStatus);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      setActionSuccess(`Candidate status updated to ${newStatus}`);
      setTimeout(() => setActionSuccess(''), 3500);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) return;
    try {
      await jobsApi.deleteJob(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      if (selectedJob?.id === jobId) {
        setSelectedJob(null);
        setApplications([]);
      }
      setActionSuccess('Job listing removed successfully');
      setTimeout(() => setActionSuccess(''), 3500);
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  const totalApplicantsCount = jobs.reduce((sum, j) => sum + (j.applicantsCount || 0), 0);
  const shortlistedCount = applications.filter(a => ['SHORTLISTED', 'INTERVIEW', 'HIRED'].includes(a.status)).length;
  const highMatchCount = applications.filter(a => a.matchScore >= 70).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Briefcase size={14} />
              Recruiter Talent Management
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
              {recruiter?.company || 'Enterprise Partner'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Job Postings & Algorithmic Applicant Review
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Candidates are scored and ranked transparently by percentage of required skill overlap.
          </p>
        </div>

        <button onClick={onOpenPostJob} className="btn btn-green font-extrabold sm:btn-lg shadow-lg shadow-emerald-500/20">
          <PlusCircle size={18} />
          <span>Post New Job Position</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border-2 border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-lg animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Metrics Counters (Green, White, and Red Highlights) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/20 bg-slate-900">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Postings</div>
          <div className="text-3xl font-black text-white mt-1">{jobs.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Open on board</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/20 bg-slate-900">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Received</div>
          <div className="text-3xl font-black text-white mt-1">{totalApplicantsCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Applicant submissions</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/30">
          <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={12} />
            High Match (≥ 70%)
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-1">{highMatchCount}</div>
          <div className="text-[11px] text-emerald-300 mt-0.5">Strong fit candidates</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-2 border-white/30 bg-white/5">
          <div className="text-xs text-white font-bold uppercase tracking-wider flex items-center gap-1">
            <Award size={12} />
            Shortlisted / Hired
          </div>
          <div className="text-3xl font-black text-white mt-1">{shortlistedCount}</div>
          <div className="text-[11px] text-slate-300 mt-0.5">In advanced stages</div>
        </div>
      </div>

      {/* Main Grid: Left Jobs List, Right Applicants Review */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recruiter Job Listings */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            <span>Your Listed Openings</span>
            <span className="text-emerald-400">{jobs.length} Active</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">Loading postings...</div>
          ) : jobs.length === 0 ? (
            <div className="glass-panel p-8 text-center rounded-3xl border border-white/15 bg-slate-900">
              <Briefcase size={32} className="mx-auto text-emerald-400 mb-2" />
              <div className="text-base font-bold text-white">No jobs posted yet</div>
              <p className="text-xs text-slate-400 mt-1 mb-4">Post a role to start receiving matched candidates.</p>
              <button onClick={onOpenPostJob} className="btn btn-green text-xs font-bold">
                Post Job
              </button>
            </div>
          ) : (
            jobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => selectJobToReview(job)}
                  className={`glass-panel p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected 
                      ? 'border-2 border-emerald-500 bg-slate-900 shadow-xl shadow-emerald-500/10' 
                      : 'border-white/15 bg-slate-900/80 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-extrabold text-white leading-tight">
                        {job.title}
                      </h3>
                      <div className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {job.applicantsCount || 0} applicants
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400 font-medium">
                      {job.requiredSkills?.length || 0} skills: {job.requiredSkills?.slice(0, 3).join(', ')}...
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJob(job.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-red-500 transition-colors"
                      title="Delete job listing"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Applicants for Selected Job */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border-2 border-white/20 bg-slate-900 shadow-2xl">
            {selectedJob ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                      Reviewing Applicants
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                      {selectedJob.title}
                    </h2>
                    <div className="text-xs text-slate-300 mt-1 flex items-center gap-1 flex-wrap">
                      <span className="font-bold text-white">Required Skills:</span>
                      {selectedJob.requiredSkills.map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-white/10 text-white border border-white/20 self-start sm:self-auto">
                    {applications.length} Candidates
                  </div>
                </div>

                {loadingApps ? (
                  <div className="py-16 text-center text-slate-400 text-xs">Evaluating applicants...</div>
                ) : applications.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 text-xs">
                    <Users size={36} className="mx-auto text-slate-500 mb-2" />
                    <p className="font-bold text-white text-sm">No applications received yet for this role.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Candidates who apply will have their skills automatically compared and scored.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div 
                        key={app.id}
                        className="p-5 rounded-2xl bg-slate-950/80 border border-white/15 hover:border-emerald-500/40 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <div className="text-base font-extrabold text-white flex items-center gap-2">
                              <span>{app.candidateName}</span>
                              <span className="text-xs text-slate-400 font-normal">({app.candidateEmail})</span>
                            </div>
                            <div className="text-xs text-emerald-400 font-semibold mt-0.5">
                              {app.candidateTitle || 'Candidate Profile'}
                            </div>
                          </div>

                          <MatchScoreBadge 
                            score={app.matchScore}
                            size="md"
                          />
                        </div>

                        {/* Matched in Green & Missing in Red */}
                        <div className="text-xs space-y-2 pt-2 border-t border-slate-800">
                          {app.matchedSkills && app.matchedSkills.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">
                                Matched ({app.matchedSkills.length}):
                              </span>
                              {app.matchedSkills.map((s, idx) => (
                                <span key={idx} className="skill-chip matched text-[11px] font-bold">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}

                          {app.missingSkills && app.missingSkills.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] font-black text-red-400 uppercase tracking-wider">
                                Missing ({app.missingSkills.length}):
                              </span>
                              {app.missingSkills.map((s, idx) => (
                                <span key={idx} className="skill-chip missing text-[11px] font-bold">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {app.coverNote && (
                          <div className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-white/10 italic">
                            "{app.coverNote}"
                          </div>
                        )}

                        {/* Interactive Recruiter Decision Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
                          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Pipeline Action:
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(app.id, 'SHORTLISTED')}
                              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all border ${
                                app.status === 'SHORTLISTED'
                                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm'
                                  : 'bg-white/10 text-white border-white/20 hover:bg-emerald-600'
                              }`}
                            >
                              ⭐ Shortlist
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(app.id, 'INTERVIEW')}
                              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all border ${
                                app.status === 'INTERVIEW'
                                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm'
                                  : 'bg-white/10 text-white border-white/20 hover:bg-emerald-600'
                              }`}
                            >
                              📅 Interview
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(app.id, 'HIRED')}
                              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all border ${
                                app.status === 'HIRED'
                                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/40'
                                  : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600 hover:text-white'
                              }`}
                            >
                              🎉 Hire
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(app.id, 'REJECTED')}
                              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all border ${
                                app.status === 'REJECTED'
                                  ? 'bg-red-500 text-white border-red-400 shadow-md shadow-red-500/40'
                                  : 'bg-red-950/40 text-red-300 border-red-500/40 hover:bg-red-600 hover:text-white'
                              }`}
                            >
                              ❌ Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="py-24 text-center text-slate-400 text-xs">
                Select a job from the left column to view and evaluate applicants.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
