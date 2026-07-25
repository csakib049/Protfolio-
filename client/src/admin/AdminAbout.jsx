import { useEffect, useState } from 'react';
import { Save, Loader2, Plus, X } from 'lucide-react';
import api from '@/api';

export default function AdminAbout() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    smallLabel: '',
    heading: '',
    bio: '',
    education: [],
    experienceRole: '',
    experienceCompany: '',
    interests: [],
    techStack: [],
    highlights: [],
  });
  const [loading, setLoading] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newHighlight, setNewHighlight] = useState('');

  const load = async () => {
    const { data } = await api.get('/profile');
    setProfile(data);
    setForm({
      smallLabel: data.smallLabel || '',
      heading: data.heading || '',
      bio: data.bio || '',
      education: data.education || [],
      experienceRole: data.experienceRole || '',
      experienceCompany: data.experienceCompany || '',
      interests: data.interests || [],
      techStack: data.techStack || [],
      highlights: data.highlights || [],
    });
  };

  useEffect(() => { load(); }, []);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addListItem = (field) => {
    const inputMap = {
      interests: { val: newInterest, setter: setNewInterest },
      techStack: { val: newTech, setter: setNewTech },
      highlights: { val: newHighlight, setter: setNewHighlight },
    };
    const { val, setter } = inputMap[field];
    if (!val.trim()) return;
    updateField(field, [...form[field], val.trim()]);
    setter('');
  };

  const removeListItem = (field, index) => {
    updateField(field, form[field].filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/profile', form);
      setProfile(data);
      alert('Saved successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div className="text-center py-16 text-muted">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">About Section</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Fields */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Header</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted font-medium mb-1.5 block">Small Label</label>
              <input
                value={form.smallLabel}
                onChange={e => updateField('smallLabel', e.target.value)}
                placeholder="ABOUT ME"
                className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted font-medium mb-1.5 block">Main Heading</label>
              <input
                value={form.heading}
                onChange={e => updateField('heading', e.target.value)}
                placeholder="Building Software That Solves Problems"
                className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Bio</h2>
          <textarea
            value={form.bio}
            onChange={e => updateField('bio', e.target.value)}
            placeholder="Write a short bio about yourself..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm resize-none"
          />
        </div>

        {/* Education */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Education</h2>
          <div className="space-y-4 mb-4">
            {form.education.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <input
                    value={item.degree}
                    onChange={e => {
                      const updated = [...form.education];
                      updated[i] = { ...updated[i], degree: e.target.value };
                      updateField('education', updated);
                    }}
                    placeholder="Degree"
                    className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm"
                  />
                  <input
                    value={item.institution}
                    onChange={e => {
                      const updated = [...form.education];
                      updated[i] = { ...updated[i], institution: e.target.value };
                      updateField('education', updated);
                    }}
                    placeholder="Institution"
                    className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => updateField('education', form.education.filter((_, j) => j !== i))}
                  className="mt-2 p-2 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => updateField('education', [...form.education, { degree: '', institution: '' }])}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <Plus size={16} /> Add Education
          </button>
        </div>

        {/* Experience */}

          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Experience</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted font-medium mb-1.5 block">Role</label>
                <input
                  value={form.experienceRole}
                  onChange={e => updateField('experienceRole', e.target.value)}
                  placeholder="Full-Stack Developer"
                  className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted font-medium mb-1.5 block">Company</label>
                <input
                  value={form.experienceCompany}
                  onChange={e => updateField('experienceCompany', e.target.value)}
                  placeholder="Tech Corp"
                  className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm"
                />
              </div>
            </div>
        </div>

        {/* Interests */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Interests</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {form.interests.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                {item}
                <button type="button" onClick={() => removeListItem('interests', i)} className="hover:text-red-400">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newInterest}
              onChange={e => setNewInterest(e.target.value)}
              placeholder="Add an interest..."
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addListItem('interests'); } }}
              className="flex-1 px-4 py-2 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm"
            />
            <button type="button" onClick={() => addListItem('interests')} className="px-4 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-all">
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {form.techStack.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                {item}
                <button type="button" onClick={() => removeListItem('techStack', i)} className="hover:text-red-400">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newTech}
              onChange={e => setNewTech(e.target.value)}
              placeholder="Add a tech..."
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addListItem('techStack'); } }}
              className="flex-1 px-4 py-2 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm"
            />
            <button type="button" onClick={() => addListItem('techStack')} className="px-4 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-all">
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Highlights */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Highlights</h2>
          <div className="space-y-2 mb-3">
            {form.highlights.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span className="flex-1">{item}</span>
                <button type="button" onClick={() => removeListItem('highlights', i)} className="hover:text-red-400 shrink-0">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newHighlight}
              onChange={e => setNewHighlight(e.target.value)}
              placeholder="Add a highlight..."
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addListItem('highlights'); } }}
              className="flex-1 px-4 py-2 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm"
            />
            <button type="button" onClick={() => addListItem('highlights')} className="px-4 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-all">
              <Plus size={18} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-primary/20 text-primary font-medium hover:bg-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save All Changes
        </button>
      </form>
    </div>
  );
}
