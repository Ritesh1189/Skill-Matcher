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
  Filter
} from 'lucide-react';
import { applicationsApi } from '../services/api';

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
          <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, background: '#16a34a', color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} />
            Hired
          </span>
        );
      case 'INTERVIEW':
        return (
          <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, background: '#ecfdf5', color: '#15803d', border: '1px solid #86efac', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={13} />
            Interview Scheduled
          </span>
        );
      case 'SHORTLISTED':
        return (
          <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, background: '#ecfdf5', color: '#15803d', border: '1px solid #86efac', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={13} />
            Shortlisted ⭐
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} />
            Under Review
          </span>
        );
      case 'REJECTED':
        return (
          <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, background: '#fef2f2', color: '#b91c1c', border: '1px solid #fca5a5', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <XCircle size={13} />
            Declined
          </span>
        );
      default:
        return (
          <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>
            Application Sent
          </span>
        );
    }
  };

  const filtered = applications.filter(app => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'SUCCESS') return ['HIRED', 'SHORTLISTED', 'INTERVIEW'].includes(app.status);
    if (filterStatus === 'DECLINED') return app.status === 'REJECTED';
    return true;
  });

  return (
    <div className="naukri-container" style={{ maxWidth: '1000px' }}>
      
      {/* Header */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-card)', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', marginBottom: '4px' }}>
            <FileText size={14} />
            Job Application Tracker
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            My Applied Jobs
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Monitor review stages, interview schedules, and recruiter decisions.
          </p>
        </div>

        <div style={{ textAlign: 'center', background: '#ecfdf5', border: '1px solid #86efac', padding: '8px 18px', borderRadius: '8px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#15803d' }}>{applications.length}</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Total Applied</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setFilterStatus('ALL')}
          className="btn btn-sm"
          style={{
            background: filterStatus === 'ALL' ? '#16a34a' : '#ffffff',
            color: filterStatus === 'ALL' ? '#ffffff' : '#475569',
            border: '1px solid',
            borderColor: filterStatus === 'ALL' ? '#16a34a' : '#cbd5e1',
            borderRadius: '9999px'
          }}
        >
          All Applications ({applications.length})
        </button>

        <button
          onClick={() => setFilterStatus('SUCCESS')}
          className="btn btn-sm"
          style={{
            background: filterStatus === 'SUCCESS' ? '#16a34a' : '#ffffff',
            color: filterStatus === 'SUCCESS' ? '#ffffff' : '#15803d',
            border: '1px solid',
            borderColor: filterStatus === 'SUCCESS' ? '#16a34a' : '#86efac',
            borderRadius: '9999px'
          }}
        >
          Shortlisted / Interview ({applications.filter(a => ['HIRED', 'SHORTLISTED', 'INTERVIEW'].includes(a.status)).length})
        </button>

        <button
          onClick={() => setFilterStatus('DECLINED')}
          className="btn btn-sm"
          style={{
            background: filterStatus === 'DECLINED' ? '#dc2626' : '#ffffff',
            color: filterStatus === 'DECLINED' ? '#ffffff' : '#b91c1c',
            border: '1px solid',
            borderColor: filterStatus === 'DECLINED' ? '#dc2626' : '#fca5a5',
            borderRadius: '9999px'
          }}
        >
          Declined ({applications.filter(a => a.status === 'REJECTED').length})
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading applications...</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '48px', textAlign: 'center' }}>
          <Inbox size={36} style={{ color: '#94a3b8', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>No applications in this category</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Explore open jobs on the search page to apply for new roles.</p>
        </div>
      ) : (
        <div>
          {filtered.map((app) => (
            <div 
              key={app.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '20px',
                marginBottom: '12px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
                    {app.company}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Calendar size={12} />
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  {app.jobTitle}
                </h3>

                {/* Matched Skills */}
                {app.matchedSkills && app.matchedSkills.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Matched Skills:</span>
                    {app.matchedSkills.map((sk, idx) => (
                      <span key={idx} className="skill-chip matched" style={{ fontSize: '0.7rem' }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                )}

                {app.coverNote && (
                  <div style={{ fontSize: '0.75rem', color: '#475569', fontStyle: 'italic', marginTop: '8px', background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    "{app.coverNote}"
                  </div>
                )}
              </div>

              {/* Status and Match Score */}
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div>{getStatusBadge(app.status)}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803d', background: '#ecfdf5', border: '1px solid #86efac', padding: '3px 8px', borderRadius: '6px' }}>
                  {app.matchScore}% Compatibility
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
