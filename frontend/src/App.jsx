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
  Sparkles
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
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2.5 shadow-2xl backdrop-blur-xl ${
            toast.isError 
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200' 
              : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
          }`}>
            {toast.isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} className="text-emerald-400" />}
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pb-16">
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
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-8 px-4 md:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <span className="font-bold text-white tracking-tight">Skill Match Job Portal</span>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-2">
              <span className="badge badge-neutral text-[10px]">React.js</span>
              <span className="badge badge-neutral text-[10px]">Spring Boot 3.3</span>
              <span className="badge badge-neutral text-[10px]">MongoDB Atlas</span>
              <span className="badge badge-neutral text-[10px]">Swagger UI</span>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <a 
              href="http://localhost:8080/swagger-ui.html"
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <BookOpen size={13} />
              <span>Swagger REST Documentation</span>
              <ExternalLink size={11} />
            </a>

            <button
              onClick={handleResetSeedData}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
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
