import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  SlidersHorizontal, 
  Check, 
  RotateCcw,
  Sparkles,
  Building2,
  Tag,
  Sliders,
  Filter,
  CheckCircle2
} from 'lucide-react';
import JobCard from './JobCard';

export default function BrowseJobs({ 
  jobs, 
  matchesByJobId, 
  currentUser, 
  onSelectJob, 
  onApply, 
  candidateApplications,
  onOpenProfile,
  onOpenPostJob,
  onNavigateToAuth
}) {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('All');
  const [experienceLevel, setExperienceLevel] = useState('All');
  const [minMatch, setMinMatch] = useState(0); // 0, 50, 70
  const [sortBy, setSortBy] = useState('match');

  const isCandidate = currentUser?.role === 'CANDIDATE';
  const isRecruiter = currentUser?.role === 'RECRUITER';

  const appliedJobIds = useMemo(() => {
    return new Set(candidateApplications.map(a => a.jobId));
  }, [candidateApplications]);

  // Trending searches for quick filter click
  const trendingTags = ['Java', 'React', 'Spring Boot', 'MongoDB', 'SQL', 'Git', 'Docker'];

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesTitle = job.title?.toLowerCase().includes(q);
        const matchesCompany = job.company?.toLowerCase().includes(q);
        const matchesSkill = job.requiredSkills?.some(s => s.toLowerCase().includes(q));
        const matchesDesc = job.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesSkill && !matchesDesc) return false;
      }

      if (location.trim()) {
        if (!job.location?.toLowerCase().includes(location.toLowerCase().trim())) return false;
      }

      if (jobType !== 'All') {
        if (!job.type?.toLowerCase().includes(jobType.toLowerCase())) return false;
      }

      if (experienceLevel !== 'All') {
        if (!job.experienceLevel?.toLowerCase().includes(experienceLevel.toLowerCase())) return false;
      }

      if (isCandidate && minMatch > 0) {
        const match = matchesByJobId[job.id];
        const score = match?.matchPercentage ?? 0;
        if (score < minMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (isCandidate && sortBy === 'match') {
        const scoreA = matchesByJobId[a.id]?.matchPercentage ?? 0;
        const scoreB = matchesByJobId[b.id]?.matchPercentage ?? 0;
        if (scoreB !== scoreA) return scoreB - scoreA;
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [jobs, search, location, jobType, experienceLevel, minMatch, sortBy, matchesByJobId, isCandidate]);

  const resetFilters = () => {
    setSearch('');
    setLocation('');
    setJobType('All');
    setExperienceLevel('All');
    setMinMatch(0);
    setSortBy('match');
  };

  return (
    <div>
      {/* 1. Iconic Naukri / Indeed Hero Search Section */}
      <section className="naukri-hero">
        <div className="naukri-hero-inner">
          <h1 className="naukri-hero-title">
            Find Your Next Job With <span>Skill Matching</span>
          </h1>
          <p className="naukri-hero-subtitle">
            Search thousands of tech jobs transparently scored against your verified technical skills.
          </p>

          {/* 3-Segment Unified Search Box */}
          <div className="naukri-search-box">
            <div className="naukri-search-segment">
              <Search size={18} className="naukri-search-icon" />
              <input
                type="text"
                className="naukri-search-input"
                placeholder="Job title, skills (e.g. Java, React), or company"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="naukri-search-segment">
              <MapPin size={18} className="naukri-search-icon" />
              <input
                type="text"
                className="naukri-search-input"
                placeholder="Location (e.g. Bengaluru, Hyderabad, Pune, Gurugram)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="naukri-search-segment" style={{ maxWidth: '200px' }}>
              <Briefcase size={18} className="naukri-search-icon" />
              <select
                className="naukri-search-input"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="All">All Experience</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior">Senior Level</option>
              </select>
            </div>

            <button 
              className="naukri-search-btn"
              onClick={() => {}}
            >
              Search Jobs
            </button>
          </div>

          {/* Quick Trending Searches */}
          <div className="naukri-trending">
            <span className="naukri-trending-label">Trending Searches:</span>
            {trendingTags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSearch(search === tag ? '' : tag)}
                className="naukri-trending-chip"
                style={{
                  background: search === tag ? '#ecfdf5' : '#ffffff',
                  borderColor: search === tag ? '#16a34a' : '#e2e8f0',
                  color: search === tag ? '#16a34a' : '#475569',
                  fontWeight: search === tag ? 700 : 500
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Main Two-Column Layout (Left: Filters, Right: Job Feed) */}
      <div className="naukri-container">
        <div className="naukri-layout-grid">
          
          {/* LEFT SIDEBAR: FILTERS */}
          <aside>
            <div className="naukri-filter-card">
              <div className="naukri-filter-header">
                <h3>All Filters</h3>
                <button onClick={resetFilters} className="naukri-filter-reset">
                  Clear All
                </button>
              </div>

              {/* Skill Match Score Filter */}
              {isCandidate && (
                <div className="naukri-filter-section">
                  <div className="naukri-filter-title">
                    <Sparkles size={14} style={{ color: '#16a34a' }} />
                    <span>Skill Compatibility</span>
                  </div>

                  <label className="naukri-filter-option">
                    <span>All Openings</span>
                    <input
                      type="radio"
                      name="minMatch"
                      checked={minMatch === 0}
                      onChange={() => setMinMatch(0)}
                    />
                  </label>

                  <label className="naukri-filter-option">
                    <span style={{ color: '#15803d', fontWeight: 600 }}>
                      High Match (&ge; 70%)
                    </span>
                    <input
                      type="radio"
                      name="minMatch"
                      checked={minMatch === 70}
                      onChange={() => setMinMatch(70)}
                    />
                  </label>

                  <label className="naukri-filter-option">
                    <span style={{ color: '#a16207' }}>
                      Moderate Match (&ge; 50%)
                    </span>
                    <input
                      type="radio"
                      name="minMatch"
                      checked={minMatch === 50}
                      onChange={() => setMinMatch(50)}
                    />
                  </label>
                </div>
              )}

              {/* Work Mode / Type */}
              <div className="naukri-filter-section">
                <div className="naukri-filter-title">
                  <Briefcase size={14} />
                  <span>Job Type</span>
                </div>

                {['All', 'Full-time', 'Contract', 'Part-time', 'Internship'].map((type) => (
                  <label key={type} className="naukri-filter-option">
                    <span>{type}</span>
                    <input
                      type="radio"
                      name="jobType"
                      checked={jobType === type}
                      onChange={() => setJobType(type)}
                    />
                  </label>
                ))}
              </div>

              {/* Guest Match Callout */}
              {!currentUser && (
                <div style={{ marginTop: '16px', padding: '16px', background: '#ecfdf5', borderRadius: '10px', border: '1px solid #86efac' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Sparkles size={16} style={{ color: '#16a34a' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534' }}>
                      Skill Match Score
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.5, marginBottom: '12px' }}>
                    Log in or create a free profile with your technical skills to see exact match percentages on all jobs.
                  </p>
                  <button
                    onClick={onNavigateToAuth}
                    className="btn btn-green btn-sm"
                    style={{ width: '100%', justifyContent: 'center', fontWeight: 700 }}
                  >
                    Log In / Register
                  </button>
                </div>
              )}

              {/* Candidate Active Skills Profile Box */}
              {isCandidate && currentUser?.skills && (
                <div style={{ marginTop: '16px', padding: '14px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #86efac' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                      Your Match Profile
                    </span>
                    <button
                      onClick={onOpenProfile}
                      style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Edit
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {currentUser.skills.map((sk, idx) => (
                      <span key={idx} className="skill-chip matched" style={{ fontSize: '0.7rem' }}>
                        <Check size={10} strokeWidth={3} />
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </aside>

          {/* RIGHT COLUMN: JOB LISTINGS FEED */}
          <main>
            {/* Feed Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  {filteredJobs.length} Jobs Found
                </span>
                {search && (
                  <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '6px' }}>
                    for "{search}"
                  </span>
                )}
              </div>

              {isCandidate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Sort by:</span>
                  <select
                    className="form-control"
                    style={{ width: 'auto', padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer' }}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="match">Highest Skill Match</option>
                    <option value="recent">Most Recent</option>
                  </select>
                </div>
              )}
            </div>

            {/* List of Job Cards */}
            {filteredJobs.length === 0 ? (
              <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '48px', textAlign: 'center' }}>
                <Briefcase size={36} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  No matching jobs found
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
                  Try relaxing your search keywords or clearing active filters.
                </p>
                <button onClick={resetFilters} className="btn btn-green btn-sm">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    matchResult={matchesByJobId[job.id]}
                    onSelectJob={onSelectJob}
                    onApply={onApply}
                    hasApplied={appliedJobIds.has(job.id)}
                    isCandidate={isCandidate}
                    isRecruiter={isRecruiter}
                    onNavigateToAuth={onNavigateToAuth}
                  />
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
