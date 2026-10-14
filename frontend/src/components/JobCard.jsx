import React from 'react';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Clock, 
  Check, 
  X, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Users,
  Star
} from 'lucide-react';

export default function JobCard({ 
  job, 
  matchResult, 
  onSelectJob, 
  onApply, 
  hasApplied, 
  isCandidate,
  isRecruiter,
  onViewApplicants,
  isSelected
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

  const score = matchResult?.matchPercentage ?? 0;
  const scoreClass = score >= 70 ? 'high' : score >= 50 ? 'moderate' : 'low';

  return (
    <div 
      className={`naukri-job-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelectJob(job)}
    >
      {/* Top Header: Title, Company, and Match Rating Badge */}
      <div className="naukri-card-top">
        <div style={{ flex: 1 }}>
          <h2 className="naukri-job-title">
            {job.title}
          </h2>

          <div className="naukri-company-row">
            <span>{job.company}</span>
            <span className="naukri-rating-badge">
              <Star size={10} fill="#713f12" />
              4.2
            </span>
          </div>

          <div className="naukri-meta-row">
            <span className="naukri-meta-item">
              <Briefcase size={14} />
              {job.experienceLevel || '1-3 Yrs'}
            </span>
            <span className="naukri-meta-item">
              <MapPin size={14} />
              {job.location}
            </span>
            {job.salaryRange && (
              <span className="naukri-meta-item naukri-salary-text">
                <span style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.9rem' }}>₹</span>
                {job.salaryRange}
              </span>
            )}
          </div>
        </div>

        {/* Match Score Badge */}
        {isCandidate && matchResult ? (
          <div className={`naukri-match-score-badge ${scoreClass}`}>
            <Sparkles size={12} />
            <span>{score}% Match</span>
          </div>
        ) : !isRecruiter ? (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onApply(job);
            }}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '9999px',
              padding: '4px 10px',
              fontSize: '0.72rem',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Log in to see your personalized match percentage"
          >
            <Sparkles size={12} style={{ color: '#16a34a' }} />
            <span>Check Match %</span>
          </div>
        ) : null}

        {isRecruiter && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              if (onViewApplicants) onViewApplicants(job);
            }}
            style={{
              background: '#ecfdf5',
              color: '#15803d',
              border: '1px solid #86efac',
              borderRadius: '9999px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Users size={12} />
            <span>{job.applicantsCount || 0} Applicants</span>
          </div>
        )}
      </div>

      {/* Description Snippet */}
      <p style={{ fontSize: '0.825rem', color: '#475569', marginBottom: '12px', lineHeight: 1.5 }}>
        {job.description ? job.description.slice(0, 140) + '...' : ''}
      </p>

      {/* Naukri Key Skills Box: Green Matched vs Red Missing */}
      <div className="naukri-skill-match-box">
        {isCandidate ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>
                Key Skills Compatibility:
              </span>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                {matchedList.length} of {job.requiredSkills.length} matched
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {/* Green Matched Skills */}
              {matchedList.map((skill, idx) => (
                <span key={`matched-${idx}`} className="skill-chip matched">
                  <Check size={11} strokeWidth={3} />
                  {skill}
                </span>
              ))}

              {/* Red Missing Skills */}
              {missingList.map((skill, idx) => (
                <span key={`missing-${idx}`} className="skill-chip missing">
                  <X size={11} strokeWidth={3} />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              Required Candidate Skills ({job.requiredSkills.length}):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {job.requiredSkills.map((skill, idx) => (
                <span key={idx} className="skill-chip neutral">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Posted info & Apply button */}
      <div className="naukri-card-footer">
        <div>
          <span>Posted by {job.recruiterName || 'Talent Team'}</span>
          <span style={{ margin: '0 6px' }}>•</span>
          <span>{job.type}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectJob(job);
            }}
            className="btn btn-secondary btn-sm"
          >
            <span>Details</span>
            <ArrowRight size={13} />
          </button>

          {isCandidate ? (
            hasApplied ? (
              <span 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  padding: '5px 12px', 
                  borderRadius: '6px', 
                  background: '#dcfce7', 
                  color: '#166534', 
                  fontWeight: 700, 
                  fontSize: '0.75rem',
                  border: '1px solid #86efac'
                }}
              >
                <CheckCircle2 size={13} />
                Applied
              </span>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onApply(job);
                }}
                className="btn btn-green btn-sm"
              >
                Easy Apply
              </button>
            )
          ) : !isRecruiter ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onApply(job);
              }}
              className="btn btn-green btn-sm"
            >
              Apply Now
            </button>
          ) : null}
        </div>
      </div>

    </div>
  );
}
