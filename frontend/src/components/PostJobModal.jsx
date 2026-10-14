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
      setError('At least one required skill must be added for algorithmic match calculation');
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
            <Briefcase size={18} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Post New Job Opening</h2>
        </div>
        <p className="text-xs text-slate-300 mb-5">
          Specify technical criteria. Candidate profiles will be scored against these requirements using deterministic skill overlap.
        </p>

        {error && (
          <div className="p-3.5 mb-4 rounded-xl bg-red-950/60 border-2 border-red-500 text-red-200 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Remote or City"
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
                placeholder="e.g. $100k - $130k"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Detailed Job Description *</label>
            <textarea
              rows="4"
              className="form-control"
              placeholder="Outline project responsibilities, team architecture, day-to-day duties..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* REQUIRED SKILLS (Used directly for matching) */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="form-label text-emerald-400 font-extrabold flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>Mandatory Required Skills (Match Algorithm Criteria) *</span>
                </label>
                <p className="text-[11px] text-slate-300">
                  Each skill forms the matching baseline: ({formData.requiredSkills.length} total required)
                </p>
              </div>
            </div>

            {/* Current Required Skills */}
            <div className="flex flex-wrap gap-1.5 min-h-[36px]">
              {formData.requiredSkills.map((skill, index) => (
                <span key={index} className="skill-chip matched text-xs font-bold">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeRequiredSkill(skill)}
                    className="hover:text-red-400 p-0.5 rounded-full"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Custom Required Skill Input */}
            <div className="flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Add custom required skill (e.g. Redis, Kafka, GraphQL)..."
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
                className="btn btn-green text-xs font-bold shrink-0"
              >
                <Plus size={14} />
                Add
              </button>
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[11px] text-slate-300 font-semibold block mb-1">Click to toggle requirements:</span>
              <div className="flex flex-wrap gap-1">
                {POPULAR_REQUIREMENTS.map((s, idx) => {
                  const has = formData.requiredSkills.some(rs => rs.toLowerCase() === s.toLowerCase());
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => has ? removeRequiredSkill(s) : addRequiredSkill(s)}
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

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="btn btn-secondary font-bold">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-green font-black sm:btn-lg">
              <Plus size={16} />
              <span>{submitting ? 'Publishing Job...' : 'Publish Job Listing'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
