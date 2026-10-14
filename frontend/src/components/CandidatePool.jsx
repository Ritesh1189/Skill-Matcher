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
  Sparkles,
  Mail,
  Award
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
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 bg-slate-900 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Users size={14} />
              Candidate Directory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Verified Talent & Skill Profiles
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Explore active candidates, their verified skill proficiencies, and portfolio links.
          </p>
        </div>

        <div className="text-xs font-bold px-4 py-2 rounded-2xl bg-white/10 text-white border border-white/20 self-start sm:self-auto">
          <span className="text-emerald-400 font-extrabold text-base mr-1">{filteredCandidates.length}</span>
          <span>Candidates Available</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-white/15 bg-slate-900/90 space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
          <input
            type="text"
            className="form-control pl-12 text-sm"
            placeholder="Search candidates by name, job title, bio, or skill keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Skill Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-xs font-bold text-slate-300 mr-1 flex items-center gap-1 uppercase tracking-wider">
            <Tag size={12} className="text-emerald-400" />
            Filter by Skill:
          </span>
          <button
            onClick={() => setSelectedSkill('')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
              selectedSkill === '' 
                ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30' 
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            All Skills ({candidates.length})
          </button>
          {allSkills.map((skill, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSkill(selectedSkill === skill ? '' : skill)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                selectedSkill === skill 
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30' 
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
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
        <div className="glass-panel p-12 text-center rounded-3xl border border-white/15 bg-slate-900/90">
          <p className="text-slate-300 text-sm font-medium">No candidates found matching criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCandidates.map((cand) => (
            <div 
              key={cand.id} 
              className="glass-panel p-6 rounded-3xl border border-white/15 bg-slate-900/90 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-2xl transition-all"
            >
              <div>
                {/* Header with Avatar and Basic Info */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center font-black text-xl text-slate-950 shadow-md shadow-emerald-500/30 shrink-0">
                    {cand.name ? cand.name.charAt(0) : 'C'}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base leading-snug">
                      {cand.name}
                    </h3>
                    <p className="text-xs text-emerald-400 font-bold mt-0.5">
                      {cand.title || 'Software Engineer'}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-emerald-400" />
                        {cand.location || 'Remote'}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-300">
                        {cand.experienceYears || 0}+ yrs exp
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio Snippet */}
                {cand.bio && (
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4 bg-slate-950/50 p-2.5 rounded-xl border border-white/10">
                    {cand.bio}
                  </p>
                )}

                {/* Skills Chips in Green */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Core Technical Skills ({cand.skills?.length || 0}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cand.skills && cand.skills.length > 0 ? (
                      cand.skills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          onClick={() => setSelectedSkill(skill)}
                          className={`skill-chip text-xs font-bold cursor-pointer transition-all ${
                            selectedSkill === skill ? 'matched scale-105' : 'matched'
                          }`}
                        >
                          <CheckCircle2 size={11} className="stroke-[3]" />
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">No skills listed yet</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer: Education & Links */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 truncate max-w-[170px]">
                  <GraduationCap size={13} className="text-emerald-400 shrink-0" />
                  <span className="truncate">{cand.education || 'Computer Science'}</span>
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  {cand.email && (
                    <a 
                      href={`mailto:${cand.email}`}
                      className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-emerald-500 hover:text-white transition-all"
                      title={`Email ${cand.name}`}
                    >
                      <Mail size={13} />
                    </a>
                  )}
                  {cand.githubUrl && (
                    <a 
                      href={cand.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-emerald-500 hover:text-white transition-all"
                      title="GitHub"
                    >
                      <Code2 size={13} />
                    </a>
                  )}
                  {cand.linkedinUrl && (
                    <a 
                      href={cand.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-emerald-500 hover:text-white transition-all"
                      title="LinkedIn"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
