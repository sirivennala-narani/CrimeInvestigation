import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  HelpCircle, 
  ShieldAlert, 
  Flame, 
  Search, 
  Dice5, 
  Check, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { createCase } from '../services/api';

const INSPIRATION_PREMISES = [
  "A valuable diamond necklace disappears from the bride's dressing room during a high-society wedding.",
  "The lead researcher at an Arctic research station is found locked outside in a blizzard with the radio cables cut.",
  "A rare 17th-century manuscript vanishes from a locked museum vault with zero alarms triggered.",
  "The wealthy patriarch of a family winery collapses during a private cellar tasting with an unopened bottle of reserve wine.",
  "During a blackout at an international luxury train, a sealed diplomatic briefcase is switched with a replica."
];

export default function CreateCase() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [premise, setPremise] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const urlPremise = searchParams.get('premise');
    const urlDiff = searchParams.get('difficulty');
    if (urlPremise) setPremise(urlPremise);
    if (urlDiff && ['easy', 'medium', 'hard'].includes(urlDiff.toLowerCase())) {
      setDifficulty(urlDiff.toLowerCase());
    }
  }, [searchParams]);

  const handleRandomPreset = () => {
    const random = INSPIRATION_PREMISES[Math.floor(Math.random() * INSPIRATION_PREMISES.length)];
    setPremise(random);
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!premise.trim()) {
      setErrorMessage("Please enter a mystery premise to investigate.");
      return;
    }
    if (premise.trim().length < 5) {
      setErrorMessage("Please enter at least 5 characters for your premise.");
      return;
    }
    if (premise.length > 500) {
      setErrorMessage("Premise must not exceed 500 characters.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await createCase(premise.trim(), difficulty);
      if (data.success && data.caseId) {
        navigate(`/investigation/${data.caseId}`);
      } else {
        throw new Error(data.message || "Failed to create case file.");
      }
    } catch (err) {
      console.error("Case creation failed:", err);
      setErrorMessage(err.message || "Unable to generate mystery case. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const difficultyLevels = [
    {
      id: 'easy',
      name: 'Easy',
      suspects: 3,
      clues: 5,
      hints: 2,
      reward: 100,
      description: 'Compact suspect list with plenty of straightforward forensic clues. Great for rookie detectives.',
      color: 'emerald'
    },
    {
      id: 'medium',
      name: 'Medium',
      suspects: 4,
      clues: 7,
      hints: 3,
      reward: 150,
      description: 'Balanced mystery with intertwined motives, conflicting alibis, and subtle clues.',
      color: 'amber'
    },
    {
      id: 'hard',
      name: 'Hard',
      suspects: 5,
      clues: 9,
      hints: 3,
      reward: 200,
      description: 'Complex web of deception. Multiple convincing red herrings and forensic details.',
      color: 'red'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Case Initiation Form</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white">
          Commission a Mystery
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-lg mx-auto font-light">
          Specify the crime scene scenario and challenge level. Gemini will craft the story, suspects, and clues.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-8 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-sm flex items-start gap-3 animate-fade-in shadow-lg shadow-red-950/20">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Premise Section */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <label htmlFor="premise-input" className="text-sm font-bold text-slate-200 font-cinzel tracking-wide flex items-center gap-2">
              <span>Mystery Premise</span>
              <span className="text-amber-500">*</span>
            </label>
            <button
              type="button"
              id="inspiration-btn"
              onClick={handleRandomPreset}
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-mono transition-colors self-start sm:self-auto"
            >
              <Dice5 className="w-4 h-4" />
              <span>Random Inspiration</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              id="premise-input"
              rows={4}
              maxLength={500}
              disabled={isLoading}
              value={premise}
              onChange={(e) => setPremise(e.target.value)}
              placeholder="Enter a mystery premise... (e.g. A priceless emerald brooch disappears from a billionaire's penthouse during a thunderstorm)"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-light leading-relaxed disabled:opacity-50"
            />
            <div className="text-right mt-1.5">
              <span className={`text-xs font-mono ${premise.length >= 480 ? 'text-amber-400' : 'text-slate-500'}`}>
                {premise.length} / 500 characters
              </span>
            </div>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
          <label className="block text-sm font-bold text-slate-200 font-cinzel tracking-wide mb-4">
            Select Difficulty Level
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficultyLevels.map((lvl) => {
              const isSelected = difficulty === lvl.id;
              return (
                <div
                  key={lvl.id}
                  onClick={() => !isLoading && setDifficulty(lvl.id)}
                  id={`difficulty-${lvl.id}`}
                  className={`p-5 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500 shadow-lg shadow-amber-500/10 scale-[1.02]'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div>
                    <span className={`text-xs font-mono uppercase tracking-widest font-bold ${
                      lvl.id === 'easy' ? 'text-emerald-400' : lvl.id === 'medium' ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {lvl.name}
                    </span>
                    <h3 className="text-lg font-bold text-white font-cinzel mt-1">
                      {lvl.name} Case
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 font-light leading-relaxed">
                      {lvl.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                    <div>
                      <span className="text-slate-500 block">Suspects:</span>
                      <strong className="text-slate-200">{lvl.suspects} people</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Clues:</span>
                      <strong className="text-slate-200">{lvl.clues} evidence</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Hints:</span>
                      <strong className="text-slate-200">{lvl.hints} available</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Max Reward:</span>
                      <strong className="text-amber-400 font-bold">+{lvl.reward} pts</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            id="generate-mystery-btn"
            disabled={isLoading || !premise.trim()}
            className="w-full py-4 rounded-xl text-base font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin"></div>
                <span className="font-mono text-sm tracking-wide">
                  Generating your mystery with Gemini AI...
                </span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Generate Mystery & Open Case File</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
