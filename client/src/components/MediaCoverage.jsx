import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Newspaper } from 'lucide-react';
import DecryptedText from './DecryptedText';
import Lightbox from './Lightbox';
import itemsData from '@/data/media-coverage.json';
import { localAsset } from '@/data/assets';

export default function MediaCoverage() {
  const [items] = useState(Array.isArray(itemsData) ? itemsData : [itemsData]);
  const [animKey, setAnimKey] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setAnimKey(k => k + 1), 4000);
    return () => clearInterval(timer);
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
    <>
    <section id="media" className="py-24 relative" ref={ref}>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
            <DecryptedText
              key={animKey}
              text="MEDIA"
              animateOn="view"
              sequential
              revealDirection="start"
              className="text-primary glow-text"
              encryptedClassName="text-primary/40"
            />
          </h2>
          <p className="text-muted mt-4 text-sm tracking-wider uppercase">Press &amp; Coverage</p>
        </div>

        <div className="space-y-8">
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="reveal flex flex-col md:flex-row gap-6 glass rounded-2xl p-4 md:p-6 border border-glass/5"
            >
              <div className="flex-1 space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight line-clamp-2">
                  {item.title}
                </h3>

                {item.description && (
                  <div className="bg-glass/5 border border-glass/10 rounded-xl p-4">
                    <p className="text-sm text-muted leading-relaxed">{item.description}</p>
                  </div>
                )}

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-all"
                >
                  <ExternalLink size={16} />
                  Read Article
                </a>
              </div>

              <div className="relative w-full md:w-80 lg:w-96 shrink-0">
                <div className="absolute -inset-2 bg-primary/10 rounded-2xl blur-[40px] opacity-50 pointer-events-none" />
                {(() => {
                  const imgs = item.images || (item.image ? [item.image] : []);
const fullUrls = imgs.map(localAsset);
                  return imgs.length === 1 ? (
                    <div className="relative rounded-xl overflow-hidden border border-glass/10 h-64 md:h-full bg-glass/5 cursor-pointer group"
                      onClick={() => setLightbox({ images: fullUrls, initialIndex: 0 })}
                    >
                      <img
                        src={localAsset(imgs[0])}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-lg">
                        #{String(i + 1).padStart(2, '0')}
                      </div>
                      {item.date && (
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-lg">
                          📅 {item.date}
                        </div>
                      )}
                    </div>
                  ) : imgs.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {imgs.slice(0, 4).map((url, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden border border-glass/10 h-56 bg-glass/5 cursor-pointer group"
                          onClick={() => setLightbox({ images: fullUrls, initialIndex: idx })}
                        >
                          <img
                            src={localAsset(url)}
                            alt={`${item.title} ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {idx === 0 && (
                            <div className="absolute top-2 left-2 bg-primary/80 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                              #{String(i + 1).padStart(2, '0')}
                            </div>
                          )}
                        </div>
                      ))}
                      {item.date && (
                        <div className="col-span-2 text-center">
                          <span className="inline-block bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-lg">
                            📅 {item.date}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-glass/10 h-64 md:h-full bg-glass/5">
                      <div className="w-full h-full flex items-center justify-center">
                        <Newspaper size={40} className="text-primary/40" />
                      </div>
                      <div className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-lg">
                        #{String(i + 1).padStart(2, '0')}
                      </div>
                      {item.date && (
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-lg">
                          📅 {item.date}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
      {lightbox && <Lightbox {...lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}
