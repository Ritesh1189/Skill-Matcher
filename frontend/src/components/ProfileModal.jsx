import React, { useState } from 'react';
import { X, Save, Plus, Tag, Check, Sparkles, User, Briefcase, GraduationCap, MapPin } from 'lucide-react';
import { candidatesApi } from '../services/api';

const POPULAR_SKILLS = [
  'Java', 'Spring Boot', 'React', 'MongoDB', 'TypeScript', 'JavaScript',
  'SQL', 'Git', 'Docker', 'AWS', 'Kubernetes', 'REST APIs', 'Node.js',
  'Python', 'Microservices', 'Tailwind CSS', 'Redux', 'CI/CD'
];

export default function ProfileModal({ user, onClose, onProfileUpdated }) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    title: user.title || '',
    bio: user.bio || '',
    location: user.location || '',
    experienceYears: user.experienceYears || 0,
    education: user.education || '',
    githubUrl: user.githubUrl || '',
    linkedinUrl: user.linkedinUrl || '',
    skills: user.skills ? [...user.skills] : [],
  });

  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addSkill = (skillToAdd) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (!formData.skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmed]
      }));
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const updated = await candidatesApi.updateProfile(user.id, formData);
      onProfileUpdated(updated);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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
            <User size={18} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Candidate Profile & Skills</h2>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '18px' }}>
          Update your verified skills to immediately recompute your job match percentages.
        </p>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '6px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '0.8rem', fontWeight: 700, marginBottom: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label">Professional Headline *</label>
              <input
                type="text"
                className="form-control"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Full-Stack Engineer"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bengaluru, Hyderabad, Pune, Gurugram"
              />
            </div>
            <div>
              <label className="form-label">Years of Experience</label>
              <input
                type="number"
                min="0"
                max="50"
                className="form-control"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label className="form-label">Education / Degree</label>
            <input
              type="text"
              className="form-control"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              placeholder="e.g. B.S. in Computer Science"
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label className="form-label">About You / Professional Bio</label>
            <textarea
              rows="2"
              className="form-control"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief summary of your skills and projects..."
            />
          </div>

          {/* Technical Skills Box */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px', marginBottom: '18px' }}>
            <label className="form-label" style={{ color: '#16a34a', fontWeight: 800 }}>
              Technical Skills ({formData.skills.length})
            </label>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
              These skills determine your match percentage across job openings
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              {formData.skills.map((sk, idx) => (
                <span key={idx} className="skill-chip matched" style={{ fontSize: '0.75rem' }}>
                  {sk}
                  <button
                    type="button"
                    onClick={() => removeSkill(sk)}
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
                placeholder="Type skill and press Enter..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill(newSkill);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addSkill(newSkill)}
                className="btn btn-green btn-sm"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {POPULAR_SKILLS.map((s, idx) => {
                const has = formData.skills.some(sk => sk.toLowerCase() === s.toLowerCase());
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => has ? removeSkill(s) : addSkill(s)}
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
            <button type="submit" disabled={saving} className="btn btn-green btn-lg">
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
