import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  ExternalLink, 
  Tag,
  CheckCircle2,
  Mail
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
    <div className="naukri-container">
      
      {/* Header */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-card)', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', marginBottom: '4px' }}>
            <Users size={14} />
            Talent Search Directory
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Verified Candidate Profiles
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Explore active candidates, their verified skill sets, and technical backgrounds.
          </p>
        </div>

        <div style={{ padding: '8px 16px', borderRadius: '8px', background: '#ecfdf5', border: '1px solid #86efac', color: '#15803d', fontWeight: 800, fontSize: '0.85rem' }}>
          {filteredCandidates.length} Candidates Available
        </div>
      </div>

      {/* Search & Skill Filter Bar */}
      <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '16px', marginBottom: '20px', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '38px' }}
            placeholder="Search candidates by name, job title, bio, or skill keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter by skill chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Filter Skill:</span>
          <button
            onClick={() => setSelectedSkill('')}
            className="skill-chip"
            style={{
              background: selectedSkill === '' ? '#16a34a' : '#f8fafc',
              color: selectedSkill === '' ? '#ffffff' : '#475569',
              borderColor: selectedSkill === '' ? '#16a34a' : '#cbd5e1',
              cursor: 'pointer'
            }}
          >
            All Skills
          </button>
          {allSkills.map((sk, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSkill(selectedSkill === sk ? '' : sk)}
              className="skill-chip"
              style={{
                background: selectedSkill === sk ? '#16a34a' : '#f8fafc',
                color: selectedSkill === sk ? '#ffffff' : '#475569',
                borderColor: selectedSkill === sk ? '#16a34a' : '#cbd5e1',
                cursor: 'pointer'
              }}
            >
              {sk}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Grid */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading candidates...</div>
      ) : filteredCandidates.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '48px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>No candidates found matching your criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredCandidates.map((cand) => (
            <div 
              key={cand.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>
                    {cand.name ? cand.name.charAt(0) : 'C'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      {cand.name}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                      {cand.title || 'Software Developer'}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <MapPin size={12} />
                        {cand.location || 'Remote'}
                      </span>
                      <span>•</span>
                      <span>{cand.experienceYears || 0}+ yrs exp</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {cand.bio && (
                  <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, marginBottom: '12px', background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    {cand.bio}
                  </p>
                )}

                {/* Skills tags */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Verified Technical Skills ({cand.skills?.length || 0}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {cand.skills && cand.skills.map((sk, idx) => (
                      <span key={idx} className="skill-chip matched" style={{ fontSize: '0.7rem' }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <GraduationCap size={13} />
                  {cand.education || 'Computer Science'}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {cand.email && (
                    <a 
                      href={`mailto:${cand.email}`}
                      className="btn btn-secondary btn-sm"
                      title="Contact Candidate"
                    >
                      <Mail size={12} />
                      Email
                    </a>
                  )}
                  {cand.githubUrl && (
                    <a 
                      href={cand.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-white btn-sm"
                      title="GitHub"
                    >
                      GitHub
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
