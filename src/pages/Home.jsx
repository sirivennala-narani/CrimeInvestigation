import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  FileText, 
  ShieldCheck, 
  Lightbulb, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Award,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function Home() {
  const sampleCases = [
    {
      title: "The Midnight Gallery Heist",
      premise: "A priceless Renaissance painting is slashed from its frame during an ultra-secure VIP preview.",
      difficulty: "Medium",
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30"
    },
    {
      title: "The Vanishing Heiress Brooch",
      premise: "A 50-carat blue diamond vanishes from a locked suite on a transcontinental snowbound express.",
      difficulty: "Easy",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
    },
    {
      title: "Cyanide at Chateau Noir",
      premise: "A wealthy tech magnate collapses after proposing a toast from an unopened bottle of vintage vintage wine.",
      difficulty: "Hard",
      badgeColor: "text-red-400 bg-red-500/10 border-red-500/30"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/15 via-amber-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-blue-600/10 blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 text-center px-4 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-amber-500/30 text-amber-300 text-xs font-mono mb-8 uppercase tracking-widest animate-pulse-glow">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Next-Gen Detective Simulation &bull; Powered by Gemini</span>
        </div>

        <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Unmask The Culprit with <br />
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
            Generative Detective AI
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
          Step into the forensic squad room. Provide any crime premise or select a mystery theme, and our Gemini-powered engine will dynamically construct a complete criminal case with suspects, hidden clues, and hints.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/create"
            id="start-investigation-btn"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            <Search className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span>Start Investigation</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-6 py-4 rounded-xl text-sm font-semibold text-slate-300 hover:text-white glass-panel hover:bg-slate-800/60 border border-slate-700/60 transition-colors flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>How Investigation Works</span>
          </a>
        </div>

        {/* Noir Crime Tape Ribbon */}
        <div className="mt-14 max-w-3xl mx-auto rounded-lg overflow-hidden shadow-xl border border-amber-500/40 transform -rotate-1 hover:rotate-0 transition-transform">
          <div className="crime-tape py-2 px-6 flex items-center justify-between text-slate-950 font-mono font-black text-xs uppercase tracking-widest">
            <span>⚠️ CRIME SCENE EVIDENCE &bull; DO NOT CROSS ⚠️</span>
            <span className="hidden sm:inline">AUTHENTIC MYSTERY LOGS</span>
            <span>POLICE BUREAU FORENSICS</span>
          </div>
        </div>
      </section>

      {/* Brief Instructions / How It Works */}
      <section id="how-it-works" className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            Field Manual
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white mt-1">
            Standard Investigation Protocol
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
            Everything you need to know before stepping into the interrogation room.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              icon: FileText,
              title: "Define Premise",
              desc: "Enter any mystery premise or scenario, pick a difficulty from Easy to Hard, and generate a unique case file."
            },
            {
              step: "02",
              icon: Search,
              title: "Discover Clues",
              desc: "Carefully analyze forensic evidence on the board. Each clue uncovers critical details and awards +5 points."
            },
            {
              step: "03",
              icon: Lightbulb,
              title: "Request Hints",
              desc: "Stuck on a contradictory alibi? Consult intelligence hints wisely—each hint incurs a tactical -10 point deduction."
            },
            {
              step: "04",
              icon: ShieldCheck,
              title: "Accuse & Unmask",
              desc: "Select the true culprit from the suspect lineup. The server evaluates your deduction and calculates your score."
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl relative border border-slate-800/80 hover:border-amber-500/40 transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-slate-600 group-hover:text-amber-500/60 transition-colors">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2 font-cinzel">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sample Cases Showcase */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            Sample Cases
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mt-1">
            Sample Case Files in The Archives
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleCases.map((c, i) => (
            <div
              key={i}
              className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${c.badgeColor}`}>
                    {c.difficulty}
                  </span>
                  <span className="text-xs font-mono text-slate-500">CASE #00{i + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 font-cinzel mb-2">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 font-light">
                  "{c.premise}"
                </p>
              </div>

              <Link
                to={`/create?premise=${encodeURIComponent(c.premise)}&difficulty=${c.difficulty.toLowerCase()}`}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all text-center flex items-center justify-center gap-2"
              >
                <span>Investigate This Premise</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
