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
  const [editingId, setEditingId] = useState<string | null>(null);
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
  const [imageError, setImageError] = useState<string | null>(null);

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
    setEditingId(null);
    setFormData({ name: '', place: '', award: '', date: '', penalties: '', image_url: '' });
    setImageError(null);
    setShowForm(true);
  };

  const handleEdit = (championship: Championship) => {
    setEditingId(championship.id);
    setSelectedType(championship.type as ChampionshipType);
    setFormData({
      name: championship.name,
      place: championship.place,
      award: championship.award,
      date: championship.date,
      penalties: championship.penalties,
      image_url: championship.image_url || '',
    });
    setImageError(null);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    if (editingId) {
      // Update existing championship
      localStorageAPI.updateChampionship(editingId, {
        type: selectedType,
        name: formData.name,
        place: formData.place,
        award: formData.award,
        date: formData.date,
        penalties: formData.penalties,
        image_url: formData.image_url || null,
      });
      setEditingId(null);
    } else {
      // Create new championship
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
    }

    setFormData({ name: '', place: '', award: '', date: '', penalties: '', image_url: '' });
    setShowForm(false);
    setSelectedType(null);
    setImageError(null);
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

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Set max dimensions for mobile compatibility
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with quality 0.7 for better mobile performance
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          // Check if compressed image is still too large (> 1MB base64)
          if (compressedDataUrl.length > 1400000) {
            reject(new Error('Image is too large even after compression. Please use a smaller image.'));
          } else {
            resolve(compressedDataUrl);
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);
    setLoading(true);

    try {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Image file is too large. Please select an image smaller than 10MB.');
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file.');
      }

      const compressedImage = await compressImage(file);
      setFormData({ ...formData, image_url: compressedImage });
    } catch (error) {
      setImageError(error instanceof Error ? error.message : 'Failed to process image');
      setFormData({ ...formData, image_url: '' });
    } finally {
      setLoading(false);
    }
  };

  const getOrdinalSuffix = (num: string): string => {
    if (!num || num === '') return 'None';
    const n = parseInt(num);
    if (isNaN(n)) return 'None';
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
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
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Edit' : 'Add'} {selectedType} Championship
              </h2>

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
                  type="number"
                  min="1"
                  value={formData.place}
                  onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter place number (e.g., 1, 2, 3)"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Award Received</label>
                <input
                  type="text"
                  value={formData.award}
                  onChange={(e) => setFormData({ ...formData, award: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter award details (optional)"
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
                  disabled={loading}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {imageError && (
                  <p className="mt-2 text-sm text-red-400">{imageError}</p>
                )}
                {loading && (
                  <p className="mt-2 text-sm text-blue-400">Processing image...</p>
                )}
              </div>

              {formData.image_url && (
                <div className="relative">
                  <img src={formData.image_url} alt="Preview" className="w-full max-h-64 object-contain rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: '' })}
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingId ? 'Update' : 'Save'} Championship
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedType(null);
                    setEditingId(null);
                    setImageError(null);
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
                            Place: <span className="font-medium text-white">{getOrdinalSuffix(championship.place)}</span>
                          </p>
                          <p className="text-slate-300">
                            Award: <span className="font-medium text-white">{championship.award || 'None'}</span>
                          </p>
                          <p className="text-slate-300">
                            Date: <span className="font-medium text-white">{new Date(championship.date).toLocaleDateString()}</span>
                          </p>
                          <p className="text-slate-300">
                            Penalties: <span className="font-medium text-white">{championship.penalties || 'None'}</span>
                          </p>
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <button
                            onClick={() => handleEdit(championship)}
                            className="flex-1 px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(championship.id)}
                            className="flex-1 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all"
                          >
                            Delete
                          </button>
                        </div>
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

          {selectedImage && (
            <div 
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <img 
                src={selectedImage} 
                alt="Championship award" 
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
