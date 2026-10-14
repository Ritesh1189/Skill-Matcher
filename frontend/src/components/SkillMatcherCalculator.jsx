import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calculator, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  RotateCcw,
  Check,
  X,
  Info,
  Sliders,
  Code2
} from 'lucide-react';
import { matchApi } from '../services/api';

const FREQUENT_SKILLS = [
  'Java', 'Spring Boot', 'React', 'MongoDB', 'SQL', 'Git', 'Docker', 
  'REST APIs', 'TypeScript', 'Node.js', 'Kubernetes', 'Python', 'AWS'
];

export default function SkillMatcherCalculator() {
  const [candidateSkillsInput, setCandidateSkillsInput] = useState('Java, React, Git');
  const [requiredSkillsInput, setRequiredSkillsInput] = useState('Java, React, SQL, Git');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const presets = [
    {
      name: 'Standard 75% Match (Project Spec)',
      desc: '3 of 4 required skills present',
      candidate: 'Java, React, Git',
      required: 'Java, React, SQL, Git',
    },
    {
      name: 'Senior Full Stack (80%)',
      desc: '4 of 5 required skills present',
      candidate: 'Java, Spring Boot, MongoDB, REST APIs, Git, Docker',
      required: 'Java, Spring Boot, MongoDB, REST APIs, Kubernetes',
    },
    {
      name: '100% Fit',
      desc: 'All requirements satisfied',
      candidate: 'React, TypeScript, JavaScript, CSS, HTML',
      required: 'React, TypeScript, JavaScript, CSS',
    },
    {
      name: 'Synonym Mapping (100%)',
      desc: 'React.js = React, SpringBoot = Spring Boot',
      candidate: 'React.js, SpringBoot, Mongo DB, REST APIs',
      required: 'React, Spring Boot, Mongo, REST API',
    }
  ];

  const calculate = async () => {
    const cSkills = candidateSkillsInput.split(',').map(s => s.trim()).filter(Boolean);
    const rSkills = requiredSkillsInput.split(',').map(s => s.trim()).filter(Boolean);

    setLoading(true);
    try {
      const data = await matchApi.calculate({
        candidateSkills: cSkills,
        requiredSkills: rSkills,
      });
      setResult(data);
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [candidateSkillsInput, requiredSkillsInput]);

  const loadPreset = (preset) => {
    setCandidateSkillsInput(preset.candidate);
    setRequiredSkillsInput(preset.required);
  };

  const toggleCandidateSkill = (skill) => {
    const current = candidateSkillsInput.split(',').map(s => s.trim()).filter(Boolean);
    const exists = current.some(s => s.toLowerCase() === skill.toLowerCase());
    let updated;
    if (exists) {
      updated = current.filter(s => s.toLowerCase() !== skill.toLowerCase());
    } else {
      updated = [...current, skill];
    }
    setCandidateSkillsInput(updated.join(', '));
  };

  const toggleRequiredSkill = (skill) => {
    const current = requiredSkillsInput.split(',').map(s => s.trim()).filter(Boolean);
    const exists = current.some(s => s.toLowerCase() === skill.toLowerCase());
    let updated;
    if (exists) {
      updated = current.filter(s => s.toLowerCase() !== skill.toLowerCase());
    } else {
      updated = [...current, skill];
    }
    setRequiredSkillsInput(updated.join(', '));
  };

  const candidateList = candidateSkillsInput.split(',').map(s => s.trim()).filter(Boolean);
  const requiredList = requiredSkillsInput.split(',').map(s => s.trim()).filter(Boolean);

  const score = result?.matchPercentage ?? 0;

  return (
    <div className="naukri-container" style={{ maxWidth: '1000px' }}>
      
      {/* Header Banner (Naukri Career Tool style) */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '28px', marginBottom: '24px', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '4px', background: '#ecfdf5', color: '#166534', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
              <Calculator size={13} />
              Career Skill Match Calculator
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Skill Overlap & Benchmark Engine
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '640px' }}>
              Simulate candidate vs employer skill requirements. Watch how Spring Boot evaluates matches using the transparent overlap equation: <span style={{ fontWeight: 700, color: '#0f172a' }}>Match = (Matched / Total Required) &times; 100</span>.
            </p>
          </div>

          <button
            onClick={() => {
              setCandidateSkillsInput('Java, React, Git');
              setRequiredSkillsInput('Java, React, SQL, Git');
            }}
            className="btn btn-secondary btn-sm"
          >
            <RotateCcw size={14} />
            Reset Defaults
          </button>
        </div>

        {/* Quick Presets */}
        <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Test Scenarios:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(p)}
              className="naukri-trending-chip"
              style={{ fontSize: '0.75rem', fontWeight: 600 }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Live Calculation Card */}
      {result && (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Calculated Match Score</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: score >= 70 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626' }}>
                  {score}%
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px', background: score >= 70 ? '#ecfdf5' : '#fef2f2', color: score >= 70 ? '#166534' : '#991b1b' }}>
                  {result.tier}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
                {result.explanation}
              </p>
            </div>

            {/* Large Progress Gauge */}
            <div style={{ textAlign: 'center', padding: '12px 20px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Matched Skills</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>
                {result.matchedCount} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>/ {result.totalRequiredCount}</span>
              </div>
            </div>
          </div>

          {/* Dual Balance Progress Bar: Green (Matched) vs Red (Missing) */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
              <span style={{ color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} />
                Matched: {result.matchedCount} of {result.totalRequiredCount} ({score}%)
              </span>
              <span style={{ color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <XCircle size={13} />
                Missing: {result.totalRequiredCount - result.matchedCount} ({Math.max(0, 100 - score).toFixed(1)}%)
              </span>
            </div>

            <div style={{ height: '12px', background: '#fee2e2', borderRadius: '9999px', overflow: 'hidden', display: 'flex' }}>
              <div 
                style={{ 
                  height: '100%', 
                  background: '#16a34a', 
                  width: `${score}%`,
                  transition: 'width 0.4s ease'
                }} 
              />
              <div 
                style={{ 
                  height: '100%', 
                  background: '#dc2626', 
                  width: `${Math.max(0, 100 - score)}%`,
                  transition: 'width 0.4s ease'
                }} 
              />
            </div>
          </div>

          {/* Breakdown: Green Matched vs Red Missing */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Matched */}
            <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={12} strokeWidth={3} />
                <span>Matched Skills ({result.matchedSkills?.length || 0})</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {result.matchedSkills?.length > 0 ? (
                  result.matchedSkills.map((sk, i) => (
                    <span key={i} className="skill-chip matched">
                      <Check size={10} strokeWidth={3} />
                      {sk}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>None matched</span>
                )}
              </div>
            </div>

            {/* Missing */}
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <X size={12} strokeWidth={3} />
                <span>Missing Requirements ({result.missingSkills?.length || 0})</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {result.missingSkills?.length > 0 ? (
                  result.missingSkills.map((sk, i) => (
                    <span key={i} className="skill-chip missing">
                      <X size={10} strokeWidth={3} />
                      {sk}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                    100% Fit! All skills present.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Editor for Candidate Skills vs Job Requirements */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Candidate Skills Input Box */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label className="form-label" style={{ color: '#16a34a' }}>
              Candidate Skills Profile ({candidateList.length})
            </label>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Comma-separated</span>
          </div>

          <textarea
            rows="3"
            className="form-control"
            value={candidateSkillsInput}
            onChange={(e) => setCandidateSkillsInput(e.target.value)}
            style={{ marginBottom: '12px', fontSize: '0.85rem' }}
          />

          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
            Click to add/remove skills:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {FREQUENT_SKILLS.map((sk, idx) => {
              const active = candidateList.some(s => s.toLowerCase() === sk.toLowerCase());
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleCandidateSkill(sk)}
                  className="skill-chip"
                  style={{
                    background: active ? '#ecfdf5' : '#f8fafc',
                    borderColor: active ? '#86efac' : '#cbd5e1',
                    color: active ? '#15803d' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {active ? <Check size={10} strokeWidth={3} /> : <Plus size={10} />}
                  {sk}
                </button>
              );
            })}
          </div>
        </div>

        {/* Job Required Skills Box */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label className="form-label">
              Employer Job Requirements ({requiredList.length})
            </label>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Comma-separated</span>
          </div>

          <textarea
            rows="3"
            className="form-control"
            value={requiredSkillsInput}
            onChange={(e) => setRequiredSkillsInput(e.target.value)}
            style={{ marginBottom: '12px', fontSize: '0.85rem' }}
          />

          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
            Click to add/remove requirements:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {FREQUENT_SKILLS.map((sk, idx) => {
              const active = requiredList.some(s => s.toLowerCase() === sk.toLowerCase());
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleRequiredSkill(sk)}
                  className="skill-chip"
                  style={{
                    background: active ? '#f1f5f9' : '#f8fafc',
                    borderColor: active ? '#94a3b8' : '#cbd5e1',
                    color: active ? '#0f172a' : '#475569',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {active ? <Check size={10} strokeWidth={3} /> : <Plus size={10} />}
                  {sk}
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
