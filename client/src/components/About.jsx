import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import DecryptedText from './DecryptedText';
import api, { API_ORIGIN } from '@/api';
import * as Icons from 'lucide-react';

export default function About() {
  const [items, setItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setAnimKey(k => k + 1), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.get('/about').then(({ data }) => setItems(data)).catch(() => {});
    api.get('/profile').then(({ data }) => setProfile(data)).catch(() => {});
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
  }, [items, profile]);

  if (!items.length && !profile) return null;

  return (
    <section id="about" className="relative min-h-screen flex items-center py-24" ref={ref}>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-[1fr_1.45fr] gap-10 lg:gap-24 items-start">
          {/* Left Column — bio + tabs */}
          <div className="space-y-8">
            <div className="reveal">
              <span className="text-primary text-sm font-medium uppercase tracking-widest">About Me</span>
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mt-3 tracking-tight leading-none">
                Passion for <span className="text-primary">Excellence</span>
              </h2>
              <p className="text-muted mt-4 leading-relaxed text-sm md:text-base">
                {profile?.bio || 'I build scalable web applications, design robust APIs, and explore AI-powered solutions that solve real-world problems.'}
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="reveal flex flex-wrap gap-2 border-b border-glass/5 pb-2 overflow-x-auto hide-scrollbar">
              {items.map((item, i) => {
                const Icon = Icons[item.icon] || Icons.Sparkles;
                return (
                  <button
                    key={item._id}
                    onClick={() => setActiveTab(i)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === i
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted hover:text-main'
                    }`}
                  >
                    <Icon size={15} />
                    {item.title}
                  </button>
                );
              })}
            </div>

            {/* Active Tab Content */}
            <div className="reveal">
              {items[activeTab] && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-2xl p-6"
                >
                  <p className="text-sm text-muted leading-relaxed">
                    {items[activeTab].description}
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column — Profile Photo */}
          <div className="reveal flex justify-center lg:justify-end">
            <div className="relative w-[92%] lg:w-full max-w-md lg:max-w-none lg:sticky lg:top-24">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-[60px] opacity-60 pointer-events-none" />
              {profile?.photo ? (
                <img
                  src={API_ORIGIN + profile.photo}
                  alt="Profile"
                  className="relative w-full h-72 sm:h-80 lg:h-[calc(100vh-12rem)] rounded-2xl shadow-lg border border-glass/10 object-cover"
                />
              ) : (
                <div className="relative w-full h-72 sm:h-80 lg:h-[calc(100vh-12rem)] rounded-2xl bg-glass/5 border border-glass/10 flex items-center justify-center">
                  <Icons.User size={48} className="text-muted/40" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
