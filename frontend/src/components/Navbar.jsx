import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  User, 
  FileText, 
  PlusCircle, 
  ChevronDown, 
  CheckCircle2,
  Building2,
  LogIn,
  LogOut,
  UserPlus,
  BookOpen,
  ExternalLink
} from 'lucide-react';

export default function Navbar({ 
  currentUser, 
  activeTab, 
  setActiveTab, 
  onOpenProfile, 
  onOpenPostJob,
  onLogout 
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isCandidate = currentUser?.role === 'CANDIDATE';
  const isRecruiter = currentUser?.role === 'RECRUITER';

  return (
    <header className="naukri-navbar">
      <div className="naukri-nav-container">
        
        {/* Brand Logo */}
        <div 
          className="naukri-brand"
          onClick={() => setActiveTab('jobs')}
          style={{ cursor: 'pointer' }}
        >
          <div className="naukri-logo-icon">
            <CheckCircle2 size={24} />
          </div>
          <div className="naukri-brand-text">
            <h1>Skill<span>Match</span></h1>
            <div className="naukri-brand-sub">Job Portal</div>
          </div>
        </div>

        {/* Center Nav Links - Simple & Clear */}
        <nav className="naukri-nav-links">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`naukri-nav-item ${activeTab === 'jobs' ? 'active' : ''}`}
          >
            <Briefcase size={16} />
            <span>Find Jobs</span>
          </button>

          <button
            onClick={() => setActiveTab('matcher')}
            className={`naukri-nav-item ${activeTab === 'matcher' ? 'active' : ''}`}
          >
            <Sparkles size={16} />
            <span>Skill Matcher</span>
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

          <a 
            href="http://localhost:8080/swagger-ui.html"
            target="_blank"
            rel="noopener noreferrer"
            className="naukri-nav-item"
            title="Swagger API Documentation"
          >
            <BookOpen size={16} />
            <span>API Docs</span>
            <ExternalLink size={12} />
          </a>
        </nav>

        {/* Right Action & Profile Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* If NOT logged in: Show clean Sign In & Register buttons */}
          {!currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => setActiveTab('auth')}
                className="btn btn-white btn-sm"
                style={{ padding: '8px 16px', fontWeight: 700 }}
              >
                <LogIn size={15} />
                <span>Log In</span>
              </button>
              <button 
                onClick={() => setActiveTab('auth')}
                className="btn btn-green btn-sm"
                style={{ padding: '8px 18px', fontWeight: 700 }}
              >
                <UserPlus size={15} />
                <span>Register</span>
              </button>
            </div>
          ) : (
            /* If logged in: Show role specific action and user profile */
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

              {/* User Dropdown */}
              <div style={{ position: 'relative' }}>
                <div 
                  className="naukri-user-pill"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="naukri-avatar">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                      {currentUser?.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: isRecruiter ? '#16a34a' : '#2563eb', fontWeight: 700 }}>
                      {isRecruiter ? 'Employer' : 'Job Seeker'}
                    </div>
                  </div>
                  <ChevronDown size={14} style={{ color: '#94a3b8' }} />
                </div>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '115%',
                      right: 0,
                      width: '240px',
                      background: '#ffffff',
                      borderRadius: '10px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                      border: '1px solid #e2e8f0',
                      padding: '14px',
                      zIndex: 100
                    }}
                  >
                    <div style={{ paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{currentUser?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', wordBreak: 'break-all' }}>{currentUser?.email}</div>
                      <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>
                        {currentUser?.title || (isRecruiter ? currentUser?.company : 'Technical Professional')}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <button
                        onClick={() => {
                          if (onOpenProfile) onOpenProfile();
                          setDropdownOpen(false);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', justifyContent: 'flex-start' }}
                      >
                        <User size={14} />
                        <span>View / Edit Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          if (onLogout) onLogout();
                          setDropdownOpen(false);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', justifyContent: 'flex-start', color: '#dc2626' }}
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
