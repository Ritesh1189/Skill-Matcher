import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  User, 
  FileText, 
  BookOpen, 
  PlusCircle, 
  Users, 
  ChevronDown, 
  ExternalLink,
  CheckCircle2,
  Building2,
  LogIn,
  LogOut,
  UserPlus
} from 'lucide-react';

export default function Navbar({ 
  currentUser, 
  onSwitchUser, 
  activeTab, 
  setActiveTab, 
  onOpenProfile, 
  onOpenPostJob,
  onOpenAuth,
  onLogout,
  systemHealth
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const demoAccounts = [
    { id: 'alex', name: 'Alex Morgan', role: 'CANDIDATE', title: 'Full Stack Developer', email: 'alex.morgan@example.com' },
    { id: 'sarah', name: 'Sarah Chen', role: 'CANDIDATE', title: 'Senior Frontend Engineer', email: 'sarah.chen@example.com' },
    { id: 'emma', name: 'Emma Watson', role: 'RECRUITER', title: 'Tech Talent Lead', email: 'emma.recruiter@cloudscale.io' }
  ];

  const isCandidate = currentUser?.role === 'CANDIDATE';
  const isRecruiter = currentUser?.role === 'RECRUITER';

  return (
    <header className="naukri-navbar">
      <div className="naukri-nav-container">
        
        {/* Brand Logo (Naukri/Indeed style) */}
        <div 
          className="naukri-brand"
          onClick={() => setActiveTab('jobs')}
        >
          <div className="naukri-logo-icon">
            <CheckCircle2 size={24} />
          </div>
          <div className="naukri-brand-text">
            <h1>Skill<span>Match</span></h1>
            <div className="naukri-brand-sub">Skill-Based Job Portal</div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="naukri-nav-links">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`naukri-nav-item ${activeTab === 'jobs' ? 'active' : ''}`}
          >
            <Briefcase size={16} />
            <span>Jobs</span>
          </button>

          <button
            onClick={() => setActiveTab('matcher')}
            className={`naukri-nav-item ${activeTab === 'matcher' ? 'active' : ''}`}
          >
            <Sparkles size={16} />
            <span>Skill Matcher</span>
          </button>

          <button
            onClick={() => setActiveTab('candidates')}
            className={`naukri-nav-item ${activeTab === 'candidates' ? 'active' : ''}`}
          >
            <Users size={16} />
            <span>Candidates</span>
          </button>

          {isCandidate && (
            <button
              onClick={() => setActiveTab('applications')}
              className={`naukri-nav-item ${activeTab === 'applications' ? 'active' : ''}`}
            >
              <FileText size={16} />
              <span>My Applications</span>
            </button>
          )}

          {isRecruiter && (
            <button
              onClick={() => setActiveTab('recruiter')}
              className={`naukri-nav-item ${activeTab === 'recruiter' ? 'active' : ''}`}
            >
              <Building2 size={16} />
              <span>Recruiter Dashboard</span>
            </button>
          )}

          {/* Dedicated Login & Signup Tab */}
          <button
            onClick={() => setActiveTab('auth')}
            className={`naukri-nav-item ${activeTab === 'auth' ? 'active' : ''}`}
          >
            <LogIn size={16} />
            <span>Login / Register</span>
          </button>

          <a 
            href="http://localhost:8080/swagger-ui.html"
            target="_blank"
            rel="noopener noreferrer"
            className="naukri-nav-item"
            title="Swagger API Documentation"
          >
            <BookOpen size={16} />
            <span>Swagger API</span>
            <ExternalLink size={12} />
          </a>
        </nav>

        {/* Right Action & Profile Area */}
        <div className="flex items-center gap-3">
          
          {/* 1-Click Role Switcher Pill */}
          <div className="naukri-role-selector">
            <button
              onClick={() => onSwitchUser('alex.morgan@example.com')}
              className={`naukri-role-btn ${isCandidate ? 'active' : ''}`}
              title="Switch to Candidate view"
            >
              Job Seeker
            </button>
            <button
              onClick={() => onSwitchUser('emma.recruiter@cloudscale.io')}
              className={`naukri-role-btn ${isRecruiter ? 'active' : ''}`}
              title="Switch to Recruiter view"
            >
              Recruiter
            </button>
          </div>

          {/* Recruiter Post Job or My Skills or Guest Sign In */}
          {!currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => setActiveTab('auth')}
                className="btn btn-white btn-sm"
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>
              <button 
                onClick={() => setActiveTab('auth')}
                className="btn btn-green btn-sm"
              >
                <UserPlus size={15} />
                <span>Register</span>
              </button>
            </div>
          ) : (
            <>
              {isRecruiter ? (
                <button 
                  onClick={onOpenPostJob}
                  className="btn btn-green btn-sm"
                >
                  <PlusCircle size={15} />
                  <span>Post a Job</span>
                </button>
              ) : (
                <button 
                  onClick={onOpenProfile}
                  className="btn btn-white btn-sm"
                >
                  <User size={15} />
                  <span>My Skills</span>
                </button>
              )}

              {/* User Profile Avatar with Dropdown */}
              <div style={{ position: 'relative' }}>
                <div 
                  className="naukri-user-pill"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="naukri-avatar">
                    {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                      {currentUser?.name || 'Guest User'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      {currentUser?.role === 'RECRUITER' ? 'Recruiter' : 'Candidate'}
                    </div>
                  </div>
                  <ChevronDown size={14} style={{ color: '#94a3b8' }} />
                </div>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '110%',
                      right: 0,
                      width: '280px',
                      background: '#ffffff',
                      borderRadius: '10px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                      border: '1px solid #e2e8f0',
                      padding: '14px',
                      zIndex: 100
                    }}
                  >
                    <div style={{ paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{currentUser?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{currentUser?.email}</div>
                      <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>
                        {currentUser?.title || 'Professional'}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Switch Test Persona
                    </div>

                    {demoAccounts.map(acc => (
                      <button
                        key={acc.id}
                        onClick={() => {
                          onSwitchUser(acc.email);
                          setDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 8px',
                          borderRadius: '6px',
                          background: currentUser?.email === acc.email ? '#ecfdf5' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          marginBottom: '2px'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>{acc.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{acc.title}</div>
                        </div>
                        <span style={{ 
                          fontSize: '0.65rem', 
                          fontWeight: 700, 
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          background: acc.role === 'CANDIDATE' ? '#dcfce7' : '#fee2e2',
                          color: acc.role === 'CANDIDATE' ? '#166534' : '#991b1b'
                        }}>
                          {acc.role}
                        </span>
                      </button>
                    ))}

                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <button
                        onClick={() => {
                          setActiveTab('auth');
                          setDropdownOpen(false);
                        }}
                        className="btn btn-green btn-sm"
                        style={{ width: '100%', justifyContent: 'flex-start' }}
                      >
                        <LogIn size={14} />
                        <span>Open Login & Signup Page</span>
                      </button>

                      <button
                        onClick={() => {
                          if (onLogout) onLogout();
                          setDropdownOpen(false);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', justifyContent: 'flex-start', color: '#b91c1c' }}
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

        </div>

      </div>
    </header>
  );
}
