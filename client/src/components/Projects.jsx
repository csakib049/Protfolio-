import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import DecryptedText from './DecryptedText';
import projects from '@/data/projects.json';
import { localAsset } from '@/data/assets';

function ProjectVideo({ project, className }) {
  const videoRef = useRef(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!('IntersectionObserver' in window)) {
      setHasLoaded(true);
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasLoaded(true);
        setIsNearViewport(true);
        if (video.currentSrc) video.play().catch(() => {});
      } else {
        setIsNearViewport(false);
        video.pause();
      }
    }, { rootMargin: '120px' });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={hasLoaded ? localAsset(project.video) : undefined}
      poster={localAsset(project.image)}
      className={className}
      muted
      loop
      playsInline
      autoPlay={isNearViewport}
      preload="none"
      aria-label={`${project.title} project preview`}
    />
  );
}

export default function Projects() {
  const ref = useRef(null);

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
                {project.video ? (
                  <ProjectVideo
                    project={project}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : project.image ? (
                  <img
                    src={localAsset(project.image)}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
                    🖥️
                  </div>
                )}
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
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-glass/10 bg-glass/5 px-3 py-2.5 text-sm font-medium text-main hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <Github size={16} /> GitHub
                  </a>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition-all"
                  >
                    <ExternalLink size={16} /> Live
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
