import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import api from '@/api';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    api.get('/testimonials').then((res) => setTestimonials(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((r) => r.classList.add('visible'));
          }
        });
      },
      { threshold: 0.1 }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [testimonials]);

  if (!testimonials.length) return null;

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section id="testimonials" className="py-24 relative" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            What People <span className="text-primary">Say</span>
          </h2>
        </div>

        <div className="reveal glass rounded-3xl p-8 md:p-12 relative">
          <Quote className="text-primary/20 absolute top-6 right-8" size={60} />

          <p className="text-lg text-gray-300 leading-relaxed mb-8 italic">
            "{t.content}"
          </p>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full glass-strong flex items-center justify-center text-xl flex-shrink-0">
              {t.avatar ? (
                <img src={t.avatar} alt={t.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>{t.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h4 className="font-semibold">{t.name}</h4>
              {t.role && <p className="text-sm text-gray-400">{t.role}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? 'bg-primary w-6' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={prev}
                className="p-2 glass rounded-full hover:text-primary transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="p-2 glass rounded-full hover:text-primary transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
