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
          title: formData.title || (formData.role === 'CANDIDATE' ? 'Software Engineer' : 'Talent Lead'),
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
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
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

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            style={{
              flex: 1,
              paddingBottom: '12px',
              fontSize: '0.9rem',
              fontWeight: 800,
              background: 'none',
              border: 'none',
              borderBottom: !isRegister ? '2px solid #16a34a' : '2px solid transparent',
              color: !isRegister ? '#16a34a' : '#64748b',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            style={{
              flex: 1,
              paddingBottom: '12px',
              fontSize: '0.9rem',
              fontWeight: 800,
              background: 'none',
              border: 'none',
              borderBottom: isRegister ? '2px solid #16a34a' : '2px solid transparent',
              color: isRegister ? '#16a34a' : '#64748b',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '6px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '0.8rem', fontWeight: 700, marginBottom: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: '12px' }}>
              <label className="form-label">I am a:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'CANDIDATE' })}
                  className="btn btn-sm"
                  style={{
                    background: formData.role === 'CANDIDATE' ? '#16a34a' : '#ffffff',
                    color: formData.role === 'CANDIDATE' ? '#ffffff' : '#475569',
                    border: '1px solid',
                    borderColor: formData.role === 'CANDIDATE' ? '#16a34a' : '#cbd5e1'
                  }}
                >
                  Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'RECRUITER' })}
                  className="btn btn-sm"
                  style={{
                    background: formData.role === 'RECRUITER' ? '#16a34a' : '#ffffff',
                    color: formData.role === 'RECRUITER' ? '#ffffff' : '#475569',
                    border: '1px solid',
                    borderColor: formData.role === 'RECRUITER' ? '#16a34a' : '#cbd5e1'
                  }}
                >
                  Employer
                </button>
              </div>
            </div>
          )}

          {isRegister && (
            <div style={{ marginBottom: '12px' }}>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div style={{ marginBottom: '12px' }}>
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

          <div style={{ marginBottom: '14px' }}>
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
            <div style={{ marginBottom: '12px' }}>
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Acme Tech Solutions"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-green w-full btn-lg"
            >
              {loading ? 'Authenticating...' : isRegister ? 'Register & Continue' : 'Sign In to Portal'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
