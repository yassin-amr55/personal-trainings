import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Medal, X } from 'lucide-react';
import { Sport, Championship } from '../types';
import { localStorageAPI } from '../lib/localStorage';
import ConfirmDialog from './ConfirmDialog';

interface ChampionshipTrackerProps {
  sport: Sport;
  onBack: () => void;
}

type ChampionshipType = 'Normal' | 'Egyptian' | 'International';

export default function ChampionshipTracker({ sport, onBack }: ChampionshipTrackerProps) {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState<ChampionshipType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    place: '',
    award: '',
    date: '',
    penalties: '',
    image_url: '',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchChampionships();
  }, [sport]);

  const fetchChampionships = () => {
    setLoading(true);
    const allChampionships = localStorageAPI.getChampionships();
    setChampionships(allChampionships.filter(champ => champ.sport === sport).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    setLoading(false);
  };

  const handleTypeSelect = (type: ChampionshipType) => {
    setSelectedType(type);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    const newChampionship: Championship = {
      id: crypto.randomUUID(),
      sport,
      type: selectedType,
      name: formData.name,
      place: formData.place,
      award: formData.award,
      date: formData.date,
      penalties: formData.penalties,
      image_url: formData.image_url || null,
      created_at: new Date().toISOString(),
    };

    localStorageAPI.addChampionship(newChampionship);

    setFormData({ name: '', place: '', award: '', date: '', penalties: '', image_url: '' });
    setShowForm(false);
    setSelectedType(null);
    fetchChampionships();
  };

  const confirmDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleDelete = () => {
    if (!confirmDeleteId) return;
    localStorageAPI.deleteChampionship(confirmDeleteId);
    fetchChampionships();
    setConfirmDeleteId(null);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getTypeColor = (type: ChampionshipType) => {
    switch (type) {
      case 'Normal':
        return 'from-blue-600 to-blue-800';
      case 'Egyptian':
        return 'from-amber-600 to-amber-800';
      case 'International':
        return 'from-red-600 to-red-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-white mt-4">{sport} - Championship Tracker</h1>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {!showForm && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Select Championship Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(['Normal', 'Egyptian', 'International'] as ChampionshipType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${getTypeColor(type)} p-8 shadow-2xl transition-all duration-300 hover:scale-105`}
                  >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
                      <div className="p-4 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors duration-300">
                        <Trophy className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white text-center">
                        {type} Championship
                      </h3>
                    </div>

                    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-2xl transition-colors duration-300" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {showForm && selectedType && (
            <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 space-y-4 animate-fade-in">
              <h2 className="text-xl font-bold text-white">{selectedType} Championship</h2>

              <div>
                <label className="block text-slate-300 mb-2">Championship Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter championship name"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Place Achieved</label>
                <input
                  type="text"
                  required
                  value={formData.place}
                  onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g., 1st, 2nd, 3rd"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Award Received</label>
                <input
                  type="text"
                  required
                  value={formData.award}
                  onChange={(e) => setFormData({ ...formData, award: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter award details"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Championship Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Penalties</label>
                <input
                  type="text"
                  value={formData.penalties}
                  onChange={(e) => setFormData({ ...formData, penalties: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter penalties if any"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Award Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
                />
              </div>

              {formData.image_url && (
                <div className="relative">
                  <img src={formData.image_url} alt="Preview" className="w-full max-h-64 object-contain rounded-lg" />
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
                >
                  Save Championship
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedType(null);
                    setFormData({ name: '', place: '', award: '', date: '', penalties: '', image_url: '' });
                  }}
                  className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="text-center py-12 text-white">Loading...</div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">My Championships</h2>

              {championships.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-white/5">
                  <Medal className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-400">No championships recorded yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {championships.map((championship) => (
                    <div
                      key={championship.id}
                      className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
{championship.image_url ? (
  <div className="aspect-video relative group cursor-pointer" onClick={() => setSelectedImage(championship.image_url)}>
    <img
      src={championship.image_url}
      alt={championship.name}
      className="w-full h-full object-cover"
    />
  </div>
) : (
                        <div className={`aspect-video bg-gradient-to-br ${getTypeColor(championship.type as ChampionshipType)} flex items-center justify-center`}>
                          <Trophy className="w-16 h-16 text-white" />
                        </div>
                      )}

                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                            championship.type === 'Normal' ? 'bg-blue-600' :
                            championship.type === 'Egyptian' ? 'bg-amber-600' :
                            'bg-red-600'
                          } text-white`}>
                            {championship.type}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white">{championship.name}</h3>

                        <div className="space-y-1 text-sm">
                          <p className="text-slate-300">
                            Place: <span className="font-medium text-white">{championship.place}</span>
                          </p>
                          <p className="text-slate-300">
                            Award: <span className="font-medium text-white">{championship.award}</span>
                          </p>
                          <p className="text-slate-300">
                            Date: <span className="font-medium text-white">{new Date(championship.date).toLocaleDateString()}</span>
                          </p>
                          <p className="text-slate-300">
                            Penalties: <span className="font-medium text-white">{championship.penalties || 'None'}</span>
                          </p>
                        </div>

                        <button
                          onClick={() => confirmDelete(championship.id)}
                          className="w-full mt-4 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {confirmDeleteId && (
            <ConfirmDialog
              message="Are you sure you want to delete this championship?"
              onConfirm={handleDelete}
              onCancel={cancelDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
