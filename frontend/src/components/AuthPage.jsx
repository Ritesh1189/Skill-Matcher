import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Briefcase, 
  Building2, 
  Plus, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  TrendingUp, 
  Users,
  ArrowRight
} from 'lucide-react';
import { authApi } from '../services/api';

const POPULAR_SKILLS = [
  'Java', 'Spring Boot', 'React', 'MongoDB', 'SQL', 'Git', 'Docker',
  'AWS', 'TypeScript', 'Node.js', 'Python', 'Kubernetes', 'REST APIs'
];

export default function AuthPage({ initialMode = 'login', onAuthSuccess, onNavigateToJobs }) {
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
    location: 'Remote',
    experienceYears: 2,
    skills: ['Java', 'React', 'Git'],
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

  // Quick Demo Auto-Fill
  const fillDemo = (type) => {
    setError('');
    if (type === 'candidate') {
      setMode('login');
      setFormData(prev => ({
        ...prev,
        email: 'alex.morgan@example.com',
        password: 'password123'
      }));
    } else if (type === 'recruiter') {
      setMode('login');
      setFormData(prev => ({
        ...prev,
        email: 'emma.recruiter@cloudscale.io',
        password: 'recruiter123'
      }));
    }
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
          throw new Error('Please enter your company or organization name');
        }

        res = await authApi.register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          title: formData.title || (formData.role === 'CANDIDATE' ? 'Software Developer' : 'Talent Partner'),
          company: formData.company,
          location: formData.location || 'Remote',
          skills: formData.role === 'CANDIDATE' ? formData.skills : [],
          experienceYears: formData.experienceYears || 0
        });

        setSuccessMsg('Account created successfully! Welcome to SkillMatch.');
      } else {
        if (!formData.email.trim() || !formData.password) {
          throw new Error('Please enter both email and password');
        }

        res = await authApi.login({
          email: formData.email.trim(),
          password: formData.password,
        });

        setSuccessMsg('Login successful! Redirecting to your dashboard...');
      }

      if (res?.user) {
        setTimeout(() => {
          onAuthSuccess(res.user);
        }, 600);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1060px', margin: '30px auto 60px', padding: '0 20px' }}>
      
      {/* Outer Card with Naukri/Indeed 2-Column Split */}
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          minHeight: '620px'
        }}
      >
        
        {/* LEFT COLUMN: Naukri Trust & Benefits Banner */}
        <div 
          style={{
            background: 'linear-gradient(180deg, #ecfdf5 0%, #f0fdf4 100%)',
            borderRight: '1px solid #86efac',
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#16a34a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
                }}
              >
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  Skill<span style={{ color: '#16a34a' }}>Match</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Naukri & Indeed Standard</div>
              </div>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '12px' }}>
              {mode === 'login' ? 'Welcome Back to Transparent Hiring' : 'Join India’s #1 Skill Match Job Portal'}
            </h2>

            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, marginBottom: '28px' }}>
              Connect your verified technical proficiencies directly with verified job requirements. No opaque keyword filters.
            </p>

            {/* Benefit Checkpoints */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <Sparkles size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Automated Overlap Formula</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Deterministic percentage scoring: (Matched / Required) &times; 100.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <TrendingUp size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Real-Time Application Tracking</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Monitor your review, shortlist, and interview scheduling stages.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Verified Employers</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Direct pipelines to talent leaders at CloudScale, Nexus, and more.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Demo Credentials Widget */}
          <div style={{ background: '#ffffff', border: '1px solid #86efac', borderRadius: '10px', padding: '14px', marginTop: '24px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '8px' }}>
              One-Click Demo Accounts:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                type="button"
                onClick={() => fillDemo('candidate')}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem'
                }}
              >
                <div>
                  <strong style={{ color: '#0f172a' }}>Alex Morgan</strong> (Candidate)
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Java, React, Git (75% match)</div>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16a34a' }}>Fill &rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('recruiter')}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem'
                }}
              >
                <div>
                  <strong style={{ color: '#0f172a' }}>Emma Watson</strong> (Recruiter)
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Talent Lead @ CloudScale</div>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16a34a' }}>Fill &rarr;</span>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Login / Signup Form */}
        <div style={{ padding: '40px 44px' }}>
          
          {/* Top Tab Switcher (Naukri style) */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '28px' }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              style={{
                paddingBottom: '14px',
                paddingRight: '28px',
                fontSize: '1rem',
                fontWeight: 800,
                background: 'none',
                border: 'none',
                borderBottom: mode === 'login' ? '3px solid #16a34a' : '3px solid transparent',
                color: mode === 'login' ? '#16a34a' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); }}
              style={{
                paddingBottom: '14px',
                paddingRight: '28px',
                fontSize: '1rem',
                fontWeight: 800,
                background: 'none',
                border: 'none',
                borderBottom: mode === 'signup' ? '3px solid #16a34a' : '3px solid transparent',
                color: mode === 'signup' ? '#16a34a' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Register for Free
            </button>
          </div>

          {/* Error & Success Feedback Alerts */}
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

          {/* Form */}
          <form onSubmit={handleSubmit}>
            
            {/* If Sign Up, Choose Role First (Job Seeker vs Employer) */}
            {mode === 'signup' && (
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">I want to register as:</label>
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
                      gap: '8px',
                      transition: 'all 0.15s'
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
                      gap: '8px',
                      transition: 'all 0.15s'
                    }}
                  >
                    <Building2 size={16} />
                    <span>Employer / Recruiter</span>
                  </button>
                </div>
              </div>
            )}

            {/* Name (Sign Up only) */}
            {mode === 'signup' && (
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '38px' }}
                    placeholder="e.g. Rahul Sharma or Priya Verma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Email ID *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password *</label>
                {mode === 'login' && (
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, cursor: 'pointer' }}>
                    Forgot Password?
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingLeft: '38px', paddingRight: '40px' }}
                  placeholder={mode === 'signup' ? 'Minimum 6 characters' : 'Enter your password'}
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

            {/* Candidate-specific fields in Sign Up */}
            {mode === 'signup' && formData.role === 'CANDIDATE' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label className="form-label">Professional Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Java Backend Engineer"
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

                {/* Candidate Skills Tagger */}
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px', marginBottom: '20px' }}>
                  <label className="form-label" style={{ color: '#16a34a', fontWeight: 800 }}>
                    Core Technical Skills (Used for Match Scoring)
                  </label>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
                    Select your primary skills to instantly compute match percentages with jobs.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                    {formData.skills.map((sk, idx) => (
                      <span key={idx} className="skill-chip matched" style={{ fontSize: '0.75rem' }}>
                        {sk}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(sk)}
                          style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', marginLeft: '4px' }}
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
                      placeholder="Type custom skill..."
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

            {/* Recruiter-specific fields in Sign Up */}
            {mode === 'signup' && formData.role === 'RECRUITER' && (
              <div style={{ marginBottom: '18px' }}>
                <label className="form-label">Company / Organization Name *</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '38px' }}
                    placeholder="e.g. CloudScale Innovations or Tata Consultancy"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div style={{ marginTop: '10px' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-green btn-lg"
                style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 800 }}
              >
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In to Portal' : 'Create Free Account'}
              </button>
            </div>

            {/* Switch Mode Prompt below button */}
            <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.85rem', color: '#64748b' }}>
              {mode === 'login' ? (
                <span>
                  New to SkillMatch?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setError(''); }}
                    style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Register now
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(''); }}
                    style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Login here
                  </button>
                </span>
              )}
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
