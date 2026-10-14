import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calculator, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  RotateCcw,
  Check,
  Info
} from 'lucide-react';
import { matchApi } from '../services/api';
import MatchScoreBadge from './MatchScoreBadge';

export default function SkillMatcherCalculator() {
  const [candidateSkillsInput, setCandidateSkillsInput] = useState('Java, React, Git');
  const [requiredSkillsInput, setRequiredSkillsInput] = useState('Java, React, SQL, Git');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const presets = [
    {
      name: 'Project Guidance Example (75%)',
      candidate: 'Java, React, Git',
      required: 'Java, React, SQL, Git',
    },
    {
      name: 'Senior Java & Spring Boot (80%)',
      candidate: 'Java, Spring Boot, MongoDB, REST APIs, Git, Docker',
      required: 'Java, Spring Boot, MongoDB, REST APIs, Kubernetes',
    },
    {
      name: 'Frontend Specialist (100%)',
      candidate: 'React, TypeScript, JavaScript, CSS, HTML, Redux',
      required: 'React, TypeScript, CSS, HTML',
    },
    {
      name: 'Skill Synonym Test (100%)',
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-indigo-500/30 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Calculator size={20} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Transparent Matching Algorithm
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Skill-Based Matching Playground
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Test and verify the overlap formula implemented in Spring Boot. Change the candidate profile skills or job requirements to watch the percentage and tier dynamically recompute.
        </p>

        {/* Quick Presets */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400">Try Presets:</span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(preset)}
              className="text-xs font-medium px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Input Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Candidate Skills Input */}
        <div className="glass-panel p-6 rounded-2xl border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <span>Candidate Listed Skills</span>
            </label>
            <span className="text-[11px] text-slate-500">Comma-separated</span>
          </div>

          <textarea
            rows="3"
            className="form-control font-mono text-xs"
            value={candidateSkillsInput}
            onChange={(e) => setCandidateSkillsInput(e.target.value)}
            placeholder="e.g. Java, React, Git, Docker"
          />

          <div className="mt-3 flex flex-wrap gap-1.5">
            {candidateSkillsInput.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => (
              <span key={i} className="skill-chip text-xs bg-indigo-950/40 text-indigo-300 border-indigo-800/40">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Job Required Skills Input */}
        <div className="glass-panel p-6 rounded-2xl border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span>Job Required Skills</span>
            </label>
            <span className="text-[11px] text-slate-500">Comma-separated</span>
          </div>

          <textarea
            rows="3"
            className="form-control font-mono text-xs"
            value={requiredSkillsInput}
            onChange={(e) => setRequiredSkillsInput(e.target.value)}
            placeholder="e.g. Java, React, SQL, Git"
          />

          <div className="mt-3 flex flex-wrap gap-1.5">
            {requiredSkillsInput.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => (
              <span key={i} className="skill-chip text-xs bg-cyan-950/40 text-cyan-300 border-cyan-800/40">
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Live Calculation Output Card */}
      {result && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-700 bg-gradient-to-b from-slate-900/90 to-slate-950/90">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Calculated Overlap Result
              </span>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
                <span>Match Score:</span>
                <span className={`text-2xl font-black ${
                  result.matchPercentage >= 80 ? 'text-emerald-400' : result.matchPercentage >= 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {result.matchPercentage}%
                </span>
              </h2>
            </div>

            <MatchScoreBadge 
              score={result.matchPercentage}
              matchedCount={result.matchedCount}
              totalCount={result.totalRequiredCount}
              size="lg"
            />
          </div>

          {/* Mathematical Formula Display */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 mb-6">
            <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Info size={13} />
              <span>Execution Formula</span>
            </div>
            <div className="text-sm py-1 font-bold">
              Match score = ({result.matchedCount} / {result.totalRequiredCount}) × 100 = {result.matchPercentage}%
            </div>
            <div className="text-slate-400 text-xs mt-1 font-sans">
              {result.explanation}
            </div>
          </div>

          {/* Breakdown Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Matched */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <CheckCircle2 size={14} />
                <span>Matched Skills ({result.matchedSkills?.length || 0})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {result.matchedSkills?.length > 0 ? (
                  result.matchedSkills.map((s, i) => (
                    <span key={i} className="skill-chip matched text-xs">
                      <Check size={11} className="stroke-[3]" />
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No skills matched</span>
                )}
              </div>
            </div>

            {/* Missing */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <XCircle size={14} />
                <span>Missing Skills ({result.missingSkills?.length || 0})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {result.missingSkills?.length > 0 ? (
                  result.missingSkills.map((s, i) => (
                    <span key={i} className="skill-chip missing text-xs">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400 font-medium">None! All requirements satisfied.</span>
                )}
              </div>
            </div>

            {/* Additional Bonus Skills */}
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Sparkles size={14} />
                <span>Candidate Bonus Skills ({result.additionalSkills?.length || 0})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {result.additionalSkills?.length > 0 ? (
                  result.additionalSkills.map((s, i) => (
                    <span key={i} className="skill-chip text-xs bg-indigo-900/30 text-indigo-300 border-indigo-700/40">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No additional skills</span>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
