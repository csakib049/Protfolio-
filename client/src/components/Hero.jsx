import { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';

const fullText = "Hi, I'm Sakib ";
const subtitleText = "Full Stack Developer with a Passion for Backend Engineering";
const descText = "I build scalable web applications, design robust APIs, and explore AI-powered solutions that solve real-world problems.";

export default function Hero() {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [done, setDone] = useState(false);
  const [subtitleWords, setSubtitleWords] = useState(0);
  const [descWords, setDescWords] = useState(0);

  useEffect(() => {
    const chars = Array.from(fullText);
    let i = 0;
    const timer = setInterval(() => {
      if (i < chars.length) {
        setDisplayed(chars.slice(0, i + 1).join(''));
        i++;
      } else {
        clearInterval(timer);
        setDone(true);
        setTimeout(() => setShowCursor(false), 1000);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!done) return;
    const words = subtitleText.split(' ');
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setSubtitleWords(i);
      if (i >= words.length) clearInterval(timer);
    }, 80);
    return () => clearInterval(timer);
  }, [done]);

  useEffect(() => {
    if (subtitleWords < subtitleText.split(' ').length) return;
    const words = descText.split(' ');
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDescWords(i);
      if (i >= words.length) clearInterval(timer);
    }, 60);
    return () => clearInterval(timer);
  }, [subtitleWords]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-dark" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="fade-in fade-in-delay-1 shrink-0">
            <div className="relative">
              <div className="w-52 h-52 md:w-64 md:h-64 rounded-full glass-strong overflow-hidden">
                <img src="/sakib.jpg" alt="Sakib" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -inset-2 rounded-full border border-primary/30 pulse-ring" />
              <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 border-4 border-dark flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 md:w-5 md:h-5">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-2 fade-in fade-in-delay-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {displayed}
                {showCursor && <span className="text-primary animate-pulse">|</span>}
                {done && (
                  <span className="inline-block animate-wave" style={{ transformOrigin: '70% 70%' }}>&#x1f44b;</span>
                )}
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-primary font-semibold mb-4 min-h-[2rem]">
              {subtitleText.split(' ').slice(0, subtitleWords).join(' ')}
              {subtitleWords > 0 && subtitleWords < subtitleText.split(' ').length && <span className="animate-pulse text-primary">|</span>}
            </p>

            <p className="text-base md:text-lg text-gray-400 max-w-xl min-h-[1.5rem]">
              {descText.split(' ').slice(0, descWords).join(' ')}
              {descWords > 0 && descWords < descText.split(' ').length && <span className="animate-pulse text-gray-400">|</span>}
            </p>

            <div className="flex items-center gap-4 mt-6 fade-in fade-in-delay-4 justify-center md:justify-start">
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 rounded-full bg-primary/20 text-primary font-medium text-sm hover:bg-primary/30 transition-all"
              >
                Get in Touch
              </button>
              <a
                href="/cv.pdf"
                download
                className="px-6 py-3 rounded-full glass text-gray-300 font-medium text-sm hover:text-white hover:bg-white/10 transition-all inline-flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download CV
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex absolute right-20 top-1/2 -translate-y-1/2 flex-col items-center gap-4 fade-in fade-in-delay-5">
        <div className="flex flex-col items-center">
          {Array.from('eM').map((ch, i) => (
            <span key={i} className="text-[10px] text-gray-500 uppercase leading-none" style={{ transform: 'rotate(-90deg)' }}>{ch}</span>
          ))}
        </div>
        <div className="flex flex-col items-center">
          {Array.from('wolloF').map((ch, i) => (
            <span key={i} className="text-[10px] text-gray-500 uppercase leading-none" style={{ transform: 'rotate(-90deg)' }}>{ch}</span>
          ))}
        </div>
        <div className="w-px h-24 bg-gray-600 animate-blink-line" />
        <a href="https://github.com/csakib049" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:text-primary hover:bg-white/5 transition-all text-gray-400" title="GitHub">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <a href="https://www.instagram.com/s_a_a_k_i_b/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:text-primary hover:bg-white/5 transition-all text-gray-400" title="Instagram">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
          </svg>
        </a>
        <a href="https://discord.com/users/1081408248197939363" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:text-primary hover:bg-white/5 transition-all text-gray-400" title="Discord">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/md-sakib-chowdhury-3990791a8/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:text-primary hover:bg-white/5 transition-all text-gray-400" title="LinkedIn">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown size={20} className="text-primary/60" />
      </div>
    </section>
  );
}
