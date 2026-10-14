import React, { useState } from 'react';
import { X, User, Lock, Mail, Briefcase, Plus, Sparkles } from 'lucide-react';
import { authApi } from '../services/api';

export default function AuthModal({ onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CANDIDATE',
    title: '',
    company: '',
    location: '',
    skills: ['Java', 'React'],
  });

  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let res;
      if (isRegister) {
        res = await authApi.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          title: formData.title || (formData.role === 'CANDIDATE' ? 'Software Engineer' : 'Talent Partner'),
          company: formData.company,
          location: formData.location || 'Remote',
          skills: formData.role === 'CANDIDATE' ? formData.skills : [],
        });
      } else {
        res = await authApi.login({
          email: formData.email,
          password: formData.password,
        });
      }

      if (res?.user) {
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content relative p-6 sm:p-8 max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${
              !isRegister ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${
              isRegister ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="form-label">I am joining as:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'CANDIDATE' })}
                  className={`py-2 px-3 rounded-lg font-bold border text-center transition-all ${
                    formData.role === 'CANDIDATE' 
                      ? 'bg-indigo-600/30 border-indigo-500 text-white' 
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Job Seeker / Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'RECRUITER' })}
                  className={`py-2 px-3 rounded-lg font-bold border text-center transition-all ${
                    formData.role === 'RECRUITER' 
                      ? 'bg-purple-600/30 border-purple-500 text-white' 
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Recruiter / Employer
                </button>
              </div>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Alex Morgan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {isRegister && formData.role === 'RECRUITER' && (
            <div>
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. CloudScale Innovations"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
          )}

          {isRegister && formData.role === 'CANDIDATE' && (
            <div className="space-y-2 pt-1">
              <label className="form-label">Primary Skills (for matching)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Python, Docker, Spring Boot"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="btn btn-sm btn-secondary"
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                {formData.skills.map((skill, idx) => (
                  <span key={idx} className="skill-chip matched text-xs">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 text-slate-400 hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-2.5 font-bold"
            >
              {loading ? 'Please wait...' : isRegister ? 'Register & Enter Portal' : 'Sign In to Portal'}
            </button>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            {isRegister ? (
              <span>Already have an account? Switch to Sign In above.</span>
            ) : (
              <span>Tip: You can also use the Quick Switch dropdown in the navbar.</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
