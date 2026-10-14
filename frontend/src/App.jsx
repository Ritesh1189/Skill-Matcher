import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BrowseJobs from './components/BrowseJobs';
import SkillMatcherCalculator from './components/SkillMatcherCalculator';
import CandidateApplications from './components/CandidateApplications';
import RecruiterDashboard from './components/RecruiterDashboard';
import CandidatePool from './components/CandidatePool';
import JobDetailsModal from './components/JobDetailsModal';
import ProfileModal from './components/ProfileModal';
import PostJobModal from './components/PostJobModal';
import AuthModal from './components/AuthModal';
import { 
  jobsApi, 
  matchApi, 
  applicationsApi, 
  systemApi, 
  authApi, 
  candidatesApi 
} from './services/api';
import { 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  BookOpen, 
  ExternalLink,
  Database,
  Cpu,
  Layers,
  Sparkles,
  UserCheck,
  Briefcase,
  Users
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'matcher' | 'candidates' | 'applications' | 'recruiter'
  const [jobs, setJobs] = useState([]);
  const [matchesByJobId, setMatchesByJobId] = useState({});
  const [candidateApplications, setCandidateApplications] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);

  // Modals
  const [selectedJob, setSelectedJob] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  // Initial Boot
  useEffect(() => {
    initApp();
  }, []);

  // When currentUser changes, re-fetch match scores and applications
  useEffect(() => {
    if (currentUser?.id && currentUser?.role === 'CANDIDATE') {
      loadMatchesAndApplications(currentUser.id);
    } else if (currentUser?.role === 'RECRUITER' && activeTab === 'applications') {
      setActiveTab('recruiter');
    }
  }, [currentUser]);

  const initApp = async () => {
    try {
      // 1. Fetch Health
      const health = await systemApi.getHealth();
      setSystemHealth(health);

      // 2. Fetch Jobs
      const jobsList = await jobsApi.getJobs();
      setJobs(jobsList || []);

      // 3. Set default user (Alex Morgan - Candidate)
      const candidates = await candidatesApi.getAll();
      if (candidates && candidates.length > 0) {
        const alex = candidates.find(c => c.email.includes('alex')) || candidates[0];
        setCurrentUser(alex);
      }
    } catch (err) {
      console.error('Initialization error:', err);
    }
  };

  const loadMatchesAndApplications = async (candidateId) => {
    try {
      // Fetch ranked job matches for candidate
      const rankedMatches = await matchApi.getRankedJobsForCandidate(candidateId);
      const matchMap = {};
      (rankedMatches || []).forEach(item => {
        if (item.job?.id && item.match) {
          matchMap[item.job.id] = item.match;
        }
      });
      setMatchesByJobId(matchMap);

      // Fetch candidate applications
      const apps = await applicationsApi.getByCandidate(candidateId);
      setCandidateApplications(apps || []);
    } catch (err) {
      console.error('Failed to load candidate matches/applications:', err);
    }
  };

  const handleSwitchUser = async (email) => {
    try {
      const candidates = await candidatesApi.getAll();
      const targetCandidate = candidates.find(c => c.email.toLowerCase() === email.toLowerCase());
      if (targetCandidate) {
        setCurrentUser(targetCandidate);
        showToast(`Switched active profile to ${targetCandidate.name} (Candidate)`);
        return;
      }

      // Check recruiters
      const authRes = await authApi.login({
        email: email,
        password: email.includes('recruiter') ? 'recruiter123' : 'password123',
      });
      if (authRes?.user) {
        setCurrentUser(authRes.user);
        showToast(`Switched active profile to ${authRes.user.name} (${authRes.user.role})`);
        if (authRes.user.role === 'RECRUITER') {
          setActiveTab('recruiter');
        }
      }
    } catch (err) {
      console.error('Switch user error:', err);
    }
  };

  const handleApply = async (job, coverNote) => {
    if (!currentUser || currentUser.role !== 'CANDIDATE') {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const app = await applicationsApi.apply({
        jobId: job.id,
        candidateId: currentUser.id,
        coverNote: coverNote || '',
      });

      setCandidateApplications(prev => [app, ...prev]);
      showToast(`Successfully applied to ${job.title}! Match score: ${app.matchScore}%`);
      
      // Update applicant count locally
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, applicantsCount: (j.applicantsCount || 0) + 1 } : j));
      
      if (selectedJob?.id === job.id) {
        setSelectedJob({ ...selectedJob, applicantsCount: (selectedJob.applicantsCount || 0) + 1 });
      }
    } catch (err) {
      showToast(err.message || 'Application failed', true);
      throw err;
    }
  };

  const handleJobCreated = async (newJob) => {
    setJobs(prev => [newJob, ...prev]);
    showToast(`Job listing "${newJob.title}" posted successfully!`);
    if (currentUser?.id && currentUser.role === 'CANDIDATE') {
      loadMatchesAndApplications(currentUser.id);
    }
  };

  const handleProfileUpdated = (updatedUser) => {
    setCurrentUser(updatedUser);
    showToast('Profile and skills updated successfully!');
    if (updatedUser?.id) {
      loadMatchesAndApplications(updatedUser.id);
    }
  };

  const handleResetSeedData = async () => {
    if (!window.confirm('Reset and reload initial demonstration data (candidates, recruiters, jobs)?')) return;
    try {
      await systemApi.resetSeedData();
      showToast('Demonstration data successfully re-seeded!');
      await initApp();
    } catch (err) {
      showToast('Failed to reset data', true);
    }
  };

  const showToast = (message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 right-6 z-50 animate-fadeIn">
          <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 shadow-2xl backdrop-blur-xl ${
            toast.isError 
              ? 'bg-red-950/95 border-red-500 text-red-200' 
              : 'bg-emerald-950/95 border-emerald-500 text-emerald-200'
          }`}>
            {toast.isError ? <AlertCircle size={18} className="text-red-400" /> : <CheckCircle2 size={18} className="text-emerald-400" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar 
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenPostJob={() => setIsPostJobModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        systemHealth={systemHealth}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pb-24">
        {activeTab === 'jobs' && (
          <BrowseJobs 
            jobs={jobs}
            matchesByJobId={matchesByJobId}
            currentUser={currentUser}
            onSelectJob={(job) => setSelectedJob(job)}
            onApply={handleApply}
            candidateApplications={candidateApplications}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenPostJob={() => setIsPostJobModalOpen(true)}
          />
        )}

        {activeTab === 'matcher' && (
          <SkillMatcherCalculator />
        )}

        {activeTab === 'candidates' && (
          <CandidatePool />
        )}

        {activeTab === 'applications' && currentUser?.role === 'CANDIDATE' && (
          <CandidateApplications 
            candidate={currentUser}
            onSelectJobId={(id) => {
              const job = jobs.find(j => j.id === id);
              if (job) setSelectedJob(job);
            }}
          />
        )}

        {activeTab === 'recruiter' && currentUser?.role === 'RECRUITER' && (
          <RecruiterDashboard 
            recruiter={currentUser}
            onOpenPostJob={() => setIsPostJobModalOpen(true)}
          />
        )}
      </main>

      {/* Persistent Bottom Quick-Switch Bar for Real-Time Role Testing */}
      <div className="fixed bottom-0 inset-x-0 bg-slate-950/95 border-t border-white/20 backdrop-blur-xl z-40 py-2.5 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-white font-extrabold uppercase tracking-wider text-[11px]">Active Persona:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-black text-xs ${
              currentUser?.role === 'CANDIDATE' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white text-slate-950'
            }`}>
              {currentUser?.name || 'Guest'} ({currentUser?.role || 'Visitor'})
            </span>
            {currentUser?.role === 'CANDIDATE' && (
              <span className="text-slate-400 hidden md:inline text-[11px]">
                • Skills: {currentUser.skills?.slice(0, 3).join(', ')}...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-semibold text-[11px]">1-Click Switch:</span>
            <button
              onClick={() => handleSwitchUser('alex.chen@example.com')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                currentUser?.email?.includes('alex')
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm shadow-emerald-500/40'
                  : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/20 hover:text-white'
              }`}
            >
              Candidate (Alex Chen)
            </button>
            <button
              onClick={() => handleSwitchUser('recruiter@techmatch.com')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                currentUser?.role === 'RECRUITER'
                  ? 'bg-white text-slate-950 border-white shadow-sm font-black'
                  : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/20 hover:text-white'
              }`}
            >
              Recruiter (Emma Watson)
            </button>
            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-full text-xs font-black bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/80 transition-all flex items-center gap-1 ml-2"
            >
              <BookOpen size={12} />
              Swagger UI
              <ExternalLink size={10} />
            </a>
          </div>

        </div>
      </div>

      {/* Modals */}
      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob}
          matchResult={matchesByJobId[selectedJob.id]}
          onClose={() => setSelectedJob(null)}
          onApply={handleApply}
          hasApplied={candidateApplications.some(a => a.jobId === selectedJob.id)}
          isCandidate={currentUser?.role === 'CANDIDATE'}
        />
      )}

      {isProfileModalOpen && currentUser && (
        <ProfileModal 
          user={currentUser}
          onClose={() => setIsProfileModalOpen(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {isPostJobModalOpen && (
        <PostJobModal 
          recruiter={currentUser}
          onClose={() => setIsPostJobModalOpen(false)}
          onJobCreated={handleJobCreated}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            showToast(`Welcome, ${user.name}!`);
          }}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-8 px-4 md:px-8 text-xs text-slate-400 mb-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-white tracking-tight">Skill Match Job Portal</span>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">Green Matches</span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 text-[10px] font-bold">White Precision</span>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold">Red Skill Gaps</span>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <a 
              href="http://localhost:8080/swagger-ui.html"
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold"
            >
              <BookOpen size={13} />
              <span>Swagger REST API</span>
              <ExternalLink size={11} />
            </a>

            <button
              onClick={handleResetSeedData}
              className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors font-medium"
              title="Reset demonstration data"
            >
              <RotateCcw size={13} />
              <span>Reset Demo Data</span>
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}
