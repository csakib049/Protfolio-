import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2, Mail, ImagePlus } from 'lucide-react';
import api, { API_ORIGIN } from '@/api';

const empty = { title: '', description: '' };

export default function AdminNewsletter() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await api.get('/newsletter');
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(empty);
    setFiles([]);
    setExistingImages([]);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm(item);
    setFiles([]);
    setExistingImages(item.images || (item.image ? [item.image] : []));
    setEditing(item._id);
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const total = existingImages.length + files.length + selected.length;
    if (total > 4) {
      alert('Maximum 4 images per post');
      return;
    }
    setFiles(prev => [...prev, ...selected]);
  };

  const removeNewFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description || '');
    fd.append('existingImages', JSON.stringify(existingImages));
    files.forEach(f => fd.append('images', f));
    try {
      if (editing) {
        await api.put(`/newsletter/${editing}`, fd);
      } else {
        await api.post('/newsletter', fd);
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
    if (!confirm('Delete this newsletter post?')) return;
    await api.delete(`/newsletter/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Newsletter</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-all"
        >
          <Plus size={18} /> Add Newsletter
        </button>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowForm(false)}
        >
          <div className="glass rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Newsletter' : 'New Newsletter'}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Newsletter title"
                required
                className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm resize-none"
              />

              {/* Image upload section */}
              <div>
                <label className="text-xs text-muted mb-2 block">Images (1–4)</label>

                {existingImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {existingImages.map((url, i) => (
                      <div key={`exist-${i}`} className="relative group rounded-xl overflow-hidden border border-glass/10 aspect-square">
                        <img src={API_ORIGIN + url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(i)}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {files.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {files.map((f, i) => (
                      <div key={`new-${i}`} className="relative group rounded-xl overflow-hidden border border-glass/10 aspect-square">
                        <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeNewFile(i)}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {existingImages.length + files.length < 4 && (
                  <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-glass/20 text-muted text-sm cursor-pointer hover:border-primary/30 hover:text-primary transition-all">
                    <ImagePlus size={18} />
                    Add Image
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}

                <p className="text-[11px] text-muted mt-1.5">
                  {existingImages.length + files.length}/4 images &middot; JPEG, PNG, GIF, WebP, SVG &middot; max 10 MB each
                </p>
              </div>

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
        {items.map((item) => {
          const imgs = item.images || (item.image ? [item.image] : []);
          return (
            <div key={item._id} className="glass rounded-2xl p-6 group border border-glass/5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {imgs.length > 0 ? (
                    <div className="grid grid-cols-2 gap-1 w-14 shrink-0">
                      {imgs.slice(0, 4).map((url, i) => (
                        <img
                          key={i}
                          src={API_ORIGIN + url}
                          alt={item.title}
                          className="w-6 h-6 rounded object-cover"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <Mail size={22} className="text-primary" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-muted mt-2 line-clamp-2">{item.description}</p>
                    )}
                    <p className="text-xs text-muted mt-1">{imgs.length} image{imgs.length !== 1 ? 's' : ''}</p>
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
          );
        })}
        {!items.length && (
          <div className="text-center py-16 text-muted">
            <Mail size={40} className="mx-auto mb-4 opacity-30" />
            <p>No newsletter posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
