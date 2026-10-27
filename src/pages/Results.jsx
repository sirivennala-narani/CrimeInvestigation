import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Trophy, 
  XCircle, 
  Users,
  Award, 
  FileCheck2, 
  RefreshCw, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getResult } from '../services/api';

export default function Results() {
  const { id } = useParams();

  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 300);
    } catch {
      // safe fallback if canvas is unavailable
    }
  };

  useEffect(() => {
    async function fetchResultData() {
      try {
        setLoading(true);
        setErrorMessage(null);
        const data = await getResult(id);
        if (data.success && data.result) {
          setResultData(data.result);

          // If verdict is correct, launch celebration confetti
          if (data.result.correct) {
            triggerCelebration();
          }
        } else {
          throw new Error(data.message || 'Failed to retrieve case results.');
        }
      } catch (err) {
        console.error('Error fetching result:', err);
        setErrorMessage(err.message || 'Unable to retrieve case results.');
      } finally {
        setLoading(false);
      }
    }

    fetchResultData();
  }, [id]);


  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-12 h-12 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4"></div>
        <p className="font-mono text-sm text-slate-400 tracking-wider">
          Unsealing forensic verdict and solution...
        </p>
      </div>
    );
  }

  if (errorMessage || !resultData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="font-cinzel text-2xl font-bold text-white mb-2">Verdict Unavailable</h1>
        <p className="text-slate-400 text-sm mb-6">{errorMessage}</p>
        <Link
          to={`/investigation/${id}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
        >
          <span>Return to Investigation</span>
        </Link>
      </div>
    );
  }

  const isSuccess = resultData.correct;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Top Rubber Stamp Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <span className="stamp-closed text-sm sm:text-base">
            CASE CLOSED &bull; OFFICIAL RECORD
          </span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white">
          Investigation Debrief
        </h1>
        <p className="text-slate-400 text-sm mt-2 font-mono">
          CASE ID: #{resultData.caseId} &bull; DIFFICULTY: {resultData.difficulty?.toUpperCase()}
        </p>
      </div>

      {/* Big Verdict Banner */}
      <div
        className={`rounded-2xl p-6 sm:p-8 border mb-8 flex flex-col sm:flex-row items-center gap-6 shadow-2xl ${
          isSuccess
            ? 'bg-gradient-to-br from-emerald-950/80 to-slate-900/90 border-emerald-500/50 shadow-emerald-950/30'
            : 'bg-gradient-to-br from-red-950/80 to-slate-900/90 border-red-500/50 shadow-red-950/30'
        }`}
      >
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 border ${
            isSuccess
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-red-500/20 text-red-400 border-red-500/40'
          }`}
        >
          {isSuccess ? <Trophy className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
            <span
              className={`text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold border ${
                isSuccess
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-red-500/10 text-red-300 border-red-500/30'
              }`}
            >
              Verdict: {isSuccess ? 'ACCUSATION VERIFIED' : 'ACCUSATION REFUTED'}
            </span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mb-2">
            {isSuccess
              ? 'Outstanding Detective Work! Case Solved.'
              : 'The True Culprit Slipped Away.'}
          </h2>

          <p className="text-sm text-slate-300 font-light leading-relaxed">
            {isSuccess
              ? `You correctly identified ${resultData.culprit} as the mastermind behind this crime.`
              : `You accused ${resultData.accusation}, but forensic evidence proves the actual culprit was ${resultData.culprit}.`}
          </p>
        </div>

        {/* Score Badge */}
        <div className="glass-panel px-6 py-4 rounded-xl border border-slate-700 text-center shrink-0 min-w-[140px]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
            Total Score
          </span>
          <span className="font-mono text-3xl font-black text-amber-400">
            {resultData.score}
          </span>
          <span className="text-xs font-mono text-slate-400 block">points</span>
        </div>
      </div>

      {/* Grid: Culprit Comparison & Detailed Score Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Accused vs Actual */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="font-cinzel text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Target Comparison</span>
          </h3>

          <div className="space-y-4 text-sm font-mono">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">YOUR ACCUSATION:</span>
              <strong className="text-base text-slate-100">{resultData.accusation}</strong>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">ACTUAL CULPRIT:</span>
              <strong className="text-base text-amber-400">{resultData.culprit}</strong>
            </div>
          </div>
        </div>

        {/* Score Breakdown (Section 23 Formula) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="font-cinzel text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Official Score Breakdown</span>
          </h3>

          <div className="space-y-2.5 text-xs font-mono text-slate-300">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Correct Accusation Bonus:</span>
              <strong className={isSuccess ? 'text-emerald-400' : 'text-slate-500'}>
                {isSuccess ? `+${resultData.difficulty === 'hard' ? 200 : resultData.difficulty === 'medium' ? 150 : 100} pts` : '0 pts'}
              </strong>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">
                Discovered Clues ({resultData.discoveredCluesCount} × 5):
              </span>
              <strong className="text-emerald-400">
                +{resultData.discoveredCluesCount * 5} pts
              </strong>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">
                Hint Deductions ({resultData.hintsUsed} × 10):
              </span>
              <strong className="text-red-400">
                -{resultData.hintsUsed * 10} pts
              </strong>
            </div>

            <div className="flex items-center justify-between pt-2 text-sm font-bold">
              <span className="text-slate-100">Final Detective Score:</span>
              <strong className="text-amber-400 text-base">{resultData.score} pts</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Explanation / Case Solution */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <FileCheck2 className="w-5 h-5 text-amber-400" />
          <h3 className="font-cinzel text-xl font-bold text-white">
            Forensic Solution & Case Explanation
          </h3>
        </div>

        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 text-sm sm:text-base text-slate-200 leading-relaxed font-light whitespace-pre-line">
          {resultData.explanation}
        </div>
      </section>

      {/* Start Another Mystery CTA Button */}
      <div className="text-center">
        <Link
          to="/create"
          id="start-another-mystery-btn"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Start Another Mystery</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
