import React, { useState } from 'react';
import { X, Save, Plus, Tag, Check } from 'lucide-react';
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
        className="modal-content relative p-6 sm:p-8 max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">Edit Candidate Profile & Skills</h2>
        <p className="text-xs text-slate-400 mb-6">
          Keep your skills and experience up to date to improve your algorithmic job match scores.
        </p>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label">Professional Headline / Title</label>
              <input
                type="text"
                className="form-control"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Full-Stack Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. San Francisco, CA or Remote"
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

          <div>
            <label className="form-label">Education / University</label>
            <input
              type="text"
              className="form-control"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              placeholder="e.g. B.S. in Computer Science"
            />
          </div>

          <div>
            <label className="form-label">Professional Summary & Bio</label>
            <textarea
              rows="3"
              className="form-control"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief summary of your background, passions, and achievements..."
            />
          </div>

          {/* Skill Tag Manager */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="form-label text-indigo-400 mb-0">
                Your Technical Skills ({formData.skills.length})
              </label>
              <span className="text-[11px] text-slate-500">Skills are used for job matching score</span>
            </div>

            {/* Custom Input */}
            <div className="flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Type a skill (e.g. Docker, MongoDB, React) and press Add"
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
                className="btn btn-primary btn-sm shrink-0"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {/* Current Skills list */}
            <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              {formData.skills.length === 0 ? (
                <span className="text-slate-500 text-xs italic">No skills listed yet. Add some below.</span>
              ) : (
                formData.skills.map((skill, idx) => (
                  <span key={idx} className="skill-chip matched text-xs">
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-rose-400 text-slate-400 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Suggested Skills to Add:
              </span>
              <div className="flex flex-wrap gap-1">
                {POPULAR_SKILLS.filter(s => !formData.skills.some(cur => cur.toLowerCase() === s.toLowerCase())).slice(0, 10).map((skill, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors flex items-center gap-1"
                  >
                    <Plus size={10} /> {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">GitHub URL</label>
              <input
                type="url"
                className="form-control"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="form-label">LinkedIn URL</label>
              <input
                type="url"
                className="form-control"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              <Save size={15} />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
