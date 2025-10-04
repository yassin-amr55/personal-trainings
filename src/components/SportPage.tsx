import { useState } from 'react';
import { ArrowLeft, BookOpen, Trophy } from 'lucide-react';
import { Sport } from '../types';
import NotesSection from './NotesSection';
import ChampionshipTracker from './ChampionshipTracker';

interface SportPageProps {
  sport: Sport;
  onBack: () => void;
}

type Section = 'notes' | 'championships' | null;

export default function SportPage({ sport, onBack }: SportPageProps) {
  const [activeSection, setActiveSection] = useState<Section>(null);

  if (activeSection === 'notes') {
    return <NotesSection sport={sport} onBack={() => setActiveSection(null)} />;
  }

  if (activeSection === 'championships') {
    return <ChampionshipTracker sport={sport} onBack={() => setActiveSection(null)} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-white ml-6">{sport}</h1>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <button
            onClick={() => setActiveSection('notes')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-12 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
              <div className="p-6 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors duration-300">
                <BookOpen className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white text-center">
                Notes & Images
              </h2>
              <p className="text-slate-200 text-center">
                Track training duration, trainers, notes, and images
              </p>
            </div>

            <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-2xl transition-colors duration-300" />
          </button>

          <button
            onClick={() => setActiveSection('championships')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 to-red-800 p-12 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-red-500/20"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
              <div className="p-6 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors duration-300">
                <Trophy className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white text-center">
                Championship Tracker
              </h2>
              <p className="text-slate-200 text-center">
                Record your achievements and awards
              </p>
            </div>

            <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-2xl transition-colors duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
