import { Code2, Lightbulb, Rocket, Sparkles, Zap, Shield } from 'lucide-react';
import { useEffect, useRef } from 'react';

const highlights = [
  { icon: Code2, title: 'Clean Code', desc: 'Readable, maintainable, and well-structured code that scales.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'Modern solutions leveraging cutting-edge technologies.' },
  { icon: Rocket, title: 'Performance', desc: 'Optimized apps with fast load times and smooth interactions.' },
  { icon: Zap, title: 'Speed', desc: 'Rapid development without compromising on quality.' },
  { icon: Shield, title: 'Security', desc: 'Best practices for secure and reliable applications.' },
  { icon: Sparkles, title: 'Design', desc: 'Pixel-perfect interfaces with great user experience.' },
];

export default function About() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((r, i) => {
              setTimeout(() => r.classList.add('visible'), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-24 relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">About Me</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            Passion for <span className="text-primary">Excellence</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="reveal glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 group"
              >
                <Icon className="text-primary mb-4 group-hover:scale-110 transition-transform" size={28} />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
