import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  Sparkles, 
  Briefcase, 
  SlidersHorizontal, 
  CheckCircle2, 
  RotateCcw,
  Layers,
  ChevronDown
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
  onOpenPostJob
}) {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('All');
  const [experienceLevel, setExperienceLevel] = useState('All');
  const [minMatch, setMinMatch] = useState(0); // 0, 50, 80
  const [sortBy, setSortBy] = useState('match'); // 'match', 'newest'

  const isCandidate = currentUser?.role === 'CANDIDATE';
  const isRecruiter = currentUser?.role === 'RECRUITER';

  // Set of applied job IDs
  const appliedJobIds = useMemo(() => {
    return new Set(candidateApplications.map(a => a.jobId));
  }, [candidateApplications]);

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search text
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesTitle = job.title?.toLowerCase().includes(q);
        const matchesCompany = job.company?.toLowerCase().includes(q);
        const matchesSkill = job.requiredSkills?.some(s => s.toLowerCase().includes(q));
        const matchesDesc = job.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesSkill && !matchesDesc) return false;
      }

      // Location
      if (location.trim()) {
        if (!job.location?.toLowerCase().includes(location.toLowerCase().trim())) return false;
      }

      // Job Type
      if (jobType !== 'All') {
        if (!job.type?.toLowerCase().includes(jobType.toLowerCase())) return false;
      }

      // Experience Level
      if (experienceLevel !== 'All') {
        if (!job.experienceLevel?.toLowerCase().includes(experienceLevel.toLowerCase())) return false;
      }

      // Minimum Match Filter (if candidate)
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
    <div className="space-y-6">
      
      {/* Hero Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" />
              <span>Skill Match Scoring Active</span>
            </span>
            {isCandidate && (
              <span className="text-xs text-slate-400">
                Matches calculated using your profile skills
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Find Open Roles Matched To Your Skills
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Our Spring Boot algorithmic matching engine compares your listed proficiencies against job requirements with exact match percentages and transparent gap analyses.
          </p>

          {/* Active Candidate Skills Bar */}
          {isCandidate && currentUser?.skills && (
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-400 font-semibold mr-1">Your Skills:</span>
                {currentUser.skills.map((skill, idx) => (
                  <span key={idx} className="skill-chip matched text-xs">
                    {skill}
                  </span>
                ))}
              </div>

              <button
                onClick={onOpenProfile}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
              >
                + Edit Skills
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Main Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="form-control pl-10"
              placeholder="Search by job title, company, or skill (e.g. Java, React)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="md:col-span-3 relative">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="form-control pl-10"
              placeholder="Location or 'Remote'..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Job Type */}
          <div className="md:col-span-2">
            <select
              className="form-control cursor-pointer"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Experience Level */}
          <div className="md:col-span-2">
            <select
              className="form-control cursor-pointer"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="All">All Levels</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
            </select>
          </div>

        </div>

        {/* Second Row: Match Score Filter & Sorting */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap text-xs">
          
          {/* Match Score Quick Buttons (For Candidates) */}
          {isCandidate && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-400 flex items-center gap-1">
                <SlidersHorizontal size={13} />
                <span>Match Score:</span>
              </span>
              <button
                onClick={() => setMinMatch(0)}
                className={`px-3 py-1 rounded-full transition-all ${
                  minMatch === 0 ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Jobs
              </button>
              <button
                onClick={() => setMinMatch(50)}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                  minMatch === 50 ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-500/20' : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
                }`}
              >
                <span>≥ 50% Match</span>
              </button>
              <button
                onClick={() => setMinMatch(80)}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                  minMatch === 80 ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20' : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                }`}
              >
                <Sparkles size={11} />
                <span>≥ 80% Strong Match</span>
              </button>
            </div>
          )}

          {/* Results count & Sort */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-slate-400">
              Showing <span className="font-bold text-white">{filteredJobs.length}</span> positions
            </span>

            {isCandidate && (
              <select
                className="bg-slate-800 text-xs rounded-lg px-2.5 py-1 border border-slate-700 text-slate-300 focus:outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="match">Sort by: Highest Match %</option>
                <option value="newest">Sort by: Newest Openings</option>
              </select>
            )}

            {(search || location || jobType !== 'All' || experienceLevel !== 'All' || minMatch > 0) && (
              <button
                onClick={resetFilters}
                className="text-slate-400 hover:text-white flex items-center gap-1 ml-1"
                title="Reset all filters"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border-slate-800">
          <Briefcase size={36} className="mx-auto text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Jobs Matched Your Filters</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
            Try adjusting your search criteria, widening the minimum match score, or clearing active filters.
          </p>
          <button onClick={resetFilters} className="btn btn-sm btn-secondary">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              onViewApplicants={() => onSelectJob(job)}
            />
          ))}
        </div>
      )}

    </div>
  );
}
