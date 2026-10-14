import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BrowseJobs from './components/BrowseJobs';
import SkillMatcherCalculator from './components/SkillMatcherCalculator';
import CandidateApplications from './components/CandidateApplications';
import RecruiterDashboard from './components/RecruiterDashboard';
import JobDetailsModal from './components/JobDetailsModal';
import ProfileModal from './components/ProfileModal';
import PostJobModal from './components/PostJobModal';
import AuthPage from './components/AuthPage';
import { 
  jobsApi, 
  matchApi, 
  applicationsApi, 
  systemApi 
} from './services/api';
import { 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  BookOpen, 
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'matcher' | 'applications' | 'recruiter' | 'auth'
  const [jobs, setJobs] = useState([]);
  const [matchesByJobId, setMatchesByJobId] = useState({});
  const [candidateApplications, setCandidateApplications] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);

  // Modals
  const [selectedJob, setSelectedJob] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
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

  const handleApply = async (job, coverNote) => {
    if (!currentUser) {
      showToast('Please log in or register to apply for jobs and check your skill match.', true);
      setActiveTab('auth');
      return;
    }

    if (currentUser.role !== 'CANDIDATE') {
      showToast('Only Job Seeker accounts can submit applications.', true);
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
  };

  const handleProfileUpdated = (updatedUser) => {
    setCurrentUser(updatedUser);
    showToast('Profile and skills updated successfully!');
    if (updatedUser?.id && updatedUser.role === 'CANDIDATE') {
      loadMatchesAndApplications(updatedUser.id);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMatchesByJobId({});
    setCandidateApplications([]);
    showToast('You have been logged out.');
    setActiveTab('jobs');
  };

  const handleResetJobs = async () => {
    if (!window.confirm('Reset sample job openings?')) return;
    try {
      await systemApi.resetSeedData();
      showToast('Job openings refreshed!');
      await initApp();
    } catch (err) {
      showToast('Failed to reset jobs', true);
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
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 100 }}>
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

      {/* Top Navbar */}
      <Navbar 
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenPostJob={() => setIsPostJobModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {activeTab === 'auth' && (
          <AuthPage 
            onAuthSuccess={(user) => {
              setCurrentUser(user);
              showToast(`Welcome back, ${user.name}!`);
              if (user.role === 'RECRUITER') {
                setActiveTab('recruiter');
              } else {
                setActiveTab('jobs');
              }
            }}
            onNavigateToJobs={() => setActiveTab('jobs')}
          />
        )}

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
            onNavigateToAuth={() => setActiveTab('auth')}
          />
        )}

        {activeTab === 'matcher' && (
          <SkillMatcherCalculator />
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
          onNavigateToAuth={() => {
            setSelectedJob(null);
            setActiveTab('auth');
          }}
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

      {/* Simple, Professional Footer */}
      <footer style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '24px 20px', fontSize: '0.85rem', color: '#64748b' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 800, color: '#0f172a' }}>SkillMatch Portal</span>
            <span>•</span>
            <span>Intelligent Skill-Based Hiring Platform</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={handleResetJobs}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}
            >
              <RotateCcw size={13} />
              Reset Sample Jobs
            </button>
            <a 
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <BookOpen size={14} />
              API Documentation
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
