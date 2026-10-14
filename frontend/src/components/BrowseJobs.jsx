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
  Check,
  X,
  Plus,
  Layers,
  Award,
  AlertTriangle
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
  const [sortBy, setSortBy] = useState('match');

  const isCandidate = currentUser?.role === 'CANDIDATE';
  const isRecruiter = currentUser?.role === 'RECRUITER';

  // Set of applied job IDs
  const appliedJobIds = useMemo(() => {
    return new Set(candidateApplications.map(a => a.jobId));
  }, [candidateApplications]);

  // Compute stats for candidate
  const candidateStats = useMemo(() => {
    let strong = 0;
    let moderate = 0;
    let low = 0;
    const allMissingSkills = new Set();

    jobs.forEach(j => {
      const match = matchesByJobId[j.id];
      const score = match?.matchPercentage ?? 0;
      if (score >= 70) strong++;
      else if (score >= 50) moderate++;
      else low++;

      (match?.missingSkills || []).forEach(s => allMissingSkills.add(s));
    });

    return {
      strong,
      moderate,
      low,
      missingSkillsCount: allMissingSkills.size,
    };
  }, [jobs, matchesByJobId]);

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
    <div className="space-y-6">
      
      {/* Hero Banner: Green, White, and Red Metrics */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-emerald-500/30 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} className="text-emerald-400" />
              <span>Skill-Matched Opportunities</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              Find Jobs Matching <span className="text-emerald-400">Your Skills</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Real-time overlap comparison between candidate proficiencies (<span className="text-emerald-400 font-bold">Green Matches</span>) and employer requirements (<span className="text-red-400 font-bold">Red Skill Gaps</span>).
            </p>

            {/* Interactive Candidate Skills Pills */}
            {isCandidate && currentUser?.skills && (
              <div className="pt-3 border-t border-white/10 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-white">Your Listed Skills:</span>
                {currentUser.skills.map((skill, idx) => (
                  <span key={idx} className="skill-chip matched text-xs">
                    <Check size={11} className="stroke-[3]" />
                    <span>{skill}</span>
                  </span>
                ))}
                <button
                  onClick={onOpenProfile}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 ml-1"
                >
                  + Add / Edit Skills
                </button>
              </div>
            )}
          </div>

          {/* Metric Badges (Green, White, Red) */}
          {isCandidate && (
            <div className="grid grid-cols-3 gap-3 shrink-0">
              {/* Total Jobs */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/15 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Total Open</div>
                <div className="text-2xl font-black text-white mt-0.5">{jobs.length}</div>
                <div className="text-[10px] text-slate-400">Roles</div>
              </div>

              {/* Strong Matches (Green) */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center shadow-lg shadow-emerald-950/30">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Strong Match</div>
                <div className="text-2xl font-black text-emerald-300 mt-0.5">{candidateStats.strong}</div>
                <div className="text-[10px] text-emerald-400 font-semibold">≥ 70% Match</div>
              </div>

              {/* Skill Gaps (Red) */}
              <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-center shadow-lg shadow-red-950/30">
                <div className="text-[11px] font-bold uppercase tracking-wider text-red-400">Gaps To Learn</div>
                <div className="text-2xl font-black text-red-300 mt-0.5">{candidateStats.missingSkillsCount}</div>
                <div className="text-[10px] text-red-400 font-semibold">Missing Skills</div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Search & Filter Console */}
      <div className="glass-panel p-5 rounded-2xl border-white/10 space-y-4">
        
        {/* Row 1: Keyword, Location, Type, Level */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-5 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="form-control pl-10"
              placeholder="Search by job title, company, or technical skill (Java, React)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="md:col-span-3 relative">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              className="form-control pl-10"
              placeholder="Location or 'Remote'..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

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

        {/* Row 2: Match Level Pills (Green/Red) & Sort */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap text-xs">
          
          {isCandidate && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-300 flex items-center gap-1">
                <SlidersHorizontal size={13} className="text-emerald-400" />
                <span>Filter Match:</span>
              </span>

              <button
                onClick={() => setMinMatch(0)}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  minMatch === 0 ? 'bg-white text-slate-900 shadow-md' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                All Jobs ({jobs.length})
              </button>

              <button
                onClick={() => setMinMatch(50)}
                className={`px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1 ${
                  minMatch === 50 ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                }`}
              >
                <span>≥ 50% Match</span>
              </button>

              <button
                onClick={() => setMinMatch(80)}
                className={`px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1 ${
                  minMatch === 80 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400' 
                    : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-500/30'
                }`}
              >
                <CheckCircle2 size={12} />
                <span>≥ 80% Strong Match</span>
              </button>
            </div>
          )}

          {/* Results count & Sort */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-slate-300">
              Showing <span className="font-bold text-white text-sm">{filteredJobs.length}</span> positions
            </span>

            {isCandidate && (
              <select
                className="bg-slate-800 text-xs rounded-lg px-2.5 py-1.5 border border-white/20 text-white font-medium focus:outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="match">Sort: Highest Match Score</option>
                <option value="newest">Sort: Newest Openings</option>
              </select>
            )}

            {(search || location || jobType !== 'All' || experienceLevel !== 'All' || minMatch > 0) && (
              <button
                onClick={resetFilters}
                className="px-2.5 py-1 rounded-lg bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-500/30 font-semibold flex items-center gap-1"
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
        <div className="glass-panel p-12 text-center rounded-3xl border-white/10">
          <Briefcase size={40} className="mx-auto text-slate-600 mb-3" />
          <h3 className="text-xl font-bold text-white mb-1">No Jobs Match Your Filters</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
            Try adjusting your search criteria, widening the minimum match score, or resetting the active filters.
          </p>
          <button onClick={resetFilters} className="btn btn-red btn-sm">
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
