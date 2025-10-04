import { Sport } from '../types';
import { Target, Anchor, Waves, Flame, Award } from 'lucide-react';

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
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
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
    </div>
  );
}
