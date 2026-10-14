import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
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
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#ffffff', '#dc2626']
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

  const score = matchResult?.matchPercentage ?? 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '720px' }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b'
          }}
          title="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '20px', paddingRight: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '3px 10px', borderRadius: '4px', background: '#ecfdf5', color: '#166534', border: '1px solid #86efac' }}>
              {job.company}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#475569' }}>
              {job.type}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#475569' }}>
              {job.experienceLevel || 'Mid Level'}
            </span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: '8px' }}>
            {job.title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: '#64748b', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={15} style={{ color: '#16a34a' }} />
              <strong style={{ color: '#334155' }}>{job.location}</strong>
            </span>
            {job.salaryRange && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontWeight: 700 }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>₹</span>
                {job.salaryRange}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={15} />
              Posted by {job.recruiterName || 'Talent Partner'}
            </span>
            <button 
              onClick={handleCopy}
              style={{ background: 'none', border: 'none', color: '#16a34a', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}
            >
              <Share2 size={13} />
              {copiedLink ? 'Link Copied!' : 'Share'}
            </button>
          </div>
        </div>

        {/* Live Skill Match Breakdown Card (For Candidates) */}
        {isCandidate && matchResult && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>Skill Compatibility Analysis</h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Automated overlap comparison between your skills and role requirements</p>
                </div>
              </div>

              <div 
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  background: score >= 70 ? '#ecfdf5' : score >= 50 ? '#fefce8' : '#fef2f2',
                  color: score >= 70 ? '#15803d' : score >= 50 ? '#a16207' : '#b91c1c',
                  border: `1px solid ${score >= 70 ? '#86efac' : score >= 50 ? '#fde047' : '#fca5a5'}`,
                  fontSize: '0.9rem',
                  fontWeight: 900
                }}
              >
                {score}% Match
              </div>
            </div>

            {/* Formula Explanation box */}
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '12px', color: '#334155' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', marginBottom: '3px', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Info size={13} />
                <span>Transparent Scoring Equation</span>
              </div>
              <div style={{ fontWeight: 700 }}>
                Match score = ({matchResult.matchedCount} matched / {matchResult.totalRequiredCount} required) × 100 = <span style={{ color: '#16a34a', fontWeight: 900 }}>{score}%</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', fontFamily: 'var(--font-sans)' }}>
                {matchResult.explanation}
              </div>
            </div>

            {/* Matched vs Missing Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Green Matched */}
              <div style={{ background: '#ffffff', border: '1px solid #86efac', borderRadius: '8px', padding: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <CheckCircle2 size={13} />
                  <span>Skills You Have ({matchResult.matchedSkills?.length || 0})</span>
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {matchResult.matchedSkills?.length > 0 ? (
                    matchResult.matchedSkills.map((sk, i) => (
                      <span key={i} className="skill-chip matched">
                        <Check size={10} strokeWidth={3} />
                        {sk}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>None matched</span>
                  )}
                </div>
              </div>

              {/* Red Missing */}
              <div style={{ background: '#ffffff', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b91c1c', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <XCircle size={13} />
                  <span>Missing Skills ({matchResult.missingSkills?.length || 0})</span>
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {matchResult.missingSkills?.length > 0 ? (
                    matchResult.missingSkills.map((sk, i) => (
                      <span key={i} className="skill-chip missing">
                        <X size={10} strokeWidth={3} />
                        {sk}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                      All requirements met!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Job Description */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Job Description & Responsibilities
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line', background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            {job.description}
          </p>
        </div>

        {/* Nice to Have Skills */}
        {job.niceToHaveSkills && job.niceToHaveSkills.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              Bonus / Preferred Technologies
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {job.niceToHaveSkills.map((sk, idx) => (
                <span key={idx} className="skill-chip neutral">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Application Submission Form */}
        {isCandidate && (
          <div style={{ paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            {hasApplied ? (
              <div style={{ padding: '14px', borderRadius: '8px', background: '#ecfdf5', border: '1px solid #86efac', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={24} style={{ color: '#16a34a', shrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#166534' }}>Application Already Submitted</div>
                  <div style={{ fontSize: '0.75rem', color: '#15803d' }}>
                    You can track your interview and review status in the "My Applications" tab.
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label className="form-label">
                  Note to Hiring Manager (Optional)
                </label>
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Share a brief introduction or highlights of your projects..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  style={{ marginBottom: '12px' }}
                />
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" onClick={onClose} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-green btn-lg">
                    <Send size={15} />
                    <span>{submitting ? 'Submitting...' : 'Apply on Portal'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {!isCandidate && (
          <div style={{ paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Want to apply? Create your free profile to check your skill match and apply.
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={onClose} className="btn btn-secondary">
                Close
              </button>
              <button 
                onClick={() => {
                  onClose();
                  if (onNavigateToAuth) onNavigateToAuth();
                }} 
                className="btn btn-green"
              >
                Log In to Apply
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
