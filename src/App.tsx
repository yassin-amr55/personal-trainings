import { useState } from 'react';
import { Sport } from './types';
import HomePage from './components/HomePage';
import SportPage from './components/SportPage';

function App() {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {selectedSport ? (
        <SportPage sport={selectedSport} onBack={() => setSelectedSport(null)} />
      ) : (
        <HomePage onSelectSport={setSelectedSport} />
      )}
    </div>
  );
}

export default App;
