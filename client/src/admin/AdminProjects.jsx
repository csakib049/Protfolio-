import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';
import api from '@/api';

const empty = { title: '', description: '', tags: '', github: '', live: '' };

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await api.get('/projects');
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
    setForm({ ...item, tags: item.tags?.join(', ') || '' });
    setFile(null);
    setEditing(item._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('github', form.github);
    fd.append('live', form.live);
    fd.append('tags', JSON.stringify(form.tags.split(',').map((t) => t.trim()).filter(Boolean)));
    if (file) fd.append('image', file);

    try {
      if (editing) {
        await api.put(`/projects/${editing}`, fd);
      } else {
        await api.post('/projects', fd);
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
    if (!confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-all">
          <Plus size={18} /> Add Project
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="glass rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="Title" required className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm" />
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Description" rows={3} required className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm resize-none" />
              <input value={form.tags} onChange={(e) => setForm({...form, tags: e.target.value})} placeholder="Tags (comma separated)" className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm" />
              <input value={form.github} onChange={(e) => setForm({...form, github: e.target.value})} placeholder="GitHub URL" className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm" />
              <input value={form.live} onChange={(e) => setForm({...form, live: e.target.value})} placeholder="Live Demo URL" className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm" />
              <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" className="w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
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
            <tr className="border-b border-glass/5">
              <th className="text-left py-4 px-5 text-muted font-medium">Title</th>
              <th className="text-left py-4 px-5 text-muted font-medium hidden md:table-cell">Tags</th>
              <th className="text-right py-4 px-5 text-muted font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-b border-glass/5 hover:bg-glass/5">
                <td className="py-4 px-5">{item.title}</td>
                <td className="py-4 px-5 hidden md:table-cell">
                  <div className="flex gap-1.5 flex-wrap">
                    {item.tags?.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t}</span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-5 text-right">
                  <button onClick={() => openEdit(item)} className="p-2 hover:text-primary transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr><td colSpan={3} className="py-12 text-center text-muted">No projects yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
