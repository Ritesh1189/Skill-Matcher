import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Building2, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  MapPin
} from 'lucide-react';
import { authApi } from '../services/api';

const POPULAR_SKILLS = [
  'Java', 'Spring Boot', 'React', 'MongoDB', 'SQL', 'Git', 'Docker',
  'AWS', 'TypeScript', 'Node.js', 'Python', 'REST APIs'
];

const INDIAN_LOCATIONS = [
  'Bengaluru, Karnataka',
  'Hyderabad, Telangana',
  'Pune, Maharashtra',
  'Gurugram, Delhi NCR',
  'Navi Mumbai, Maharashtra',
  'Chennai, Tamil Nadu',
  'Noida, Uttar Pradesh',
  'Mumbai, Maharashtra',
  'Remote (India)'
];

export default function AuthPage({ initialMode = 'login', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CANDIDATE', // 'CANDIDATE' | 'RECRUITER'
    title: '',
    company: '',
    location: 'Bengaluru, Karnataka',
    experienceYears: 2,
    skills: ['Java', 'React', 'Spring Boot', 'SQL'],
  });

  const [newSkillInput, setNewSkillInput] = useState('');

  const handleAddSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!formData.skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmed]
      }));
    }
    setNewSkillInput('');
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
    setSuccessMsg('');

    try {
      let res;
      if (mode === 'signup') {
        if (!formData.name.trim()) throw new Error('Please enter your full name');
        if (!formData.email.trim()) throw new Error('Please enter your email address');
        if (!formData.password || formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        if (formData.role === 'RECRUITER' && !formData.company.trim()) {
          throw new Error('Please enter your company name');
        }

        res = await authApi.register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          title: formData.title || (formData.role === 'CANDIDATE' ? 'Software Developer' : 'Talent Partner'),
          company: formData.company,
          location: formData.location || 'Bengaluru, Karnataka',
          skills: formData.role === 'CANDIDATE' ? formData.skills : [],
          experienceYears: formData.experienceYears || 0
        });

        setSuccessMsg('Account created successfully! Redirecting...');
      } else {
        if (!formData.email.trim() || !formData.password) {
          throw new Error('Please enter both your email and password');
        }

        res = await authApi.login({
          email: formData.email.trim(),
          password: formData.password,
        });

        setSuccessMsg('Login successful! Redirecting...');
      }

      if (res?.user) {
        setTimeout(() => {
          onAuthSuccess(res.user);
        }, 400);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '580px', width: '100%', margin: '20px auto 40px', padding: '0 16px' }}>
      
      {/* Centered Clean Card */}
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
          padding: '36px 32px',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div 
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#16a34a',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              boxShadow: '0 4px 14px rgba(22, 163, 74, 0.28)'
            }}
          >
            <CheckCircle2 size={28} />
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            {mode === 'login' ? 'Sign In to SkillMatch' : 'Create Free Account'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            {mode === 'login' 
              ? 'Access Indian employer vacancies and verified skill matching' 
              : 'Join to match your tech skills with top employers in India'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            background: '#f1f5f9', 
            borderRadius: '10px', 
            padding: '4px',
            marginBottom: '24px'
          }}
        >
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
            style={{
              padding: '10px',
              fontSize: '0.9rem',
              fontWeight: 800,
              background: mode === 'login' ? '#ffffff' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: mode === 'login' ? '#0f172a' : '#64748b',
              cursor: 'pointer',
              boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); }}
            style={{
              padding: '10px',
              fontSize: '0.9rem',
              fontWeight: 800,
              background: mode === 'signup' ? '#ffffff' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: mode === 'signup' ? '#0f172a' : '#64748b',
              cursor: 'pointer',
              boxShadow: mode === 'signup' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Register Free
          </button>
        </div>

        {/* Alert Messages */}
        {error && (
          <div 
            style={{ 
              padding: '12px 16px', 
              borderRadius: '8px', 
              background: '#fef2f2', 
              border: '1px solid #fca5a5', 
              color: '#b91c1c', 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              marginBottom: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div 
            style={{ 
              padding: '12px 16px', 
              borderRadius: '8px', 
              background: '#ecfdf5', 
              border: '1px solid #86efac', 
              color: '#166534', 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              marginBottom: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit}>
          
          {/* Sign Up: Role Selection */}
          {mode === 'signup' && (
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>I am registering as:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'CANDIDATE' })}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: formData.role === 'CANDIDATE' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                    background: formData.role === 'CANDIDATE' ? '#ecfdf5' : '#ffffff',
                    color: formData.role === 'CANDIDATE' ? '#15803d' : '#475569',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <User size={16} />
                  <span>Job Seeker</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'RECRUITER' })}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: formData.role === 'RECRUITER' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                    background: formData.role === 'RECRUITER' ? '#ecfdf5' : '#ffffff',
                    color: formData.role === 'RECRUITER' ? '#15803d' : '#475569',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Building2 size={16} />
                  <span>Employer / Recruiter</span>
                </button>
              </div>
            </div>
          )}

          {/* Full Name (Sign Up only) */}
          {mode === 'signup' && (
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                  placeholder="e.g. Rohan Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '38px' }}
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '18px' }}>
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                style={{ paddingLeft: '38px', paddingRight: '40px' }}
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Location in Sign Up (Indian Tech Cities) */}
          {mode === 'signup' && (
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Location (Indian Tech Hub) *</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <select
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                >
                  {INDIAN_LOCATIONS.map((loc, idx) => (
                    <option key={idx} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Candidate-specific fields in Sign Up */}
          {mode === 'signup' && formData.role === 'CANDIDATE' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label">Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Java Full-Stack Engineer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    className="form-control"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              {/* Skills Selector */}
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px', marginBottom: '20px' }}>
                <label className="form-label" style={{ color: '#16a34a', fontWeight: 800 }}>
                  Your Core Skills (for Automatic Matching)
                </label>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
                  Select or add your technical proficiencies:
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                  {formData.skills.map((sk, idx) => (
                    <span key={idx} className="skill-chip matched" style={{ fontSize: '0.75rem' }}>
                      {sk}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(sk)}
                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', marginLeft: '4px', fontWeight: 'bold' }}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type a skill..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(newSkillInput);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(newSkillInput)}
                    className="btn btn-green btn-sm"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {POPULAR_SKILLS.map((sk, idx) => {
                    const has = formData.skills.some(s => s.toLowerCase() === sk.toLowerCase());
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => has ? handleRemoveSkill(sk) : handleAddSkill(sk)}
                        className="skill-chip"
                        style={{
                          background: has ? '#ecfdf5' : '#ffffff',
                          color: has ? '#15803d' : '#64748b',
                          borderColor: has ? '#86efac' : '#e2e8f0',
                          cursor: 'pointer'
                        }}
                      >
                        {has ? '✓ ' : '+ '}{sk}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Employer-specific field in Sign Up */}
          {mode === 'signup' && formData.role === 'RECRUITER' && (
            <div style={{ marginBottom: '18px' }}>
              <label className="form-label">Company Name *</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                  placeholder="e.g. Tata Consultancy Services, Infosys, Swiggy"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div style={{ marginTop: '16px' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-green btn-lg"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 800, justifyContent: 'center' }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In to Portal' : 'Create Free Account'}
            </button>
          </div>

          {/* Footer toggle prompt */}
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#64748b' }}>
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Register Free
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sign In
                </button>
              </span>
            )}
          </div>

        </form>

      </div>

    </div>
  );
}
