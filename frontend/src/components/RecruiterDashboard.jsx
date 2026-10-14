import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  PlusCircle, 
  Users, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  DollarSign, 
  Filter, 
  ChevronRight,
  ExternalLink,
  Sparkles,
  UserCheck
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
      setTimeout(() => setActionSuccess(''), 3000);
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
      setActionSuccess('Job deleted successfully');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  const totalApplicantsCount = jobs.reduce((sum, j) => sum + (j.applicantsCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Recruiter Operations Hub</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/40">
              {recruiter?.company || 'Talent Portal'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Job Listings & Applicant Review
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate applicants ranked by algorithmic skill match percentage and manage hiring stages.
          </p>
        </div>

        <button onClick={onOpenPostJob} className="btn btn-primary sm:btn-lg">
          <PlusCircle size={18} />
          <span>Post New Job Opening</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Metrics Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Your Active Postings</div>
          <div className="text-2xl font-bold text-white mt-1">{jobs.length}</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Total Received Applications</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">{totalApplicantsCount}</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Under Review / Shortlisted</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {applications.filter(a => ['UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW'].includes(a.status)).length}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Jobs List, Right Applicants Review */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recruiter Job Listings */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Your Job Postings</span>
            <span>{jobs.length} roles</span>
          </div>

          {loading ? (
            <div className="py-10 text-center text-slate-400 text-xs">Loading postings...</div>
          ) : jobs.length === 0 ? (
            <div className="glass-panel p-8 text-center rounded-2xl border-slate-800">
              <Briefcase size={28} className="mx-auto text-slate-500 mb-2" />
              <div className="text-sm font-bold text-white">No jobs posted yet</div>
              <p className="text-xs text-slate-400 mt-1 mb-4">Post your first position to receive applications.</p>
              <button onClick={onOpenPostJob} className="btn btn-sm btn-primary">
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
                  className={`glass-panel p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected 
                      ? 'border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-500/10' 
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        {job.title}
                      </h3>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <span className="badge badge-primary text-[11px]">
                      {job.applicantsCount || 0} applicants
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    <span className="text-slate-500">
                      {job.requiredSkills?.length || 0} required skills
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJob(job.id);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Delete listing"
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
          <div className="glass-panel p-6 rounded-2xl border-slate-800">
            {selectedJob ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                      Applicant Review
                    </span>
                    <h2 className="text-xl font-bold text-white mt-0.5">
                      {selectedJob.title}
                    </h2>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Required Skills: {selectedJob.requiredSkills.join(', ')}
                    </div>
                  </div>

                  <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300">
                    {applications.length} Candidates Applied
                  </div>
                </div>

                {loadingApps ? (
                  <div className="py-12 text-center text-slate-400 text-xs">Loading applicants...</div>
                ) : applications.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    <Users size={32} className="mx-auto text-slate-600 mb-2" />
                    <p className="font-medium text-slate-300">No applications received yet for this role.</p>
                    <p className="text-[11px] text-slate-500 mt-1">Candidates matching the required skills will show up here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div 
                        key={app.id}
                        className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                              <span>{app.candidateName}</span>
                              <span className="text-xs text-slate-400 font-normal">({app.candidateEmail})</span>
                            </div>
                            <div className="text-xs text-indigo-300 font-medium mt-0.5">
                              {app.candidateTitle || 'Candidate Profile'}
                            </div>
                          </div>

                          <MatchScoreBadge 
                            score={app.matchScore}
                            size="md"
                          />
                        </div>

                        {/* Matched & Missing Skills */}
                        <div className="text-xs space-y-1.5 pt-2 border-t border-slate-800">
                          {app.matchedSkills && app.matchedSkills.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] font-semibold text-emerald-400">Matched:</span>
                              {app.matchedSkills.map((s, idx) => (
                                <span key={idx} className="skill-chip matched text-[11px]">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}

                          {app.missingSkills && app.missingSkills.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] font-semibold text-rose-400">Missing:</span>
                              {app.missingSkills.map((s, idx) => (
                                <span key={idx} className="skill-chip missing text-[11px]">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {app.coverNote && (
                          <div className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 italic">
                            "{app.coverNote}"
                          </div>
                        )}

                        {/* Recruiter Action Bar: Status Selector */}
                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                          <span className="text-[11px] text-slate-400 font-medium">Hiring Pipeline Stage:</span>
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className="bg-slate-800 text-xs font-semibold rounded-lg px-3 py-1.5 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                          >
                            <option value="APPLIED">Applied</option>
                            <option value="UNDER_REVIEW">Under Review</option>
                            <option value="SHORTLISTED">Shortlisted ⭐</option>
                            <option value="INTERVIEW">Interview Scheduled 📅</option>
                            <option value="HIRED">Hired 🎉</option>
                            <option value="REJECTED">Declined ❌</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center text-slate-500 text-xs">
                Select a job from the left to view candidates and applications.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
