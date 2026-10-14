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
  Building2
} from 'lucide-react';
import { jobsApi, applicationsApi } from '../services/api';

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
      setActionSuccess(`Applicant status changed to ${newStatus}`);
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
  const shortlistedCount = applications.filter(a => ['SHORTLISTED', 'INTERVIEW', 'HIRED'].includes(a.status)).length;

  return (
    <div className="naukri-container">
      
      {/* Header (Naukri Employer style) */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-card)', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', marginBottom: '4px' }}>
            <Building2 size={14} />
            Employer Hiring Portal
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Candidate Applications & Role Postings
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Manage job vacancies and evaluate candidates ranked by automated skill match percentages.
          </p>
        </div>

        <button onClick={onOpenPostJob} className="btn btn-green btn-lg">
          <PlusCircle size={18} />
          <span>Post a New Job</span>
        </button>
      </div>

      {actionSuccess && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: '#ecfdf5', border: '1px solid #86efac', color: '#166534', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Metrics Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Active Job Postings</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>{jobs.length}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Applications Received</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>{totalApplicantsCount}</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #86efac', borderRadius: '10px', padding: '16px', boxShadow: 'var(--shadow-sm)', background: '#ecfdf5' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Shortlisted / In Pipeline</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#15803d', marginTop: '4px' }}>{shortlistedCount}</div>
        </div>
      </div>

      {/* Two Column Layout: Left (Job Postings), Right (Applicants Review) */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* Left Column: Job Postings */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '12px' }}>
            Your Open Positions ({jobs.length})
          </div>

          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>Loading postings...</div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
              <p style={{ fontSize: '0.85rem', marginBottom: '12px' }}>No jobs posted yet.</p>
              <button onClick={onOpenPostJob} className="btn btn-green btn-sm">
                Post First Job
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {jobs.map((job) => {
                const isSelected = selectedJob?.id === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => selectJobToReview(job)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #16a34a' : '1px solid #e2e8f0',
                      background: isSelected ? '#ecfdf5' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                        {job.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteJob(job.id);
                        }}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                        title="Delete listing"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                      {job.location} • {job.type}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f1f5f9', fontSize: '0.7rem' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>
                        {job.applicantsCount || 0} applicants
                      </span>
                      <span style={{ color: '#64748b' }}>
                        {job.requiredSkills?.length || 0} skills
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Applicants for Selected Job */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
          {selectedJob ? (
            <>
              <div style={{ paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>
                    Applicants Review
                  </span>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    {selectedJob.title}
                  </h2>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                    Required: {selectedJob.requiredSkills.join(', ')}
                  </div>
                </div>

                <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#f1f5f9', color: '#475569' }}>
                  {applications.length} Candidates
                </span>
              </div>

              {loadingApps ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>Loading applicants...</div>
              ) : applications.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  <Users size={32} style={{ color: '#94a3b8', margin: '0 auto 8px' }} />
                  <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>No applications received yet for this role.</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Candidates matching the required skills will show up here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {applications.map((app) => (
                    <div 
                      key={app.id}
                      style={{
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: '#f8fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                            {app.candidateName}
                            <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#64748b', marginLeft: '6px' }}>({app.candidateEmail})</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                            {app.candidateTitle || 'Candidate Profile'}
                          </div>
                        </div>

                        <div style={{ padding: '3px 10px', borderRadius: '9999px', background: '#ecfdf5', color: '#15803d', border: '1px solid #86efac', fontWeight: 800, fontSize: '0.8rem' }}>
                          {app.matchScore}% Compatibility
                        </div>
                      </div>

                      {/* Skills match */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem' }}>
                        {app.matchedSkills && app.matchedSkills.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, color: '#15803d' }}>Matched:</span>
                            {app.matchedSkills.map((s, idx) => (
                              <span key={idx} className="skill-chip matched" style={{ fontSize: '0.7rem' }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {app.missingSkills && app.missingSkills.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, color: '#b91c1c' }}>Missing:</span>
                            {app.missingSkills.map((s, idx) => (
                              <span key={idx} className="skill-chip missing" style={{ fontSize: '0.7rem' }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {app.coverNote && (
                        <div style={{ fontSize: '0.75rem', color: '#475569', fontStyle: 'italic', background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          "{app.coverNote}"
                        </div>
                      )}

                      {/* 1-Click Pipeline Status Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                          Update Pipeline Stage:
                        </span>

                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(app.id, 'SHORTLISTED')}
                            className="btn btn-sm"
                            style={{
                              background: app.status === 'SHORTLISTED' ? '#16a34a' : '#ffffff',
                              color: app.status === 'SHORTLISTED' ? '#ffffff' : '#15803d',
                              border: '1px solid #86efac'
                            }}
                          >
                            ⭐ Shortlist
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(app.id, 'INTERVIEW')}
                            className="btn btn-sm"
                            style={{
                              background: app.status === 'INTERVIEW' ? '#16a34a' : '#ffffff',
                              color: app.status === 'INTERVIEW' ? '#ffffff' : '#15803d',
                              border: '1px solid #86efac'
                            }}
                          >
                            📅 Interview
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(app.id, 'HIRED')}
                            className="btn btn-sm"
                            style={{
                              background: app.status === 'HIRED' ? '#166534' : '#ecfdf5',
                              color: app.status === 'HIRED' ? '#ffffff' : '#166534',
                              border: '1px solid #86efac',
                              fontWeight: 800
                            }}
                          >
                            🎉 Hire
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(app.id, 'REJECTED')}
                            className="btn btn-sm"
                            style={{
                              background: app.status === 'REJECTED' ? '#dc2626' : '#ffffff',
                              color: app.status === 'REJECTED' ? '#ffffff' : '#b91c1c',
                              border: '1px solid #fca5a5'
                            }}
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
            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
              Select a job listing on the left to review applicants.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
