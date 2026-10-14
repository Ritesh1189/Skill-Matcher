import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  ExternalLink, 
  Globe,
  Tag,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { candidatesApi } from '../services/api';

export default function CandidatePool({ onSelectCandidate }) {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const data = await candidatesApi.getAll();
      setCandidates(data || []);
    } catch (err) {
      console.error('Failed to load candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  // Collect unique skill tags across all candidates
  const allSkills = Array.from(
    new Set(candidates.flatMap(c => c.skills || []))
  ).sort();

  const filteredCandidates = candidates.filter(cand => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchesName = cand.name?.toLowerCase().includes(q);
      const matchesTitle = cand.title?.toLowerCase().includes(q);
      const matchesBio = cand.bio?.toLowerCase().includes(q);
      const matchesSkill = cand.skills?.some(s => s.toLowerCase().includes(q));
      if (!matchesName && !matchesTitle && !matchesBio && !matchesSkill) return false;
    }

    if (selectedSkill) {
      if (!cand.skills?.includes(selectedSkill)) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users size={24} className="text-cyan-400" />
            <span>Candidate Talent Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse verified job seeker profiles and explore their documented skill sets
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700/60">
          {filteredCandidates.length} Candidates Available
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border-slate-800 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            className="form-control pl-10"
            placeholder="Search candidates by name, job title, or technical keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Skill Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Tag size={12} />
            Filter Skill:
          </span>
          <button
            onClick={() => setSelectedSkill('')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
              selectedSkill === '' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Skills
          </button>
          {allSkills.map((skill, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSkill(selectedSkill === skill ? '' : skill)}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                selectedSkill === skill 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' 
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading candidates...</div>
      ) : filteredCandidates.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border-slate-800">
          <p className="text-slate-400 text-sm">No candidates found matching criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCandidates.map((cand) => (
            <div 
              key={cand.id} 
              className="glass-panel p-5 rounded-2xl border-slate-800 flex flex-col justify-between hover:border-slate-700 hover:shadow-xl transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-md shadow-cyan-500/20 shrink-0">
                    {cand.name ? cand.name.charAt(0) : 'C'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">
                      {cand.name}
                    </h3>
                    <p className="text-xs text-indigo-400 font-medium mt-0.5">
                      {cand.title || 'Software Developer'}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      {cand.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={11} /> {cand.location}
                        </span>
                      )}
                      {cand.experienceYears !== undefined && (
                        <span>• {cand.experienceYears}y exp</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {cand.bio && (
                  <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                    {cand.bio}
                  </p>
                )}

                {/* Education */}
                {cand.education && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-3 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                    <GraduationCap size={13} className="text-slate-500 shrink-0" />
                    <span className="truncate">{cand.education}</span>
                  </div>
                )}

                {/* Skills tags */}
                <div className="mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Skills ({cand.skills?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(cand.skills || []).map((skill, idx) => (
                      <span 
                        key={idx} 
                        className={`skill-chip text-xs ${
                          selectedSkill === skill ? 'bg-indigo-600 text-white border-indigo-500' : ''
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  {cand.githubUrl && (
                    <a href={cand.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-slate-800 hover:text-white" title="GitHub Profile">
                      <Code2 size={13} />
                    </a>
                  )}
                  {cand.linkedinUrl && (
                    <a href={cand.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-slate-800 hover:text-white" title="LinkedIn Profile">
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                <span className="text-[11px] text-slate-500">
                  {cand.email}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
