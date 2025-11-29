import { useState } from 'react';
import { Sport } from '../types';
import { Target, Anchor, Waves, Flame, Award, Download, Upload } from 'lucide-react';
import { localStorageAPI } from '../lib/localStorage';

interface HomePageProps {
  onSelectSport: (sport: Sport) => void;
}

const sports: { name: Sport; icon: typeof Target; gradient: string }[] = [
  { name: 'Kickboxing', icon: Flame, gradient: 'from-red-600 to-red-800' },
  { name: 'Archery', icon: Target, gradient: 'from-blue-600 to-blue-800' },
  { name: 'Horse Jumping', icon: Award, gradient: 'from-amber-600 to-amber-800' },
  { name: 'Swimming', icon: Waves, gradient: 'from-cyan-600 to-cyan-800' },
  { name: 'Sailing', icon: Anchor, gradient: 'from-slate-600 to-slate-800' },
];

export default function HomePage({ onSelectSport }: HomePageProps) {
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleExport = () => {
    try {
      const data = {
        championships: localStorageAPI.getChampionships(),
        normalNotes: localStorageAPI.getNormalNotes(),
        trainers: localStorageAPI.getTrainers(),
        trainingDurationNotes: localStorageAPI.getTrainingDurationNotes(),
        sportImages: localStorageAPI.getSportImages(),
        horses: localStorageAPI.getHorses(),
        exportDate: new Date().toISOString(),
      };

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sports-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ text: 'Data exported successfully!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to export data', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Validate data structure
        if (!data.championships || !Array.isArray(data.championships)) {
          throw new Error('Invalid backup file format');
        }

        // Import all data
        if (data.championships) {
          data.championships.forEach((item: any) => localStorageAPI.addChampionship(item));
        }
        if (data.normalNotes) {
          data.normalNotes.forEach((item: any) => localStorageAPI.addNormalNote(item));
        }
        if (data.trainers) {
          data.trainers.forEach((item: any) => localStorageAPI.addTrainer(item));
        }
        if (data.trainingDurationNotes) {
          data.trainingDurationNotes.forEach((item: any) => localStorageAPI.addTrainingDurationNote(item));
        }
        if (data.sportImages) {
          data.sportImages.forEach((item: any) => localStorageAPI.addSportImage(item));
        }
        if (data.horses) {
          data.horses.forEach((item: any) => localStorageAPI.addHorse(item));
        }

        setMessage({ text: 'Data imported successfully!', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        setMessage({ text: 'Failed to import data. Invalid file format.', type: 'error' });
        setTimeout(() => setMessage(null), 3000);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pb-32">
      <header className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          My Training Tracker
        </h1>
        <p className="text-xl text-slate-300">Track your progress across all your sports</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl w-full">
        {sports.map((sport, index) => {
          const Icon = sport.icon;
          return (
            <button
              key={sport.name}
              onClick={() => onSelectSport(sport.name)}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${sport.gradient} p-8 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-red-500/20 animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors duration-300">
                  <Icon className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white text-center">
                  {sport.name}
                </h2>
              </div>

              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-2xl transition-colors duration-300" />
            </button>
          );
        })}
      </div>

      {/* Export/Import Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg w-full sm:w-auto"
          >
            <Download className="w-5 h-5" />
            <span>Export Data</span>
          </button>

          <label className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg cursor-pointer w-full sm:w-auto">
            <Upload className="w-5 h-5" />
            <span>Import Data</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {message && (
          <div className={`mt-3 text-center text-sm font-medium ${
            message.type === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
