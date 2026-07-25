import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import DecryptedText from './DecryptedText';
import api, { API_ORIGIN } from '@/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [animKey, setAnimKey] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setAnimKey(k => k + 1), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.get('/projects').then((res) => setProjects(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((r, i) => {
              setTimeout(() => r.classList.add('visible'), i * 150);
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [projects]);

  if (!projects.length) return null;

  return (
    <section id="projects" className="py-24 relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
            <DecryptedText
              key={animKey}
              text="PROJECTS"
              animateOn="view"
              sequential
              revealDirection="start"
              className="text-primary glow-text"
              encryptedClassName="text-primary/40"
            />
          </h2>
          <p className="text-muted mt-4 text-sm tracking-wider uppercase">Featured Work</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <div
              key={project._id}
              className="reveal group glass rounded-2xl overflow-hidden hover:bg-glass/5 transition-all duration-500"
            >
              <div className="relative h-48 overflow-hidden bg-glass/5">
                {project.image ? (
                  <img
                    src={API_ORIGIN + project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
                    🖥️
                  </div>
                )}
                <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-3 glass rounded-full hover:text-primary transition-colors">
                      <Github size={20} />
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="p-3 glass rounded-full hover:text-primary transition-colors">
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                <p className="text-sm text-muted mb-4 ">{project.description}</p>
                {project.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
