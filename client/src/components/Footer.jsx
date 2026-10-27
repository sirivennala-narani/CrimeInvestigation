import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/60 bg-[#060911]/80 backdrop-blur-md py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-500/70" />
          <span className="font-mono">MYSTERY INVESTIGATION AI &bull; FULL-STACK DETECTIVE SIMULATOR</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Powered by</span>
          <span className="text-amber-400 font-medium inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Google Gemini API
          </span>
          <span>& Express + MongoDB</span>
        </div>
      </div>
    </footer>
  );
}
