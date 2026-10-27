import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Shield, PlusCircle, Sparkles } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <span className="font-cinzel text-lg font-bold tracking-wider text-slate-100 group-hover:text-amber-400 transition-colors">
              MYSTERY AI
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Detective Bureau
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              location.pathname === '/'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Home
          </Link>

          <Link
            to="/create"
            id="nav-new-case-btn"
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Case</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
