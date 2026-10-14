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
  const [toast, setToast] = useState(null);

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
      const rankedMatches = await matchApi.getRankedJobsForCandidate(candidateId);
      const matchMap = {};
      (rankedMatches || []).forEach(item => {
        if (item.job?.id && item.match) {
          matchMap[item.job.id] = item.match;
        }
      });
      setMatchesByJobId(matchMap);

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
    showToast(`Job opening "${newJob.title}" posted successfully!`);
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '60px', right: '24px', zIndex: 100 }}>
          <div style={{
            background: '#ffffff',
            border: `1px solid ${toast.isError ? '#fca5a5' : '#86efac'}`,
            borderRadius: '8px',
            padding: '12px 18px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: toast.isError ? '#b91c1c' : '#15803d'
          }}>
            {toast.isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar (Naukri style) */}
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

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '70px' }}>
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

      {/* Persistent Bottom Bar (Indeed/Naukri Testing Helper) */}
      <div className="naukri-bottom-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></span>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>Active Profile:</span>
          <span style={{ color: '#16a34a', fontWeight: 800 }}>
            {currentUser?.name || 'Guest'} ({currentUser?.role})
          </span>
          {currentUser?.role === 'CANDIDATE' && (
            <span style={{ color: '#64748b' }}>
              • Skills: {currentUser.skills?.slice(0, 3).join(', ')}...
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Quick Persona Switch:</span>
          <button
            onClick={() => handleSwitchUser('alex.morgan@example.com')}
            className="btn btn-sm"
            style={{
              background: currentUser?.email?.includes('alex') ? '#16a34a' : '#ffffff',
              color: currentUser?.email?.includes('alex') ? '#ffffff' : '#0f172a',
              borderColor: '#cbd5e1'
            }}
          >
            Candidate (Alex Morgan)
          </button>
          <button
            onClick={() => handleSwitchUser('emma.recruiter@cloudscale.io')}
            className="btn btn-sm"
            style={{
              background: currentUser?.role === 'RECRUITER' ? '#16a34a' : '#ffffff',
              color: currentUser?.role === 'RECRUITER' ? '#ffffff' : '#0f172a',
              borderColor: '#cbd5e1'
            }}
          >
            Recruiter (Emma Watson)
          </button>
          <a
            href="http://localhost:8080/swagger-ui.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm"
            style={{ background: '#ecfdf5', color: '#15803d', borderColor: '#86efac' }}
          >
            <BookOpen size={13} />
            <span>Swagger Docs</span>
          </a>
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

      {/* Footer (Naukri style clean footer) */}
      <footer style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '24px 20px', fontSize: '0.8rem', color: '#64748b', marginBottom: '40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, color: '#0f172a' }}>SkillMatch Portal</span>
            <span>•</span>
            <span>Inspired by Naukri & Indeed Recruitment Standards</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleResetSeedData}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
            >
              <RotateCcw size={13} />
              Reset Demo Data
            </button>
            <a 
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Swagger REST API
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
