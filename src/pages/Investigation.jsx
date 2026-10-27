import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  Compass, 
  Lightbulb, 
  CheckCircle, 
  Lock, 
  Unlock, 
  AlertCircle, 
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Eye,
  Award
} from 'lucide-react';
import { getCase, discoverClue, requestHint } from '../services/api';

export default function Investigation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mysteryCase, setMysteryCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Clue and hint action states
  const [discoveringClueId, setDiscoveringClueId] = useState(null);
  const [requestingHint, setRequestingHint] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    fetchCaseData();
  }, [id]);

  const fetchCaseData = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await getCase(id);
      if (data.success && data.case) {
        // If case is already completed, redirect to results
        if (data.case.completed) {
          navigate(`/results/${id}`);
          return;
        }
        setMysteryCase(data.case);
      } else {
        throw new Error(data.message || 'Failed to load case data.');
      }
    } catch (err) {
      console.error('Error fetching case:', err);
      setErrorMessage(err.message || 'Unable to load case file.');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscoverClue = async (clueId) => {
    try {
      setDiscoveringClueId(clueId);
      setActionError(null);
      const data = await discoverClue(id, clueId);
      if (data.success && data.clue) {
        setMysteryCase((prev) => {
          if (!prev) return prev;
          const updatedClues = prev.clues.map((c) =>
            c.id === clueId ? { ...c, text: data.clue.text, discovered: true } : c
          );
          return {
            ...prev,
            clues: updatedClues,
            score: data.score
          };
        });
      }
    } catch (err) {
      console.error('Error discovering clue:', err);
      setActionError(err.message || 'Failed to uncover clue.');
    } finally {
      setDiscoveringClueId(null);
    }
  };

  const handleRequestHint = async () => {
    try {
      setRequestingHint(true);
      setActionError(null);
      const data = await requestHint(id);
      if (data.success && data.hint) {
        setMysteryCase((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            hintsRemaining: data.hintsRemaining,
            hintsUsed: (prev.hintsUsed || 0) + 1,
            revealedHints: [...(prev.revealedHints || []), data.hint],
            score: data.score
          };
        });
      }
    } catch (err) {
      console.error('Error requesting hint:', err);
      setActionError(err.message || 'Failed to obtain hint.');
    } finally {
      setRequestingHint(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-12 h-12 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4"></div>
        <p className="font-mono text-sm text-slate-400 tracking-wider">
          Accessing encrypted police files...
        </p>
      </div>
    );
  }

  if (errorMessage || !mysteryCase) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="font-cinzel text-2xl font-bold text-white mb-2">Case File Missing</h1>
        <p className="text-slate-400 text-sm mb-6">{errorMessage || 'Case not found.'}</p>
        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
        >
          <span>Open a New Mystery</span>
        </Link>
      </div>
    );
  }

  const discoveredCount = mysteryCase.clues.filter((c) => c.discovered).length;
  const totalClues = mysteryCase.clues.length;
  const progressPercent = Math.round((discoveredCount / totalClues) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Top Breadcrumb & Status HUD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span className="uppercase tracking-widest text-amber-500">ACTIVE DOSSIER</span>
            <span>&bull;</span>
            <span className="uppercase tracking-wider">DIFFICULTY: {mysteryCase.difficulty}</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-white">
            {mysteryCase.title}
          </h1>
        </div>

        {/* Score & Clue Tracker HUD */}
        <div className="flex items-center gap-3">
          <div className="glass-panel px-4 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              Current Score
            </span>
            <span className="text-lg font-bold text-amber-400 font-mono">
              {mysteryCase.score} pts
            </span>
          </div>

          <div className="glass-panel px-4 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              Evidence Found
            </span>
            <span className="text-lg font-bold text-slate-200 font-mono">
              {discoveredCount}/{totalClues}
            </span>
          </div>

          <Link
            to={`/accusation/${id}`}
            id="make-accusation-header-btn"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-900/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Make Accusation</span>
          </Link>
        </div>
      </div>

      {/* Action Error Alert */}
      {actionError && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-sm flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Grid Layout: Left Column (Dossier & Suspects) + Right Column (Evidence Board & Hints) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Story & Suspects */}
        <div className="lg:col-span-7 space-y-8">
          {/* Incident Dossier */}
          <section className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h2 className="font-cinzel text-lg font-bold text-slate-100">
                  Incident Report & Background
                </h2>
              </div>
              <span className="stamp-confidential text-[10px]">CONFIDENTIAL</span>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed font-light whitespace-pre-line bg-slate-900/40 p-4 rounded-xl border border-slate-800/60">
              {mysteryCase.story}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Premise: "{mysteryCase.premise}"</span>
            </div>
          </section>

          {/* Suspects Lineup */}
          <section className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <h2 className="font-cinzel text-lg font-bold text-slate-100">
                  Persons of Interest ({mysteryCase.suspects.length})
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Lineup under investigation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mysteryCase.suspects.map((suspect, idx) => (
                <div
                  key={suspect.id}
                  className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        SUSPECT #{suspect.id.toUpperCase()}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">PO-0{idx + 1}</span>
                    </div>
                    <h3 className="font-cinzel text-base font-bold text-slate-100 mb-1.5">
                      {suspect.name}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      {suspect.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Evidence Board & Tactical Hints */}
        <div className="lg:col-span-5 space-y-8">
          {/* Evidence Board (Clues) */}
          <section className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <h2 className="font-cinzel text-lg font-bold text-slate-100">
                  Forensic Evidence ({discoveredCount}/{totalClues})
                </h2>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                +5 pts per clue
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 h-2 rounded-full mb-5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="space-y-3">
              {mysteryCase.clues.map((clue, index) => {
                const isDiscovered = clue.discovered;
                const isDiscovering = discoveringClueId === clue.id;

                return (
                  <div
                    key={clue.id}
                    className={`rounded-xl p-4 border transition-all ${
                      isDiscovered
                        ? 'bg-slate-900/90 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {isDiscovered ? (
                          <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                        )}
                        <span className="text-xs font-mono font-bold text-slate-300">
                          CLUE #{index + 1}
                        </span>
                      </div>

                      {isDiscovered ? (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Discovered (+5)
                        </span>
                      ) : (
                        <button
                          type="button"
                          id={`discover-clue-${clue.id}`}
                          onClick={() => handleDiscoverClue(clue.id)}
                          disabled={isDiscovering}
                          className="px-3 py-1 rounded-lg text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {isDiscovering ? (
                            <>
                              <span className="w-3 h-3 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin"></span>
                              <span>Revealing...</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Discover Clue</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {isDiscovered ? (
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light mt-1 animate-fade-in">
                        {clue.text}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 italic font-mono mt-1">
                        Encrypted forensic evidence. Click discover to analyze lab results.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Tactical Hints System */}
          <section className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <h2 className="font-cinzel text-lg font-bold text-slate-100">
                  Detective Hints
                </h2>
              </div>
              <span className="text-xs font-mono text-red-400">
                -10 pts deduction
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800 mb-4">
              <span className="text-xs font-mono text-slate-400">
                Hints Remaining: <strong className="text-slate-200">{mysteryCase.hintsRemaining}</strong>
              </span>

              <button
                type="button"
                id="request-hint-btn"
                onClick={handleRequestHint}
                disabled={requestingHint || mysteryCase.hintsRemaining <= 0}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {requestingHint ? (
                  <>
                    <span className="w-3 h-3 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin"></span>
                    <span>Consulting...</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Get Hint</span>
                  </>
                )}
              </button>
            </div>

            {/* Revealed Hints List */}
            {mysteryCase.revealedHints && mysteryCase.revealedHints.length > 0 ? (
              <div className="space-y-2.5">
                {mysteryCase.revealedHints.map((hint, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs sm:text-sm text-amber-200 leading-relaxed font-light flex items-start gap-2.5"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 block mb-0.5">
                        HINT #{idx + 1}
                      </span>
                      <span>{hint}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-slate-500 italic text-center py-2">
                No hints requested yet. Rely on deductive reasoning to protect your score!
              </p>
            )}
          </section>

          {/* Primary Action: Go to Accusation */}
          <div className="pt-2">
            <Link
              to={`/accusation/${id}`}
              id="proceed-to-accusation-btn"
              className="w-full py-4 rounded-xl text-base font-bold bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:via-amber-500 hover:to-red-500 text-white shadow-xl shadow-red-900/30 transition-all flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99]"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>Ready to Make Accusation</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
