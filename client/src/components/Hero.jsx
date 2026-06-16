import { ArrowDown, Code2 } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-dark" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-8 fade-in">
          <Code2 size={16} className="text-primary" />
          <span className="text-sm text-gray-300">Software Engineer</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 fade-in fade-in-delay-1">
          Crafting{' '}
          <span className="text-primary glow-text">Digital</span>
          <br />
          Experiences
        </h1>

        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 fade-in fade-in-delay-2">
          I build performant, accessible, and visually stunning web applications
          with modern technologies.
        </p>

        <div className="flex items-center justify-center gap-4 fade-in fade-in-delay-3">
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="animated-border px-8 py-3 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-all"
          >
            View My Work
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 rounded-full glass text-gray-300 font-medium hover:text-white hover:bg-white/10 transition-all"
          >
            Get In Touch
          </button>
        </div>

        <div className="mt-16 fade-in fade-in-delay-4 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full glass-strong overflow-hidden">
              <img src="/sakib.jpg" alt="Sakib" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -inset-2 rounded-full border border-primary/30 pulse-ring" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown size={20} className="text-primary/60" />
      </div>
    </section>
  );
}
