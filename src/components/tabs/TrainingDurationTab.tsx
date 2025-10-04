import { useState, useEffect } from 'react';
import { Plus, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Sport, TrainingDurationNote } from '../../types';
import { localStorageAPI } from '../../lib/localStorage';

interface TrainingDurationTabProps {
  sport: Sport;
}

export default function TrainingDurationTab({ sport }: TrainingDurationTabProps) {
  const [notes, setNotes] = useState<TrainingDurationNote[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    is_continuing: false,
  });

  useEffect(() => {
    fetchNotes();
  }, [sport]);

  const fetchNotes = () => {
    const allNotes = localStorageAPI.getTrainingDurationNotes();
    setNotes(allNotes.filter(note => note.sport === sport).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newNote: TrainingDurationNote = {
      id: crypto.randomUUID(),
      sport,
      start_date: formData.start_date,
      end_date: formData.is_continuing ? null : formData.end_date,
      is_continuing: formData.is_continuing,
      created_at: new Date().toISOString(),
    };

    localStorageAPI.addTrainingDurationNote(newNote);

    setFormData({ start_date: '', end_date: '', is_continuing: false });
    setShowForm(false);
    fetchNotes();
  };

  const handleDelete = (id: string) => {
    localStorageAPI.deleteTrainingDurationNote(id);
    fetchNotes();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Training Duration</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Entry</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 space-y-4">
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

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="continuing"
              checked={formData.is_continuing}
              onChange={(e) => setFormData({ ...formData, is_continuing: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="continuing" className="text-slate-300">Still continuing</label>
          </div>

          {!formData.is_continuing && (
            <div>
              <label className="block text-slate-300 mb-2">End Date</label>
              <input
                type="date"
                required={!formData.is_continuing}
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
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
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-white/5">
            <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No training duration entries yet</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    {note.is_continuing ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-slate-400" />
                    )}
                    <span className="text-lg font-semibold text-white">
                      {note.is_continuing ? 'Ongoing Training' : 'Completed Training'}
                    </span>
                  </div>
                  <p className="text-slate-300">
                    Started: <span className="font-medium">{new Date(note.start_date).toLocaleDateString()}</span>
                  </p>
                  {!note.is_continuing && note.end_date && (
                    <p className="text-slate-300">
                      Ended: <span className="font-medium">{new Date(note.end_date).toLocaleDateString()}</span>
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
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
