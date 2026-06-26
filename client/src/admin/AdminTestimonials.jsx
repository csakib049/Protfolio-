import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';
import api from '@/api';

const empty = { name: '', role: '', content: '' };

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await api.get('/testimonials');
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setFile(null); setEditing(null); setShowForm(true); };
  const openEdit = (item) => { setForm(item); setFile(null); setEditing(item._id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('role', form.role);
    fd.append('content', form.content);
    if (file) fd.append('avatar', file);
    try {
      if (editing) {
        await api.put(`/testimonials/${editing}`, fd);
      } else {
        await api.post('/testimonials', fd);
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
    if (!confirm('Delete this testimonial?')) return;
    await api.delete(`/testimonials/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-all">
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="glass rounded-3xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Name" required className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm" />
              <input value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} placeholder="Role (optional)" className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm" />
              <textarea value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} placeholder="Testimonial content" rows={4} required className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm resize-none" />
              <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" className="w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-primary/20 text-primary font-medium hover:bg-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {editing ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {items.map((item) => (
          <div key={item._id} className="glass rounded-2xl p-6 group">
            <p className="text-sm text-muted italic mb-4">"{item.content}"</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full glass-strong flex items-center justify-center text-sm">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  {item.role && <p className="text-xs text-muted">{item.role}</p>}
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button onClick={() => openEdit(item)} className="p-1.5 hover:text-primary transition-colors"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {!items.length && (
          <div className="md:col-span-2 text-center py-12 text-muted">No testimonials yet</div>
        )}
      </div>
    </div>
  );
}
