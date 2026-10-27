import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Users, 
  CheckCircle, 
  ArrowLeft, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { getCase, submitAccusation } from '../services/api';
import ConfirmationModal from '../components/ConfirmationModal';

export default function Accusation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mysteryCase, setMysteryCase] = useState(null);
  const [selectedSuspectId, setSelectedSuspectId] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Confirmation modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCaseData();
  }, [id]);

  const fetchCaseData = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await getCase(id);
      if (data.success && data.case) {
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

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (!selectedSuspectId) {
      setErrorMessage('Please select a suspect before proceeding.');
      return;
    }
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleConfirmAccusation = async () => {
    try {
      setIsSubmitting(true);
      const data = await submitAccusation(id, selectedSuspectId);
      if (data.success) {
        navigate(`/results/${id}`);
      } else {
        throw new Error(data.message || 'Accusation verification failed.');
      }
    } catch (err) {
      console.error('Accusation error:', err);
      setErrorMessage(err.message || 'Failed to process accusation.');
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-12 h-12 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4"></div>
        <p className="font-mono text-sm text-slate-400 tracking-wider">
          Assembling suspect lineup for accusation...
        </p>
      </div>
    );
  }

  if (errorMessage && !mysteryCase) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="font-cinzel text-2xl font-bold text-white mb-2">Lineup Unavailable</h1>
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

  const selectedSuspect = mysteryCase?.suspects.find((s) => s.id === selectedSuspectId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Return to Clues Link */}
      <div className="mb-6">
        <Link
          to={`/investigation/${id}`}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Investigation Room & Evidence</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-widest mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Formal Interrogation &bull; Final Stage</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white">
          Formal Accusation
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-lg mx-auto font-light">
          Review the suspects one last time. Select the person whom the evidence points to as the true culprit.
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-8 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-sm flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Suspect Lineup Selection Form */}
      <form onSubmit={handleOpenConfirm} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mysteryCase?.suspects.map((suspect, idx) => {
            const isSelected = selectedSuspectId === suspect.id;

            return (
              <label
                key={suspect.id}
                htmlFor={`suspect-${suspect.id}`}
                className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/10 scale-[1.01]'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                <input
                  type="radio"
                  id={`suspect-${suspect.id}`}
                  name="accusedSuspect"
                  value={suspect.id}
                  checked={isSelected}
                  onChange={() => setSelectedSuspectId(suspect.id)}
                  className="sr-only"
                />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      SUSPECT #{suspect.id.toUpperCase()}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-amber-500 border-amber-500 text-slate-950'
                          : 'border-slate-700 bg-slate-950'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>

                  <h3 className="font-cinzel text-lg font-bold text-slate-100 mb-2">
                    {suspect.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    {suspect.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Lineup Position #{idx + 1}</span>
                  {isSelected && (
                    <span className="text-amber-400 font-semibold">SELECTED TARGET</span>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        {/* Submit Accusation Button */}
        <div className="pt-4">
          <button
            type="submit"
            id="submit-accusation-btn"
            disabled={!selectedSuspectId}
            className="w-full py-4 rounded-xl text-base font-bold bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:via-amber-500 hover:to-red-500 text-white shadow-xl shadow-red-900/30 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>
              {selectedSuspectId
                ? `Accuse ${selectedSuspect?.name || 'Suspect'}`
                : 'Select a Suspect to Accuse'}
            </span>
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAccusation}
        suspectName={selectedSuspect?.name || 'the suspect'}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
