import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2, Upload, User } from 'lucide-react';
import api, { API_ORIGIN } from '@/api';

const iconOptions = [
  'Code2', 'Lightbulb', 'Rocket', 'Sparkles', 'Zap', 'Shield',
  'Star', 'Heart', 'Globe', 'Award', 'Cpu', 'Brain',
];

const empty = { title: '', description: '', icon: 'Sparkles' };

export default function AdminAbout() {
  const [items, setItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [bio, setBio] = useState('');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [bioSaving, setBioSaving] = useState(false);

  const load = async () => {
    const [{ data: aboutData }, { data: profileData }] = await Promise.all([
      api.get('/about'),
      api.get('/profile'),
    ]);
    setItems(aboutData);
    setProfile(profileData);
    setBio(profileData?.bio || '');
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (item) => { setForm(item); setEditing(item._id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await api.put(`/about/${editing}`, form);
      } else {
        await api.post('/about', form);
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
    if (!confirm('Delete this item?')) return;
    await api.delete(`/about/${id}`);
    load();
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    if (!photoFile) return;
    setPhotoUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', photoFile);
      const { data } = await api.post('/profile/photo', fd);
      setProfile(data);
      setPhotoFile(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleBioSave = async () => {
    setBioSaving(true);
    try {
      const { data } = await api.put('/profile', { bio });
      setProfile(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save bio');
    } finally {
      setBioSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">About Me</h1>

      {/* Profile Photo Section */}
      <div className="glass rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Profile Photo</h2>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-40 h-48 rounded-2xl overflow-hidden border border-glass/10 bg-glass/5 flex items-center justify-center shrink-0">
            {profile?.photo ? (
              <img src={API_ORIGIN + profile.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-muted/40" />
            )}
          </div>
          <form onSubmit={handlePhotoUpload} className="flex flex-col gap-3 flex-1">
            <input
              type="file"
              onChange={(e) => setPhotoFile(e.target.files[0])}
              accept=".jpg,.jpeg,.png,.webp"
              className="w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            <p className="text-xs text-muted">Accepted: .jpg, .jpeg, .png, .webp &bull; Max 5MB</p>
            <button
              type="submit"
              disabled={!photoFile || photoUploading}
              className="self-start flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-all disabled:opacity-50"
            >
              {photoUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Upload Photo
            </button>
          </form>
        </div>
      </div>

      {/* Bio Section */}
      <div className="glass rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Bio</h2>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write a short bio about yourself..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm resize-none mb-4"
        />
        <button
          onClick={handleBioSave}
          disabled={bioSaving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-all disabled:opacity-50"
        >
          {bioSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Bio
        </button>
      </div>

      {/* Highlights CRUD */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Highlights</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-all">
          <Plus size={18} /> Add Highlight
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="glass rounded-3xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Highlight' : 'New Highlight'}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="Title" required className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm" />
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Description" rows={3} required className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm resize-none" />
              <select value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main focus:outline-none focus:border-primary/50 text-sm">
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon} className="bg-dark">{icon}</option>
                ))}
              </select>
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
              <th className="text-left py-4 px-5 text-muted font-medium">Icon</th>
              <th className="text-left py-4 px-5 text-muted font-medium">Title</th>
              <th className="text-left py-4 px-5 text-muted font-medium hidden md:table-cell">Description</th>
              <th className="text-right py-4 px-5 text-muted font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-b border-glass/5 hover:bg-glass/5">
                <td className="py-4 px-5">
                  <span className="px-2 py-1 rounded bg-glass/5 text-xs font-mono text-primary">{item.icon}</span>
                </td>
                <td className="py-4 px-5 font-medium">{item.title}</td>
                <td className="py-4 px-5 hidden md:table-cell text-muted max-w-xs truncate">{item.description}</td>
                <td className="py-4 px-5 text-right">
                  <button onClick={() => openEdit(item)} className="p-2 hover:text-primary transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr><td colSpan={4} className="py-12 text-center text-muted">No highlights yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
