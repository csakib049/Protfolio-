import { useEffect, useState } from 'react';
import { FolderGit2, Briefcase, Code2, Star, MessageSquare, Award, Palette, Check } from 'lucide-react';
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
  const { theme: activeTheme, updateTheme } = useTheme();
  const [updating, setUpdating] = useState(null);

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
    </div>
  );
}
