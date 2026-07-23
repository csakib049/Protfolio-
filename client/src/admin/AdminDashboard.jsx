import { useEffect, useState } from 'react';
import { FolderGit2, Briefcase, Code2, Star, MessageSquare, Award, Palette, Check, Type, FileText, Link, Loader2, Trash2, ExternalLink } from 'lucide-react';
import api from '@/api';
import { useTheme } from '@/context/ThemeContext';

const themes = [
  { id: 'green', label: 'Green', color: '#22c55e', group: 'Dark' },
  { id: 'cyan', label: 'Cyan', color: '#06b6d4', group: 'Dark' },
  { id: 'maroon', label: 'Maroon', color: '#be123c', group: 'Dark' },
  { id: 'orange', label: 'Orange', color: '#f97316', group: 'Dark' },
  { id: 'red', label: 'Red', color: '#ef4444', group: 'Dark' },
  { id: 'purple', label: 'Purple', color: '#a855f7', group: 'Dark' },
  { id: 'pink', label: 'Pink', color: '#ec4899', group: 'Dark' },
  { id: 'violet', label: 'Violet', color: '#8b5cf6', group: 'Dark' },
  { id: 'blue', label: 'Blue', color: '#3b82f6', group: 'Dark' },
  { id: 'cyprus', label: 'Cyprus', color: '#004630', group: 'Dark' },
  { id: 'burgundy', label: 'Burgundy', color: '#93032e', group: 'Dark' },
  { id: 'crayola-red', label: 'Red (Crayola)', color: '#ed254e', group: 'Dark' },
  { id: 'dracula', label: 'Dracula', color: '#ff79c6', group: 'Dark' },
  { id: 'nord', label: 'Nord', color: '#88c0d0', group: 'Dark' },
  { id: 'light-green', label: 'Light Green', color: '#16a34a', group: 'Light' },
  { id: 'light-cyan', label: 'Light Cyan', color: '#0891b2', group: 'Light' },
  { id: 'light-maroon', label: 'Light Maroon', color: '#9f1239', group: 'Light' },
  { id: 'light-orange', label: 'Light Orange', color: '#ea580c', group: 'Light' },
  { id: 'light-red', label: 'Light Red', color: '#dc2626', group: 'Light' },
  { id: 'light-purple', label: 'Light Purple', color: '#9333ea', group: 'Light' },
  { id: 'light-pink', label: 'Light Pink', color: '#db2777', group: 'Light' },
  { id: 'light-violet', label: 'Light Violet', color: '#7c3aed', group: 'Light' },
  { id: 'light-blue', label: 'Light Blue', color: '#2563eb', group: 'Light' },
  { id: 'solarized-dark', label: 'Solarized Dark', color: '#2aa198', group: 'Presets' },
  { id: 'solarized-light', label: 'Solarized Light', color: '#268bd2', group: 'Presets' },
  { id: 'monokai', label: 'Monokai', color: '#a6e22e', group: 'Presets' },
  { id: 'one-dark', label: 'One Dark', color: '#61afef', group: 'Presets' },
  { id: 'tokyo-night', label: 'Tokyo Night', color: '#7aa2f7', group: 'Presets' },
  { id: 'catppuccin-mocha', label: 'Catppuccin Mocha', color: '#cba6f7', group: 'Presets' },
  { id: 'catppuccin-latte', label: 'Catppuccin Latte', color: '#8839ef', group: 'Presets' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const { theme: activeTheme, updateTheme, font: activeFont, updateFont } = useTheme();
  const [updating, setUpdating] = useState(null);
  const [resumeLink, setResumeLink] = useState('');
  const [resumeSaving, setResumeSaving] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      const sections = ['projects', 'experiences', 'skills', 'testimonials', 'messages', 'achievements'];
      const results = await Promise.all(
        sections.map(async (s) => {
          try {
            const { data } = await api.get(`/${s}`);
            return { label: s.charAt(0).toUpperCase() + s.slice(1), count: data.length };
          } catch {
            return { label: s, count: 0 };
          }
        })
      );
      setStats(results);
    };
    fetchStats();
  }, []);

  const icons = [FolderGit2, Briefcase, Code2, Star, MessageSquare, Award];

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      if (data?.resume) setResumeUrl(data.resume);
    }).catch(() => {});
  }, []);

  const handleResumeSave = async () => {
    if (!resumeLink.trim()) return;
    setResumeSaving(true);
    try {
      const { data } = await api.put('/settings', { resume: resumeLink.trim() });
      setResumeUrl(data.resume);
      setResumeLink('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save link');
    } finally {
      setResumeSaving(false);
    }
  };

  const handleResumeDelete = async () => {
    if (!confirm('Remove resume link?')) return;
    try {
      await api.put('/settings', { resume: '' });
      setResumeUrl('');
    } catch {}
  };

  useEffect(() => {
    if (resumeUrl) setResumeLink(resumeUrl);
  }, [resumeUrl]);

  const handleThemeChange = async (id) => {
    setUpdating(id);
    await updateTheme(id);
    setUpdating(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-12">
        {stats.map((stat, i) => {
          const Icon = icons[i];
          return (
            <div key={stat.label} className="glass rounded-2xl p-6">
              <Icon className="text-primary mb-4" size={28} />
              <p className="text-3xl font-bold">{stat.count}</p>
              <p className="text-sm text-muted mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Palette size={24} className="text-primary" />
          <h2 className="text-lg font-semibold">Theme Settings</h2>
        </div>
        <p className="text-sm text-muted mb-6">
          Choose a color theme for your portfolio website.
        </p>
        <div className="flex flex-wrap gap-4">
          {['Dark', 'Light', 'Presets'].map((group) => {
            const groupThemes = themes.filter((t) => t.group === group);
            if (!groupThemes.length) return null;
            return (
              <div key={group} className="w-full">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">{group}</p>
                <div className="flex flex-wrap gap-3">
                  {groupThemes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleThemeChange(t.id)}
                      disabled={updating === t.id}
                      className={`relative flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all ${
                        activeTheme === t.id
                          ? 'border-primary bg-primary/10'
                          : 'border-glass/10 hover:border-glass/20 bg-glass/5'
                      } disabled:opacity-50`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 border-glass/20"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="text-sm font-medium whitespace-nowrap">{t.label}</span>
                      {activeTheme === t.id && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass rounded-2xl p-8 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={24} className="text-primary" />
          <h2 className="text-lg font-semibold">Resume / CV</h2>
        </div>
        <p className="text-sm text-muted mb-6">
          Paste your resume link (Google Drive, Dropbox, etc.). Visitors will be redirected when they click "Download CV".
        </p>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={resumeLink}
                onChange={(e) => setResumeLink(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleResumeSave}
                disabled={!resumeLink.trim() || resumeSaving}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-all disabled:opacity-50"
              >
                {resumeSaving ? <Loader2 size={16} className="animate-spin" /> : <Link size={16} />}
                Save
              </button>
              {resumeUrl && (
                <button
                  onClick={handleResumeDelete}
                  className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-all shrink-0"
            >
              <ExternalLink size={16} />
              Test Link
            </a>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-8 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <Type size={24} className="text-primary" />
          <h2 className="text-lg font-semibold">Font Settings</h2>
        </div>
        <p className="text-sm text-muted mb-6">
          Choose a font style for your portfolio website.
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'inter', label: 'Inter (Normal)', desc: 'Sans-serif, clean & modern' },
            { id: 'source-code-pro', label: 'Source Code Pro', desc: 'Monospace, code-like style' },
            { id: 'space-mono', label: 'Space Mono', desc: 'Monospace, typewriter style' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => updateFont(f.id)}
              className={`relative flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all ${
                activeFont === f.id
                  ? 'border-primary bg-primary/10'
                  : 'border-glass/10 hover:border-glass/20 bg-glass/5'
              }`}
            >
              <span className="text-sm font-medium whitespace-nowrap">{f.label}</span>
              <span className="text-xs text-muted whitespace-nowrap">{f.desc}</span>
              {activeFont === f.id && (
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
