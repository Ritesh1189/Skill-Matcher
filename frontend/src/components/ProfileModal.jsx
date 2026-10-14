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
        className="modal-content relative p-6 sm:p-8 max-w-2xl border-2 border-white/20 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-white hover:bg-red-500 hover:text-white transition-all"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <User size={18} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Edit Candidate Profile & Skills</h2>
        </div>
        <p className="text-xs text-slate-300 mb-5">
          Updating your skills immediately recomputes your match percentages across all listed job openings.
        </p>

        {error && (
          <div className="p-3.5 mb-4 rounded-xl bg-red-950/60 border-2 border-red-500 text-red-200 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="form-label">Professional Headline / Title *</label>
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
            <label className="form-label">Education / University Degree</label>
            <input
              type="text"
              className="form-control"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              placeholder="e.g. B.S. in Computer Science, Stanford University"
            />
          </div>

          <div>
            <label className="form-label">Professional Summary / Bio</label>
            <textarea
              rows="3"
              className="form-control"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief summary of your background, architectural experience, and career goals..."
            />
          </div>

          {/* SKILLS SECTION: Green highlighted with 1-click toggles */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="form-label text-emerald-400 font-extrabold flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>Technical Skills ({formData.skills.length})</span>
                </label>
                <p className="text-[11px] text-slate-300">
                  These skills are cross-referenced with job requirements for automated scoring.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[36px]">
              {formData.skills.map((skill, index) => (
                <span key={index} className="skill-chip matched text-xs font-bold">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-400 p-0.5 rounded-full"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Type new skill and press Enter (e.g. Kafka, Redis, Vue.js)..."
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
                className="btn btn-green text-xs font-bold shrink-0"
              >
                <Plus size={14} />
                Add
              </button>
            </div>

            {/* Quick Skills Selector */}
            <div>
              <span className="text-[11px] text-slate-300 font-semibold block mb-1">Click to toggle skills:</span>
              <div className="flex flex-wrap gap-1">
                {POPULAR_SKILLS.map((s, idx) => {
                  const has = formData.skills.some(sk => sk.toLowerCase() === s.toLowerCase());
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => has ? removeSkill(s) : addSkill(s)}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all border ${
                        has 
                          ? 'bg-emerald-500 text-white border-emerald-400' 
                          : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {has ? '✓ ' : '+ '}{s}
                    </button>
                  );
                })}
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
                placeholder="https://github.com/yourhandle"
              />
            </div>
            <div>
              <label className="form-label">LinkedIn URL</label>
              <input
                type="url"
                className="form-control"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/yourhandle"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="btn btn-secondary font-bold">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-green font-black sm:btn-lg">
              <Save size={16} />
              <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
