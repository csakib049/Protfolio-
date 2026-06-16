import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2, Award } from 'lucide-react';
import api from '@/api';

const empty = { title: '', description: '', date: '' };

export default function AdminAchievements() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await api.get('/achievements');
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(empty);
    setFile(null);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm(item);
    setFile(null);
    setEditing(item._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('date', form.date || '');
    fd.append('description', form.description || '');
    if (file) fd.append('image', file);
    try {
      if (editing) {
        await api.put(`/achievements/${editing}`, fd);
      } else {
        await api.post('/achievements', fd);
      }
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this achievement?')) return;
    await api.delete(`/achievements/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Achievements & Awards</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-all"
        >
          <Plus size={18} /> Add Achievement
        </button>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowForm(false)}
        >
          <div className="glass rounded-3xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Achievement' : 'New Achievement'}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Achievement title"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm"
              />
              <input
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="Date (e.g. 2024)"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description (optional)"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm resize-none"
              />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*"
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {editing && form.image && !file && (
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <img src={form.image} alt="Current" className="w-16 h-12 rounded-lg object-cover" />
                  <span>Current image</span>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary/20 text-primary font-medium hover:bg-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {editing ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item._id} className="glass rounded-2xl p-6 group border border-white/5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0">
                    <Award size={22} className="text-yellow-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.date && <p className="text-xs text-gray-500 mt-0.5">{item.date}</p>}
                  {item.description && <p className="text-sm text-gray-400 mt-2">{item.description}</p>}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 hover:text-primary transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-1.5 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {!items.length && (
          <div className="text-center py-16 text-gray-500">
            <Award size={40} className="mx-auto mb-4 opacity-30" />
            <p>No achievements yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
