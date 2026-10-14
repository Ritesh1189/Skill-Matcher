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
  ExternalLink,
  Layers,
  ArrowRightLeft,
  Check,
  X
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
    { id: 'alex', name: 'Alex Morgan', role: 'CANDIDATE', title: 'Full Stack Engineer', email: 'alex.morgan@example.com' },
    { id: 'sarah', name: 'Sarah Chen', role: 'CANDIDATE', title: 'Senior Frontend Dev', email: 'sarah.chen@example.com' },
    { id: 'emma', name: 'Emma Watson', role: 'RECRUITER', title: 'Talent Lead @ CloudScale', email: 'emma.recruiter@cloudscale.io' },
    { id: 'michael', name: 'Michael Scott', role: 'RECRUITER', title: 'Head of Talent @ Nexus', email: 'michael.hr@nexustech.com' }
  ];

  const isCandidate = currentUser?.role === 'CANDIDATE';
  const isRecruiter = currentUser?.role === 'RECRUITER';

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-white/10 shadow-xl">
      
      {/* Top Interactive Role-Switch Banner (Green for Candidate, Red for Recruiter) */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-red-950/80 border-b border-white/10 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <ArrowRightLeft size={13} className="text-emerald-400" />
              <span>Interactive Switcher:</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSwitchUser('alex.morgan@example.com')}
                className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] transition-all flex items-center gap-1 ${
                  isCandidate && currentUser?.email?.includes('alex')
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/40 ring-1 ring-white/50'
                    : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-500/30'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                <span>Job Seeker (Alex)</span>
              </button>

              <button
                onClick={() => onSwitchUser('emma.recruiter@cloudscale.io')}
                className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] transition-all flex items-center gap-1 ${
                  isRecruiter && currentUser?.email?.includes('emma')
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/40 ring-1 ring-white/50'
                    : 'bg-red-950/60 text-red-300 hover:bg-red-900/60 border border-red-500/30'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-300"></span>
                <span>Recruiter (Emma)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-400">Database:</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>MongoDB Atlas Connected</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar Navigation */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">
        
        {/* Brand Logo with Green and Red subtle accents */}
        <div 
          onClick={() => setActiveTab('jobs')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-all">
            <Briefcase size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                Skill<span className="text-emerald-400">Match</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Live App
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Green <span className="text-emerald-400 font-bold">✔ Match</span> vs Red <span className="text-red-400 font-bold">✕ Gap</span> Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`btn btn-sm ${
              activeTab === 'jobs' 
                ? 'btn-green font-bold' 
                : 'btn-secondary text-slate-200'
            }`}
          >
            <Briefcase size={15} />
            <span>Find Jobs</span>
          </button>

          <button
            onClick={() => setActiveTab('matcher')}
            className={`btn btn-sm ${
              activeTab === 'matcher' 
                ? 'btn-green font-bold' 
                : 'btn-secondary text-slate-200'
            }`}
          >
            <Sparkles size={15} className="text-emerald-300" />
            <span>Skill Matcher</span>
          </button>

          <button
            onClick={() => setActiveTab('candidates')}
            className={`btn btn-sm ${
              activeTab === 'candidates' 
                ? 'btn-green font-bold' 
                : 'btn-secondary text-slate-200'
            }`}
          >
            <Users size={15} />
            <span>Candidates</span>
          </button>

          {isCandidate && (
            <button
              onClick={() => setActiveTab('applications')}
              className={`btn btn-sm ${
                activeTab === 'applications' 
                  ? 'btn-green font-bold' 
                  : 'btn-secondary text-slate-200'
              }`}
            >
              <FileText size={15} />
              <span>My Applications</span>
            </button>
          )}

          {isRecruiter && (
            <button
              onClick={() => setActiveTab('recruiter')}
              className={`btn btn-sm ${
                activeTab === 'recruiter' 
                  ? 'btn-red font-bold' 
                  : 'btn-secondary text-red-300 border-red-500/30'
              }`}
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
            className="btn btn-sm btn-white hidden lg:inline-flex"
            title="Open Swagger UI API Documentation"
          >
            <BookOpen size={14} className="text-emerald-600" />
            <span>Swagger API</span>
            <ExternalLink size={12} className="opacity-70" />
          </a>
        </nav>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-3">
          {isRecruiter && (
            <button 
              onClick={onOpenPostJob}
              className="btn btn-sm btn-red hidden sm:inline-flex"
            >
              <PlusCircle size={15} />
              <span>Post Opening</span>
            </button>
          )}

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all text-left ${
                  isRecruiter 
                    ? 'bg-red-950/40 border-red-500/40 hover:bg-red-900/40' 
                    : 'bg-emerald-950/40 border-emerald-500/40 hover:bg-emerald-900/40'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white ${
                  isRecruiter ? 'bg-red-600 shadow-md shadow-red-600/30' : 'bg-emerald-600 shadow-md shadow-emerald-600/30'
                }`}>
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold leading-tight text-white flex items-center gap-1.5">
                    {currentUser.name}
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                      isRecruiter ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 truncate max-w-[140px]">
                    {currentUser.title || currentUser.company || currentUser.email}
                  </div>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {/* User Switcher Dropdown */}
              {userDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-white/20 rounded-2xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                    <span>Switch Test Persona</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">1-Click</span>
                  </div>

                  <div className="py-1">
                    {demoAccounts.map((account) => (
                      <button
                        key={account.id}
                        onClick={() => {
                          onSwitchUser(account.email);
                          setUserDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-between mb-1 ${
                          currentUser.email === account.email 
                            ? 'bg-emerald-600/30 text-emerald-200 font-bold border border-emerald-500/40' 
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-white">{account.name}</div>
                          <div className="text-[11px] text-slate-400">{account.title}</div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                          account.role === 'RECRUITER' ? 'bg-red-950 text-red-300 border border-red-800/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                        }`}>
                          {account.role}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-800 pt-1 mt-1 space-y-1">
                    {isCandidate && (
                      <button
                        onClick={() => {
                          onOpenProfile();
                          setUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-800 text-emerald-400 flex items-center gap-2 font-semibold"
                      >
                        <span>✏️ Edit Profile & Skills</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onOpenAuth();
                        setUserDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-800 text-white flex items-center gap-2"
                    >
                      <User size={14} />
                      <span>Sign In / Register New User</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={onOpenAuth} className="btn btn-sm btn-green">
              <User size={14} />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
