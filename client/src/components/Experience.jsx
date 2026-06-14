import { useEffect, useRef, useState } from 'react';
import api from '@/api';

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    api.get('/experiences').then((res) => setExperiences(res.data)).catch(() => {});
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
      { threshold: 0.1 }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [experiences]);

  if (!experiences.length) return null;

  return (
    <section id="experience" className="py-24 relative" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">Experience</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            Where I've <span className="text-primary">Worked</span>
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/10" />

          {experiences.map((exp, i) => (
            <div key={exp._id} className={`reveal flex gap-6 pb-12 last:pb-0`}>
              <div className="relative flex-shrink-0 w-10 flex justify-center">
                {exp.isCurrentRole ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 pulse-ring" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20 mt-2" />
                )}
              </div>

              <div className="glass rounded-2xl p-6 flex-1">
                <span className="text-xs text-primary font-mono">{exp.period}</span>
                <h3 className="text-xl font-semibold mt-1">{exp.role}</h3>
                <p className="text-sm text-gray-400 mt-0.5">{exp.company}</p>
                {exp.description && (
                  <p className="text-sm text-gray-500 mt-3 leading-relaxed">{exp.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
