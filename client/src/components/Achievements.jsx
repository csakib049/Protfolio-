import { useEffect, useRef, useState } from 'react';
import { Award } from 'lucide-react';
import api from '@/api';

export default function Achievements() {
  const [items, setItems] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    api.get('/achievements').then(({ data }) => setItems(data)).catch(() => {});
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

  return (
    <section id="achievements" className="py-24 relative" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            Achievements & Awards
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            Recognitions & <span className="text-primary">Milestones</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {items.map((item, i) => (
            <div
              key={item._id}
              className="reveal glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 group border border-white/5"
            >
              <div className="flex items-start gap-4">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Award size={28} className="text-yellow-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  {item.date && (
                    <p className="text-xs text-gray-500 mb-2">{item.date}</p>
                  )}
                  {item.description && (
                    <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {!items.length && (
            <div className="md:col-span-2 text-center py-16 text-gray-500 reveal">
              <Award size={48} className="mx-auto mb-4 opacity-30" />
              <p>No achievements yet</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
