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
  ArrowRight,
  TrendingUp,
  Sliders,
  Code2
} from 'lucide-react';
import { matchApi } from '../services/api';
import MatchScoreBadge from './MatchScoreBadge';

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
      name: 'Full Stack Java (80%)',
      desc: '4 of 5 required skills present',
      candidate: 'Java, Spring Boot, MongoDB, REST APIs, Git, Docker',
      required: 'Java, Spring Boot, MongoDB, REST APIs, Kubernetes',
    },
    {
      name: 'Perfect 100% Fit',
      desc: 'All requirements satisfied',
      candidate: 'React, TypeScript, JavaScript, CSS, HTML, Redux',
      required: 'React, TypeScript, JavaScript, CSS',
    },
    {
      name: 'Synonym Equivalence (100%)',
      desc: 'React.js = React, SpringBoot = Spring Boot',
      candidate: 'React.js, SpringBoot, Mongo DB, REST APIs',
      required: 'React, Spring Boot, Mongo, REST API',
    },
    {
      name: 'Skill Gap / Low Fit (25%)',
      desc: 'Major skill gap detected',
      candidate: 'Python, Django',
      required: 'Java, Spring Boot, React, MongoDB',
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator size={14} />
                Live Algorithm Sandbox
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white">
                Green = Matched • Red = Missing
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Skill Overlap & Compatibility Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Dynamically simulate candidates against job requirements. Click skill pills below or type your own to see real-time match scores computed by the Spring Boot backend service.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => {
                setCandidateSkillsInput('Java, React, Git');
                setRequiredSkillsInput('Java, React, SQL, Git');
              }}
              className="btn btn-secondary text-xs"
            >
              <RotateCcw size={14} />
              Reset Inputs
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Test Cases:</span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(preset)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-emerald-500 hover:text-white text-slate-200 border border-white/15 transition-all shadow-sm"
              title={preset.desc}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Calculation Result Banner */}
      {result && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-white/20 bg-slate-900 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Calculated Candidate Match Rating
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className={`text-4xl sm:text-5xl font-black tracking-tight ${
                  result.matchPercentage >= 70 ? 'text-emerald-400' : result.matchPercentage >= 50 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {result.matchPercentage}%
                </span>
                <span className="text-sm font-bold text-white uppercase px-3 py-1 rounded-full bg-white/10 border border-white/20">
                  {result.tier} Compatibility
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 font-medium">
                {result.explanation}
              </p>
            </div>

            <MatchScoreBadge 
              score={result.matchPercentage}
              matchedCount={result.matchedCount}
              totalCount={result.totalRequiredCount}
              size="lg"
            />
          </div>

          {/* Visual Dual Progress Balance Meter: Green (Matched) vs Red (Missing) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                Matched: {result.matchedCount} of {result.totalRequiredCount} skills ({result.matchPercentage}%)
              </span>
              <span className="text-red-400 flex items-center gap-1.5">
                <XCircle size={14} />
                Missing: {result.totalRequiredCount - result.matchedCount} skills ({Math.max(0, 100 - result.matchPercentage).toFixed(1)}%)
              </span>
            </div>

            <div className="h-4 rounded-full bg-slate-950 p-0.5 border border-white/20 overflow-hidden flex shadow-inner">
              <div 
                className="h-full rounded-l-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 shadow-lg shadow-emerald-500/50"
                style={{ width: `${result.matchPercentage}%` }}
              />
              <div 
                className="h-full rounded-r-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 shadow-lg shadow-red-500/50"
                style={{ width: `${Math.max(0, 100 - result.matchPercentage)}%` }}
              />
            </div>
          </div>

          {/* Mathematical Formula Explanation Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/15 font-mono text-xs text-slate-200">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-sans">
              <Info size={14} />
              <span>Project Specification Matching Rule</span>
            </div>
            <div className="text-sm font-extrabold text-white">
              Formula: Match score = ({result.matchedCount} matched / {result.totalRequiredCount} required) × 100 = <span className="text-emerald-400 font-black">{result.matchPercentage}%</span>
            </div>
          </div>

          {/* Detailed Skill Breakdown: Green Matched vs Red Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Green Matched Column */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/40 shadow-lg shadow-emerald-950/20">
              <div className="text-xs font-black text-emerald-300 uppercase tracking-wider flex items-center justify-between mb-3 pb-2 border-b border-emerald-500/30">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-400 stroke-[2.5]" />
                  <span>Matched Skills ({result.matchedSkills?.length || 0})</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                  + Score Points
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.matchedSkills?.length > 0 ? (
                  result.matchedSkills.map((s, i) => (
                    <span key={i} className="skill-chip matched text-xs font-bold">
                      <Check size={12} className="stroke-[3]" />
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills currently match the job criteria</span>
                )}
              </div>
            </div>

            {/* Red Missing Column */}
            <div className="p-4 rounded-2xl bg-red-950/40 border-2 border-red-500/40 shadow-lg shadow-red-950/20">
              <div className="text-xs font-black text-red-300 uppercase tracking-wider flex items-center justify-between mb-3 pb-2 border-b border-red-500/30">
                <span className="flex items-center gap-1.5">
                  <XCircle size={16} className="text-red-400 stroke-[2.5]" />
                  <span>Missing Requirements ({result.missingSkills?.length || 0})</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold text-[11px]">
                  Skills to Learn
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills?.length > 0 ? (
                  result.missingSkills.map((s, i) => (
                    <span key={i} className="skill-chip missing text-xs font-bold">
                      <X size={12} className="stroke-[3]" />
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    All requirements satisfied! Zero missing skills.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Interactive Input Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Candidate Profile Skills Editor */}
        <div className="glass-panel p-6 rounded-3xl border border-white/15 bg-slate-900/90 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={15} />
                <span>Candidate Profile Skills</span>
              </label>
              <p className="text-[11px] text-slate-400">Skills listed on applicant's profile</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {candidateList.length} skills
            </span>
          </div>

          <textarea
            rows="3"
            className="form-control font-mono text-xs font-semibold"
            value={candidateSkillsInput}
            onChange={(e) => setCandidateSkillsInput(e.target.value)}
            placeholder="Type candidate skills separated by commas..."
          />

          {/* Interactive 1-click Quick Toggles */}
          <div>
            <div className="text-[11px] font-bold text-white uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Click to add/remove candidate skills:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {FREQUENT_SKILLS.map((sk, idx) => {
                const isSelected = candidateList.some(s => s.toLowerCase() === sk.toLowerCase());
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleCandidateSkill(sk)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 border ${
                      isSelected 
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm shadow-emerald-500/30' 
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {isSelected ? <Check size={11} className="stroke-[3]" /> : <Plus size={11} />}
                    {sk}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Job Required Skills Editor */}
        <div className="glass-panel p-6 rounded-3xl border border-white/15 bg-slate-900/90 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Code2 size={15} className="text-emerald-400" />
                <span>Job Required Skills</span>
              </label>
              <p className="text-[11px] text-slate-400">Strict requirements posted by employer</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
              {requiredList.length} skills
            </span>
          </div>

          <textarea
            rows="3"
            className="form-control font-mono text-xs font-semibold"
            value={requiredSkillsInput}
            onChange={(e) => setRequiredSkillsInput(e.target.value)}
            placeholder="Type required job skills separated by commas..."
          />

          {/* Interactive 1-click Quick Toggles for Job Requirements */}
          <div>
            <div className="text-[11px] font-bold text-white uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Click to add/remove job requirements:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {FREQUENT_SKILLS.map((sk, idx) => {
                const isSelected = requiredList.some(s => s.toLowerCase() === sk.toLowerCase());
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleRequiredSkill(sk)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 border ${
                      isSelected 
                        ? 'bg-white text-slate-900 border-white shadow-sm font-extrabold' 
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {isSelected ? <Check size={11} className="stroke-[3]" /> : <Plus size={11} />}
                    {sk}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
