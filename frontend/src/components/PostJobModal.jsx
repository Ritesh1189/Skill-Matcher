import React, { useState } from 'react';
import { X, Plus, Briefcase, Check, Info, Sparkles } from 'lucide-react';
import { jobsApi } from '../services/api';

const POPULAR_REQUIREMENTS = [
  'Java', 'Spring Boot', 'React', 'MongoDB', 'SQL', 'Git', 'Docker',
  'AWS', 'TypeScript', 'Kubernetes', 'REST APIs', 'Node.js', 'Python', 'CI/CD'
];

export default function PostJobModal({ recruiter, onClose, onJobCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    company: recruiter?.company || 'Tata Consultancy Services',
    location: 'Bengaluru, Karnataka (Hybrid)',
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: '₹12.0 - ₹18.0 LPA',
    description: '',
    requiredSkills: ['Java', 'React', 'SQL', 'Git'],
    niceToHaveSkills: ['Spring Boot', 'Docker'],
    recruiterId: recruiter?.id || '',
    recruiterEmail: recruiter?.email || '',
    recruiterName: recruiter?.name || '',
  });

  const [newRequiredSkill, setNewRequiredSkill] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addRequiredSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!formData.requiredSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, trimmed]
      }));
    }
    setNewRequiredSkill('');
  };

  const removeRequiredSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.requiredSkills.length === 0) {
      setError('Please add at least one required skill for automated matching');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const created = await jobsApi.createJob(formData);
      onJobCreated(created);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
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
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={18} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Post a New Job Opening</h2>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '18px' }}>
          Create a job vacancy. Candidate profiles will be scored against your required skills.
        </p>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '6px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '0.8rem', fontWeight: 700, marginBottom: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label className="form-label">Job Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Senior Java & Spring Boot Developer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-control"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bengaluru, Hyderabad, Pune"
              />
            </div>
            <div>
              <label className="form-label">Job Type</label>
              <select
                className="form-control"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="form-label">Salary Range</label>
              <input
                type="text"
                className="form-control"
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                placeholder="e.g. ₹12.0 - ₹18.0 LPA"
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label className="form-label">Job Description *</label>
            <textarea
              rows="3"
              className="form-control"
              placeholder="Outline role responsibilities, tech stack, and qualifications..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Mandatory Skills Tag Box */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px', marginBottom: '18px' }}>
            <label className="form-label" style={{ color: '#16a34a', fontWeight: 800 }}>
              Mandatory Required Skills (Matching Criteria) *
            </label>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
              These skills form the algorithm's denominator: {formData.requiredSkills.length} required
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              {formData.requiredSkills.map((sk, idx) => (
                <span key={idx} className="skill-chip matched" style={{ fontSize: '0.75rem' }}>
                  {sk}
                  <button
                    type="button"
                    onClick={() => removeRequiredSkill(sk)}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', marginLeft: '4px' }}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Add custom required skill..."
                value={newRequiredSkill}
                onChange={(e) => setNewRequiredSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addRequiredSkill(newRequiredSkill);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addRequiredSkill(newRequiredSkill)}
                className="btn btn-green btn-sm"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {/* Quick Suggestions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {POPULAR_REQUIREMENTS.map((s, idx) => {
                const has = formData.requiredSkills.some(rs => rs.toLowerCase() === s.toLowerCase());
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => has ? removeRequiredSkill(s) : addRequiredSkill(s)}
                    className="skill-chip"
                    style={{
                      background: has ? '#ecfdf5' : '#ffffff',
                      color: has ? '#15803d' : '#64748b',
                      borderColor: has ? '#86efac' : '#e2e8f0',
                      cursor: 'pointer'
                    }}
                  >
                    {has ? '✓ ' : '+ '}{s}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-green btn-lg">
              {submitting ? 'Publishing...' : 'Publish Job Listing'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
