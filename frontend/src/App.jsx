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
  RotateCcw
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('skillmatch_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(() => {
    try {
      const stored = localStorage.getItem('skillmatch_user');
      if (stored) {
        const u = JSON.parse(stored);
        return u.role === 'RECRUITER' ? 'recruiter' : 'jobs';
      }
    } catch (e) {}
    return 'jobs';
  });

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
      const health = await systemApi.getHealth();
      setSystemHealth(health);

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
    try {
      localStorage.setItem('skillmatch_user', JSON.stringify(updatedUser));
    } catch (e) {}
    showToast('Profile and skills updated successfully!');
    if (updatedUser?.id && updatedUser.role === 'CANDIDATE') {
      loadMatchesAndApplications(updatedUser.id);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('skillmatch_user');
    } catch (e) {}
    setCurrentUser(null);
    setMatchesByJobId({});
    setCandidateApplications([]);
    showToast('You have been logged out.');
  };

  const handleResetJobs = async () => {
    if (!window.confirm('Reset sample Indian employer job openings?')) return;
    try {
      await systemApi.resetSeedData();
      showToast('Indian job openings refreshed!');
      await initApp();
    } catch (err) {
      showToast('Failed to reset jobs', true);
    }
  };

  const showToast = (message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 4000);
  };

  // GATEKEEPER: While visiting website don't show website directly; first signup or login page must be displayed
  if (!currentUser) {
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

        {/* Gatekeeper Top Header */}
        <header className="naukri-navbar" style={{ position: 'static' }}>
          <div className="naukri-nav-container" style={{ justifyContent: 'space-between' }}>
            <div className="naukri-brand">
              <div className="naukri-logo-icon">
                <CheckCircle2 size={24} />
              </div>
              <div className="naukri-brand-text">
                <h1>Skill<span>Match</span></h1>
                <div className="naukri-brand-sub">India Job Portal</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#ecfdf5', color: '#16a34a', border: '1px solid #bbf7d0', padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 800 }}>
                🇮🇳 Indian Tech Employers & ₹ INR Salaries
              </span>
            </div>
          </div>
        </header>

        {/* Gatekeeper Main: Signup or Login first */}
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 12px' }}>
          <AuthPage 
            initialMode="login"
            onAuthSuccess={(user) => {
              setCurrentUser(user);
              try {
                localStorage.setItem('skillmatch_user', JSON.stringify(user));
              } catch (e) {}
              showToast(`Welcome, ${user.name}!`);
              setActiveTab(user.role === 'RECRUITER' ? 'recruiter' : 'jobs');
            }}
          />
        </main>

        {/* Gatekeeper Footer */}
        <footer style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '16px 20px', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
          SkillMatch India • Connecting tech professionals with Indian employers across Bengaluru, Hyderabad, Pune, Gurugram, Mumbai & Chennai
        </footer>
      </div>
    );
  }

  // Once Authenticated: Render Full Portal
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
            onNavigateToAuth={() => {}}
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
          onNavigateToAuth={() => {}}
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
            <span style={{ fontWeight: 800, color: '#0f172a' }}>SkillMatch India</span>
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
          </div>
        </div>
      </footer>

    </div>
  );
}
