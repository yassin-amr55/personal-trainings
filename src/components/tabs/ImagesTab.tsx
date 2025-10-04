import { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, X } from 'lucide-react';
import { Sport, SportImage } from '../../types';
import { localStorageAPI } from '../../lib/localStorage';
import ConfirmDialog from '../ConfirmDialog';

interface ImagesTabProps {
  sport: Sport;
}

export default function ImagesTab({ sport }: ImagesTabProps) {
  const [images, setImages] = useState<SportImage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, [sport]);

  const fetchImages = () => {
    setLoading(true);
    const allImages = localStorageAPI.getSportImages();
    setImages(allImages.filter(image => image.sport === sport).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newImage: SportImage = {
      id: crypto.randomUUID(),
      sport,
      image_url: imageUrl,
      created_at: new Date().toISOString(),
    };

    localStorageAPI.addSportImage(newImage);

    setImageUrl('');
    setShowForm(false);
    fetchImages();
  };

  const confirmDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleDelete = () => {
    if (!confirmDeleteId) return;
    localStorageAPI.deleteSportImage(confirmDeleteId);
    fetchImages();
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
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Images</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Image</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 space-y-4">
          <div>
            <label className="block text-slate-300 mb-2">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
            />
          </div>

          {imageUrl && (
            <div className="relative">
              <img src={imageUrl} alt="Preview" className="w-full max-h-64 object-contain rounded-lg" />
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={!imageUrl}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setImageUrl('');
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-slate-800/30 rounded-xl border border-white/5">
              <ImageIcon className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400">No images to show</p>
            </div>
          ) : (
            images.map((image) => (
              <div
                key={image.id}
                className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedImage(image.image_url)}
              >
                <div className="aspect-square">
                  <img
                    src={image.image_url}
                    alt="Sport"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(image.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {confirmDeleteId && (
        <ConfirmDialog
          message="Are you sure you want to delete this image?"
          onConfirm={handleDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
