import { createContext, useContext, useEffect, useState } from 'react';
import settings from '@/data/settings.json';

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
  // Remove all font-specific classes
  document.documentElement.classList.remove('font-source', 'font-space-mono');

  if (font === 'source-code-pro') {
    document.documentElement.classList.add('font-source');
  } else if (font === 'space-mono') {
    document.documentElement.classList.add('font-space-mono');
  }
  // For 'inter' (default) we do nothing (remove the classes and leave the root variable)

  localStorage.setItem('portfolio-font', font);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('portfolio-theme') || settings.theme || 'orange';
    applyTheme(saved);
    return saved;
  });

  const [font, setFont] = useState(() => {
    const saved = localStorage.getItem('portfolio-font') || settings.font || 'inter';
    applyFont(saved);
    return saved;
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    applyFont(font);
  }, [font]);

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const updateFont = (newFont) => {
    setFont(newFont);
    applyFont(newFont);
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
