import { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Sport, NormalNote } from '../../types';
import { supabase } from '../../lib/supabase';

interface NormalNotesTabProps {
  sport: Sport;
}

export default function NormalNotesTab({ sport }: NormalNotesTabProps) {
  const [notes, setNotes] = useState<NormalNote[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [sport]);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('normal_notes')
      .select('*')
      .eq('sport', sport)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setNotes(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('normal_notes').insert({
      sport,
      content,
    });

    if (!error) {
      setContent('');
      setShowForm(false);
      fetchNotes();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('normal_notes')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchNotes();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Normal Notes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Note</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 space-y-4">
          <div>
            <label className="block text-slate-300 mb-2">Note</label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
              placeholder="Write your notes here..."
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

      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-white/5">
            <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No notes yet</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-400">
                    {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </div>
              <p className="text-slate-200 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
