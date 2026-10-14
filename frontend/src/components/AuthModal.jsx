import React, { useState } from 'react';
import { X, User, Lock, Mail, Briefcase, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
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
      setError(err.message || 'Authentication failed. Please verify email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content relative p-6 sm:p-8 max-w-md border-2 border-white/20 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-white hover:bg-red-500 hover:text-white transition-all"
        >
          <X size={18} />
        </button>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 mb-6">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`flex-1 pb-3 text-sm font-extrabold border-b-2 transition-all ${
              !isRegister ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`flex-1 pb-3 text-sm font-extrabold border-b-2 transition-all ${
              isRegister ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3.5 mb-4 rounded-xl bg-red-950/60 border-2 border-red-500 text-red-200 text-xs font-bold">
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
                  className={`py-2.5 px-3 rounded-xl font-black border text-center transition-all ${
                    formData.role === 'CANDIDATE' 
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30' 
                      : 'bg-slate-950 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'RECRUITER' })}
                  className={`py-2.5 px-3 rounded-xl font-black border text-center transition-all ${
                    formData.role === 'RECRUITER' 
                      ? 'bg-white text-slate-950 border-white shadow-md' 
                      : 'bg-slate-950 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  Recruiter / Employer
                </button>
              </div>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Alex Chen"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div>
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label">Password *</label>
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
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Acme Tech Innovations"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
          )}

          {isRegister && formData.role === 'CANDIDATE' && (
            <div className="space-y-2 pt-1">
              <label className="form-label text-emerald-400 font-extrabold flex items-center gap-1">
                <Sparkles size={13} />
                <span>Primary Skills (for instant matching)</span>
              </label>
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
                  className="btn btn-green text-xs font-bold shrink-0"
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1 p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/30">
                {formData.skills.map((skill, idx) => (
                  <span key={idx} className="skill-chip matched text-xs font-bold">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 text-slate-400 hover:text-red-400"
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
              className="btn btn-green w-full py-3 font-black text-sm shadow-lg shadow-emerald-500/30"
            >
              {loading ? 'Authenticating...' : isRegister ? 'Register & Enter Portal' : 'Sign In to Portal'}
            </button>
          </div>

          <div className="text-center text-xs text-slate-400 pt-2 font-medium">
            {isRegister ? (
              <span>Already registered? Click Sign In above.</span>
            ) : (
              <span>Quick switch between demo Candidate and Recruiter profiles in top right.</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
