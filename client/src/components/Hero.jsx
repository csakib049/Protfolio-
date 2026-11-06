import { motion } from 'framer-motion';
import { ArrowUpRight, Play } from 'lucide-react';
import skills from '@/data/skills.json';

const loadedModules = ['React JS', 'Node JS', 'Typescript', 'Python', 'Docker'];
const featuredSkills = loadedModules
  .map((name) => skills.find((skill) => skill.name.trim().toLowerCase() === name.toLowerCase()))
  .filter(Boolean);

const codeLines = [
  <span className="hero-code-comment">// Welcome to my workspace</span>,
  <><span className="text-primary">import</span> {'{ Developer }'} <span className="text-primary">from</span> <span className="hero-code-string">'./portfolio'</span>;</>,
  null,
  <><span className="text-primary">const</span> Portfolio = () <span className="hero-code-operator">=&gt;</span> {'{'}</>,
  <><span className="hero-code-keyword">  return</span> (</>,
  <>    &lt;<span className="text-primary">Developer</span></>,
  <>      name=<span className="hero-code-string">"Md. Sakib Chowdhury"</span></>,
  <>      role=<span className="hero-code-string">"Full Stack Developer"</span></>,
  <>      focus=<span className="hero-code-string">"Backend &amp; AI solutions"</span></>,
  <>    /&gt;</>,
  <>  );</>,
  <>{'}'};<span className="hero-code-caret" /></>,
];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Hero() {
  return (
    <section className="relative z-10 min-h-[calc(100svh-7.5rem)] flex items-center px-6 py-12 lg:py-16">
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] xl:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="min-w-0"
        >
          <div className="hero-intro-label">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            PERSONAL PORTFOLIO <span className="text-primary">·</span> {new Date().getFullYear()}
          </div>

          <h1 className="mt-7 text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
            <span className="block text-primary glow-text">Hi,</span>
            <span className="mt-2 block text-primary glow-text">I’m Sakib</span>
          </h1>

          <p className="mt-6 font-mono text-sm sm:text-base">
            <span className="text-primary">&lt; CSE Student /&gt;</span>
            <span className="mx-2 text-muted">•</span>
            <span className="text-main">Full Stack Developer</span>
          </p>

          <p className="mt-4 max-w-xl text-sm leading-7 text-main/80 sm:text-base">
            I build scalable web applications, design robust APIs, and explore AI-powered solutions that solve real-world problems.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => scrollTo('about')} className="hero-action-primary">
              <Play size={14} fill="currentColor" /> Explore About
            </button>
            <button onClick={() => scrollTo('projects')} className="hero-action-secondary">
              <ArrowUpRight size={15} /> View Projects
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-[0.58rem] tracking-[0.12em] text-muted">LOADED MODULES:</span>
            {featuredSkills.map((skill) => (
              <span key={skill._id} className="hero-module-chip">{skill.name.trim()}</span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
          className="hero-code-window"
        >
          <div className="hero-code-titlebar">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            </div>
            <span className="hero-code-filename"><span className="text-primary">●</span> portfolio.tsx</span>
            <span className="w-10" aria-hidden="true" />
          </div>

          <div className="overflow-x-auto px-4 py-5 sm:px-6 sm:py-7">
            <pre className="hero-code-content"><code>
              {codeLines.map((line, index) => (
                <span className="hero-code-line" key={index}>
                  <span className="hero-code-number">{index + 1}</span>
                  <span className="whitespace-pre">{line}</span>
                </span>
              ))}
            </code></pre>
          </div>

          <div className="hero-code-actions">
            <button onClick={() => scrollTo('about')} className="hero-action-primary hero-action-compact">
              <Play size={13} /> Explore About
            </button>
            <button onClick={() => scrollTo('projects')} className="hero-action-secondary hero-action-compact">
              <ArrowUpRight size={14} /> View Projects
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
