import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const ThemeContext = createContext();

function applyTheme(theme) {
  const classes = document.documentElement.className
    .split(' ')
    .filter(c => c && !c.startsWith('theme-'));
  classes.push(`theme-${theme}`);
  document.documentElement.className = classes.join(' ');
  localStorage.setItem('portfolio-theme', theme);
}

function applyFont(font) {
  if (font === 'source-code-pro') {
    document.documentElement.classList.add('font-source');
  } else {
    document.documentElement.classList.remove('font-source');
  }
  localStorage.setItem('portfolio-font', font);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('portfolio-theme') || 'green';
    applyTheme(saved);
    return saved;
  });

  const [font, setFont] = useState(() => {
    const saved = localStorage.getItem('portfolio-font') || 'inter';
    applyFont(saved);
    return saved;
  });

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      if (data) {
        if (data.theme) {
          setTheme(data.theme);
          applyTheme(data.theme);
        }
        if (data.font) {
          setFont(data.font);
          applyFont(data.font);
        }
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    applyFont(font);
  }, [font]);

  const updateTheme = async (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    try {
      await api.put('/settings', { theme: newTheme });
    } catch {}
  };

  const updateFont = async (newFont) => {
    setFont(newFont);
    applyFont(newFont);
    try {
      await api.put('/settings', { font: newFont });
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, font, updateFont }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) return { theme: 'green', updateTheme: () => {}, font: 'inter', updateFont: () => {} };
  return ctx;
}
