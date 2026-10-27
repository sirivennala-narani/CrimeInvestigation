import React, { useEffect, useRef } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, suspectName, isSubmitting }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isSubmitting]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md glass-panel-glow rounded-2xl p-6 sm:p-7 border border-amber-500/30 text-left shadow-2xl relative animate-scale-up"
      >
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500">
              Final Accusation Protocol
            </span>
            <h2 id="modal-title" className="text-lg font-bold text-slate-100 font-cinzel">
              Confirm Suspect Accusation
            </h2>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 mb-6">
          <p className="text-sm text-slate-300 leading-relaxed">
            Are you sure you want to officially accuse{' '}
            <strong className="text-amber-400 font-semibold">{suspectName}</strong> as the culprit?
          </p>
          <p className="text-xs text-slate-400 mt-2 font-mono">
            ⚠️ Once submitted, the case file will be permanently sealed, the truth will be revealed, and your detective score will be finalized.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800/80 border border-slate-700/60 transition-colors"
          >
            Review Evidence Again
          </button>
          <button
            type="button"
            id="modal-confirm-accuse-btn"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-900/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Validating...</span>
              </>
            ) : (
              <span>Lock In Accusation</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
