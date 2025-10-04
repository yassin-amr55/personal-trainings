import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Sport } from '../types';
import TrainingDurationTab from './tabs/TrainingDurationTab';
import TrainersTab from './tabs/TrainersTab';
import NormalNotesTab from './tabs/NormalNotesTab';
import ImagesTab from './tabs/ImagesTab';
import MyHorsesTab from './tabs/MyHorsesTab';

interface NotesSectionProps {
  sport: Sport;
  onBack: () => void;
}

type Tab = 'duration' | 'trainers' | 'notes' | 'images' | 'horses';

export default function NotesSection({ sport, onBack }: NotesSectionProps) {
  const [activeTab, setActiveTab] = useState<Tab>('duration');

  const tabs: { id: Tab; label: string; show: boolean }[] = [
    { id: 'duration', label: 'Training Duration', show: true },
    { id: 'trainers', label: 'Trainers', show: true },
    { id: 'notes', label: 'Normal Notes', show: true },
    { id: 'images', label: 'Images', show: true },
    { id: 'horses', label: 'My Horses', show: sport === 'Horse Jumping' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-white mb-4">{sport} - Notes & Images</h1>

          <div className="flex flex-wrap gap-2">
            {tabs.filter(tab => tab.show).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'duration' && <TrainingDurationTab sport={sport} />}
          {activeTab === 'trainers' && <TrainersTab sport={sport} />}
          {activeTab === 'notes' && <NormalNotesTab sport={sport} />}
          {activeTab === 'images' && <ImagesTab sport={sport} />}
          {activeTab === 'horses' && sport === 'Horse Jumping' && <MyHorsesTab />}
        </div>
      </div>
    </div>
  );
}
