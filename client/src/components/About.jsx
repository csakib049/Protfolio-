import { useEffect, useRef, useState } from 'react';
import api from '@/api';
import * as Icons from 'lucide-react';

export default function About() {
  const [items, setItems] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    api.get('/about').then(({ data }) => setItems(data)).catch(() => {});
  }, []);

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
  }, [items]);

  if (!items.length) return null;

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
          {items.map((item, i) => {
            const Icon = Icons[item.icon] || Icons.Sparkles;
            return (
              <div
                key={item._id}
                className="reveal glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 group"
              >
                <Icon className="text-primary mb-4 group-hover:scale-110 transition-transform" size={28} />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
