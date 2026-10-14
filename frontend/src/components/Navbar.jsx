import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  User, 
  FileText, 
  BookOpen, 
  PlusCircle, 
  Users, 
  CheckCircle, 
  ChevronDown, 
  LogOut, 
  Settings, 
  ExternalLink,
  Layers
} from 'lucide-react';

export default function Navbar({ 
  currentUser, 
  onSwitchUser, 
  activeTab, 
  setActiveTab, 
  onOpenProfile, 
  onOpenPostJob,
  onOpenAuth,
  systemHealth
}) {
  const [userDropdown, setUserDropdown] = useState(false);

  const demoAccounts = [
    { id: 'alex', name: 'Alex Morgan', role: 'CANDIDATE', title: 'Full Stack Developer', email: 'alex.morgan@example.com' },
    { id: 'sarah', name: 'Sarah Chen', role: 'CANDIDATE', title: 'Senior Frontend Engineer', email: 'sarah.chen@example.com' },
    { id: 'emma', name: 'Emma Watson', role: 'RECRUITER', title: 'Talent Partner @ CloudScale', email: 'emma.recruiter@cloudscale.io' },
    { id: 'michael', name: 'Michael Scott', role: 'RECRUITER', title: 'Head of Talent @ Nexus', email: 'michael.hr@nexustech.com' }
  ];

  const isCandidate = currentUser?.role === 'CANDIDATE';
  const isRecruiter = currentUser?.role === 'RECRUITER';

  return (
    <nav className="glass-panel sticky top-0 z-50 px-4 md:px-8 py-3 mb-6 border-b border-slate-800/80" style={{ borderRadius: 0 }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('jobs')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-all">
            <Briefcase size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                SkillMatch
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Smart Match Engine • Spring Boot & Mongo</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`btn btn-sm ${activeTab === 'jobs' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Briefcase size={15} />
            <span>Browse Jobs</span>
          </button>

          <button
            onClick={() => setActiveTab('matcher')}
            className={`btn btn-sm ${activeTab === 'matcher' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Sparkles size={15} className="text-amber-400" />
            <span>Skill Matcher</span>
          </button>

          <button
            onClick={() => setActiveTab('candidates')}
            className={`btn btn-sm ${activeTab === 'candidates' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Users size={15} />
            <span>Candidates</span>
          </button>

          {isCandidate && (
            <button
              onClick={() => setActiveTab('applications')}
              className={`btn btn-sm ${activeTab === 'applications' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <FileText size={15} />
              <span>My Applications</span>
            </button>
          )}

          {isRecruiter && (
            <button
              onClick={() => setActiveTab('recruiter')}
              className={`btn btn-sm ${activeTab === 'recruiter' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Layers size={15} />
              <span>Recruiter Hub</span>
            </button>
          )}

          {/* Swagger UI link */}
          <a
            href="http://localhost:8080/swagger-ui.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-primary hidden lg:inline-flex"
            title="Open Swagger UI API Documentation"
          >
            <BookOpen size={14} />
            <span>Swagger API</span>
            <ExternalLink size={12} className="opacity-70" />
          </a>
        </div>

        {/* User Profile & Demo Switcher */}
        <div className="flex items-center gap-3">
          {isRecruiter && (
            <button 
              onClick={onOpenPostJob}
              className="btn btn-sm btn-success hidden sm:inline-flex"
            >
              <PlusCircle size={15} />
              <span>Post Job</span>
            </button>
          )}

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all text-left"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  isRecruiter ? 'bg-purple-600 text-purple-100' : 'bg-indigo-600 text-indigo-100'
                }`}>
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold leading-tight text-white flex items-center gap-1.5">
                    {currentUser.name}
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                      isRecruiter ? 'bg-purple-900/60 text-purple-300' : 'bg-indigo-900/60 text-indigo-300'
                    }`}>
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                    {currentUser.title || currentUser.company || currentUser.email}
                  </div>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {/* User switcher dropdown */}
              {userDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                    <span>Quick Switch Role</span>
                    <span className="text-[10px] text-indigo-400 font-normal">Demo Mode</span>
                  </div>

                  <div className="py-1">
                    {demoAccounts.map((account) => (
                      <button
                        key={account.id}
                        onClick={() => {
                          onSwitchUser(account.email);
                          setUserDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          currentUser.email === account.email 
                            ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30' 
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-white">{account.name}</div>
                          <div className="text-[11px] text-slate-400">{account.title}</div>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                          account.role === 'RECRUITER' ? 'bg-purple-950 text-purple-300' : 'bg-blue-950 text-blue-300'
                        }`}>
                          {account.role}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-800 pt-1 mt-1">
                    {isCandidate && (
                      <button
                        onClick={() => {
                          onOpenProfile();
                          setUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-800 text-slate-300 flex items-center gap-2"
                      >
                        <Settings size={14} />
                        <span>Edit Profile & Skills</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onOpenAuth();
                        setUserDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-800 text-indigo-400 flex items-center gap-2"
                    >
                      <User size={14} />
                      <span>Log In / Register Another Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={onOpenAuth} className="btn btn-sm btn-primary">
              <User size={14} />
              <span>Sign In</span>
            </button>
          )}

          {/* System Health Status Indicator */}
          <div 
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 font-mono"
            title={`API Status: ${systemHealth?.status || 'UP'} | DB: ${systemHealth?.database || 'Connected'}`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Atlas DB Active</span>
          </div>

        </div>

      </div>
    </nav>
  );
}
