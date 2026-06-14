import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';
import api from '@/api';

const empty = { role: '', company: '', period: '', description: '', isCurrentRole: false };

export default function AdminExperiences() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await api.get('/experiences');
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (item) => { setForm(item); setEditing(item._id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await api.put(`/experiences/${editing}`, form);
      } else {
        await api.post('/experiences', form);
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
    if (!confirm('Delete this experience?')) return;
    await api.delete(`/experiences/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Experience</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-all">
          <Plus size={18} /> Add Experience
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="glass rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Experience' : 'New Experience'}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} placeholder="Role" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm" />
              <input value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} placeholder="Company" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm" />
              <input value={form.period} onChange={(e) => setForm({...form, period: e.target.value})} placeholder="Period (e.g. Jan 2023 - Present)" required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm" />
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Description" rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm resize-none" />
              <label className="flex items-center gap-3 text-sm text-gray-300">
                <input type="checkbox" checked={form.isCurrentRole} onChange={(e) => setForm({...form, isCurrentRole: e.target.checked})} className="accent-primary" />
                Current Role
              </label>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-primary/20 text-primary font-medium hover:bg-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {editing ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-4 px-5 text-gray-400 font-medium">Role</th>
              <th className="text-left py-4 px-5 text-gray-400 font-medium hidden md:table-cell">Company</th>
              <th className="text-left py-4 px-5 text-gray-400 font-medium hidden lg:table-cell">Period</th>
              <th className="text-right py-4 px-5 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-4 px-5">
                  {item.role}
                  {item.isCurrentRole && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">Current</span>}
                </td>
                <td className="py-4 px-5 hidden md:table-cell text-gray-400">{item.company}</td>
                <td className="py-4 px-5 hidden lg:table-cell text-gray-400">{item.period}</td>
                <td className="py-4 px-5 text-right">
                  <button onClick={() => openEdit(item)} className="p-2 hover:text-primary transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr><td colSpan={4} className="py-12 text-center text-gray-500">No experiences yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
