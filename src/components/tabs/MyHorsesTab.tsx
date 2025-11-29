import { useState, useEffect } from 'react';
import { Plus, Trophy, X } from 'lucide-react';
import { Horse } from '../../types';
import { localStorageAPI } from '../../lib/localStorage';

export default function MyHorsesTab() {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female',
    acquired_date: '',
    image_url: '',
  });
  const [imageError, setImageError] = useState<string | null>(null);
  const [processingImage, setProcessingImage] = useState(false);

  useEffect(() => {
    fetchHorses();
  }, []);

  const fetchHorses = () => {
    const allHorses = localStorageAPI.getHorses();
    setHorses(allHorses.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newHorse: Horse = {
      id: crypto.randomUUID(),
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      acquired_date: formData.acquired_date,
      image_url: formData.image_url || null,
      created_at: new Date().toISOString(),
    };

    localStorageAPI.addHorse(newHorse);

    setFormData({ name: '', age: '', gender: 'Male', acquired_date: '', image_url: '' });
    setShowForm(false);
    fetchHorses();
  };

  const handleDelete = (id: string) => {
    localStorageAPI.deleteHorse(id);
    fetchHorses();
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

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
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
    setProcessingImage(true);

    try {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Image file is too large. Please select an image smaller than 10MB.');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file.');
      }

      const compressedImage = await compressImage(file);
      setFormData({ ...formData, image_url: compressedImage });
    } catch (error) {
      setImageError(error instanceof Error ? error.message : 'Failed to process image');
      setFormData({ ...formData, image_url: '' });
    } finally {
      setProcessingImage(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Horses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Horse</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 space-y-4">
          <div>
            <label className="block text-slate-300 mb-2">Horse Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter horse name"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Age</label>
            <input
              type="text"
              required
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="e.g., 5 years"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Acquired Date</label>
            <input
              type="date"
              required
              value={formData.acquired_date}
              onChange={(e) => setFormData({ ...formData, acquired_date: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={processingImage}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {imageError && (
              <p className="mt-2 text-sm text-red-400">{imageError}</p>
            )}
            {processingImage && (
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
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({ name: '', age: '', gender: 'Male', acquired_date: '', image_url: '' });
                setImageError(null);
              }}
              className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {horses.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-800/30 rounded-xl border border-white/5">
            <Trophy className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No horses added yet</p>
          </div>
        ) : (
          horses.map((horse) => (
            <div
              key={horse.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              {horse.image_url ? (
                <div className="aspect-video">
                  <img
                    src={horse.image_url}
                    alt={horse.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-amber-900/50 to-amber-800/50 flex items-center justify-center">
                  <Trophy className="w-16 h-16 text-amber-400" />
                </div>
              )}

              <div className="p-6 space-y-3">
                <h3 className="text-xl font-bold text-white">{horse.name}</h3>

                <div className="space-y-1 text-sm">
                  <p className="text-slate-300">
                    Age: <span className="font-medium text-white">{horse.age}</span>
                  </p>
                  <p className="text-slate-300">
                    Gender: <span className="font-medium text-white">{horse.gender}</span>
                  </p>
                  <p className="text-slate-300">
                    Acquired: <span className="font-medium text-white">{new Date(horse.acquired_date).toLocaleDateString()}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(horse.id)}
                  className="w-full mt-4 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
