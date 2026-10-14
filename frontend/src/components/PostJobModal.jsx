import React, { useState } from 'react';
import { X, Plus, Briefcase, Check } from 'lucide-react';
import { jobsApi } from '../services/api';

const POPULAR_REQUIREMENTS = [
  'Java', 'Spring Boot', 'React', 'MongoDB', 'SQL', 'Git', 'Docker',
  'AWS', 'TypeScript', 'Kubernetes', 'REST APIs', 'Node.js', 'Python', 'CI/CD'
];

export default function PostJobModal({ recruiter, onClose, onJobCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    company: recruiter?.company || '',
    location: 'Remote',
    type: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: '$90,000 - $120,000 / yr',
    description: '',
    requiredSkills: ['Java', 'React', 'SQL', 'Git'],
    niceToHaveSkills: ['Spring Boot', 'Docker'],
    recruiterId: recruiter?.id || '',
    recruiterEmail: recruiter?.email || '',
    recruiterName: recruiter?.name || '',
  });

  const [newRequiredSkill, setNewRequiredSkill] = useState('');
  const [newBonusSkill, setNewBonusSkill] = useState('');
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

  const addBonusSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!formData.niceToHaveSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        niceToHaveSkills: [...prev.niceToHaveSkills, trimmed]
      }));
    }
    setNewBonusSkill('');
  };

  const removeBonusSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      niceToHaveSkills: prev.niceToHaveSkills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.requiredSkills.length === 0) {
      setError('At least one required skill must be added for match calculation');
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
        className="modal-content relative p-6 sm:p-8 max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Briefcase size={20} className="text-purple-400" />
          <h2 className="text-xl font-bold text-white">Post a New Job Opportunity</h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Define role responsibilities and required skills. Our algorithm will score candidates against these requirements.
        </p>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Job Title</label>
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
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Remote or Austin, TX"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label">Employment Type</label>
              <select
                className="form-control cursor-pointer"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="form-label">Experience Level</label>
              <select
                className="form-control cursor-pointer"
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Compensation / Salary Range</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. $100,000 - $130,000 / year"
              value={formData.salaryRange}
              onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Job Description</label>
            <textarea
              rows="4"
              className="form-control"
              placeholder="Describe the role responsibilities, team impact, and engineering challenges..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Required Skills (Critical for Matching) */}
          <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="form-label text-indigo-400 mb-0">
                Required Skills for Overlap Matching ({formData.requiredSkills.length})
              </label>
              <span className="text-[11px] text-slate-500">Each skill counts towards 100% score</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Add required skill (e.g. Java, React, SQL, Git)"
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
                className="btn btn-primary btn-sm shrink-0"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              {formData.requiredSkills.map((skill, idx) => (
                <span key={idx} className="skill-chip matched text-xs">
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeRequiredSkill(skill)}
                    className="hover:text-rose-400 text-slate-400 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Suggested Requirements:
              </span>
              <div className="flex flex-wrap gap-1">
                {POPULAR_REQUIREMENTS.filter(s => !formData.requiredSkills.includes(s)).slice(0, 8).map((skill, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => addRequiredSkill(skill)}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors flex items-center gap-1"
                  >
                    <Plus size={10} /> {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              <Plus size={15} />
              <span>{submitting ? 'Publishing...' : 'Publish Job Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
