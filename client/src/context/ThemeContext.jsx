import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const ThemeContext = createContext();

function applyTheme(theme) {
  document.documentElement.className = `theme-${theme}`;
  localStorage.setItem('portfolio-theme', theme);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('portfolio-theme') || 'green';
    applyTheme(saved);
    return saved;
  });

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      if (data && data.theme) {
        setTheme(data.theme);
        applyTheme(data.theme);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const updateTheme = async (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    try {
      await api.put('/settings', { theme: newTheme });
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) return { theme: 'green', updateTheme: () => {} };
  return ctx;
}
