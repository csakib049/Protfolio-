import { useState, useEffect, useRef } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const themes = [
  { id: 'green', color: '#22c55e', group: 'Dark' },
  { id: 'cyan', color: '#06b6d4', group: 'Dark' },
  { id: 'maroon', color: '#be123c', group: 'Dark' },
  { id: 'orange', color: '#f97316', group: 'Dark' },
  { id: 'red', color: '#ef4444', group: 'Dark' },
  { id: 'purple', color: '#a855f7', group: 'Dark' },
  { id: 'pink', color: '#ec4899', group: 'Dark' },
  { id: 'violet', color: '#8b5cf6', group: 'Dark' },
  { id: 'blue', color: '#3b82f6', group: 'Dark' },
  { id: 'cyprus', color: '#004630', group: 'Dark' },
  { id: 'burgundy', color: '#93032e', group: 'Dark' },
  { id: 'crayola-red', color: '#ed254e', group: 'Dark' },
  { id: 'dracula', color: '#ff79c6', group: 'Dark' },
  { id: 'nord', color: '#88c0d0', group: 'Dark' },
  { id: 'solarized-dark', color: '#2aa198', group: 'Presets' },
  { id: 'monokai', color: '#a6e22e', group: 'Presets' },
  { id: 'one-dark', color: '#61afef', group: 'Presets' },
  { id: 'tokyo-night', color: '#7aa2f7', group: 'Presets' },
  { id: 'catppuccin-mocha', color: '#cba6f7', group: 'Presets' },
  { id: 'light-green', color: '#16a34a', group: 'Light' },
  { id: 'light-cyan', color: '#0891b2', group: 'Light' },
  { id: 'light-maroon', color: '#9f1239', group: 'Light' },
  { id: 'light-orange', color: '#ea580c', group: 'Light' },
  { id: 'light-red', color: '#dc2626', group: 'Light' },
  { id: 'light-purple', color: '#9333ea', group: 'Light' },
  { id: 'light-pink', color: '#db2777', group: 'Light' },
  { id: 'light-violet', color: '#7c3aed', group: 'Light' },
  { id: 'light-blue', color: '#2563eb', group: 'Light' },
  { id: 'solarized-light', color: '#268bd2', group: 'Presets' },
  { id: 'catppuccin-latte', color: '#8839ef', group: 'Presets' },
];

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const { theme: activeTheme, updateTheme } = useTheme();
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full glass text-muted hover:text-primary hover:bg-glass/10 transition-all"
        title="Switch theme"
      >
        <Palette size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 max-h-96 overflow-y-auto glass-strong rounded-2xl p-4 shadow-xl z-50">
          <div className="flex items-center gap-2 mb-3">
            <Palette size={16} className="text-primary" />
            <p className="text-sm font-semibold text-main">Theme</p>
          </div>
          {['Dark', 'Light', 'Presets'].map((group) => {
            const groupThemes = themes.filter((t) => t.group === group);
            if (!groupThemes.length) return null;
            return (
              <div key={group} className="mb-3 last:mb-0">
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">{group}</p>
                <div className="flex flex-wrap gap-1.5">
                  {groupThemes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { updateTheme(t.id); setOpen(false); }}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        activeTheme === t.id ? 'border-primary scale-110' : 'border-glass/20 hover:scale-110'
                      }`}
                      style={{ backgroundColor: t.color }}
                      title={t.id}
                    >
                      {activeTheme === t.id && <Check size={12} className="mx-auto text-white drop-shadow" />}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}