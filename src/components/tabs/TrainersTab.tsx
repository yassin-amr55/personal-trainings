import { useState, useEffect } from 'react';
import { Plus, User } from 'lucide-react';
import { Sport, Trainer } from '../../types';
import { localStorageAPI } from '../../lib/localStorage';

interface TrainersTabProps {
  sport: Sport;
}

export default function TrainersTab({ sport }: TrainersTabProps) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    fetchTrainers();
  }, [sport]);

  const fetchTrainers = () => {
    const allTrainers = localStorageAPI.getTrainers();
    setTrainers(allTrainers.filter(trainer => trainer.sport === sport).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTrainer: Trainer = {
      id: crypto.randomUUID(),
      sport,
      name: formData.name,
      start_date: formData.start_date,
      end_date: formData.end_date || null,
      created_at: new Date().toISOString(),
    };

    localStorageAPI.addTrainer(newTrainer);

    setFormData({ name: '', start_date: '', end_date: '' });
    setShowForm(false);
    fetchTrainers();
  };

  const handleDelete = (id: string) => {
    localStorageAPI.deleteTrainer(id);
    fetchTrainers();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Trainers</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Trainer</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 space-y-4">
          <div>
            <label className="block text-slate-300 mb-2">Trainer Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter trainer name"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Start Date</label>
            <input
              type="date"
              required
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">End Date (optional)</label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trainers.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-800/30 rounded-xl border border-white/5">
            <User className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No trainers added yet</p>
          </div>
        ) : (
          trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <User className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{trainer.name}</h3>
                </div>

                <div className="space-y-1 text-sm">
                  <p className="text-slate-300">
                    Started: <span className="font-medium text-white">{new Date(trainer.start_date).toLocaleDateString()}</span>
                  </p>
                  {trainer.end_date ? (
                    <p className="text-slate-300">
                      Ended: <span className="font-medium text-white">{new Date(trainer.end_date).toLocaleDateString()}</span>
                    </p>
                  ) : (
                    <p className="text-green-400 font-medium">Currently training</p>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(trainer.id)}
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
