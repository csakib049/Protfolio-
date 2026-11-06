import { useEffect, useState } from 'react';
import { FileText, Github, Linkedin, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';
import settings from '@/data/settings.json';

const navLinks = ['About', 'Experience', 'Projects', 'Achievements', 'Testimonials', 'Media', 'Contact'];
const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/csakib049', Icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/md-sakib-chowdhury-3990791a8/', Icon: Linkedin },
  { label: 'Resume', href: settings.resume || '/cv.pdf', Icon: FileText },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks.map(link => document.getElementById(link.toLowerCase())).filter(Boolean);
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.2, 0.5] });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    setOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 navbar-shell transition-all duration-300 ${scrolled ? 'navbar-scrolled' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[4.25rem] flex items-center gap-5 lg:gap-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-3 shrink-0 text-left"
          aria-label="Back to top"
        >
          <span className="flex items-center text-sm sm:text-base font-bold tracking-tight text-main whitespace-nowrap group-hover:text-primary transition-colors">
            Md. <span className="text-primary">Sakib</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-5 lg:gap-7 pl-5 border-l border-white/10 navbar-links">
          {navLinks.map((link) => {
            const active = activeSection === link.toLowerCase();
            return (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                aria-current={active ? 'location' : undefined}
                className={`text-[0.62rem] lg:text-[0.68rem] font-semibold tracking-[0.16em] uppercase whitespace-nowrap transition-colors ${
                  active ? 'text-primary' : 'text-gray-400 hover:text-main'
                }`}
              >
                {link}
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3 ml-auto pl-4 border-l border-white/10">
          {socialLinks.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="navbar-icon-link"
            >
              <Icon size={16} strokeWidth={1.8} />
            </a>
          ))}
          <span className="mx-1 h-5 w-px bg-white/10" aria-hidden="true" />
          <ThemeSwitcher />
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] text-main hover:border-primary/30 hover:text-primary transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden mx-4 mb-3 rounded-2xl border border-white/10 bg-[#080808]/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl"
          >
            <div className="grid grid-cols-2 gap-1">
              {navLinks.map((link) => {
                const active = activeSection === link.toLowerCase();
                return (
                  <button
                    key={link}
                    onClick={() => scrollTo(link)}
                    aria-current={active ? 'location' : undefined}
                    className={`rounded-xl px-3 py-3 text-left text-sm transition-colors ${
                      active ? 'text-primary bg-primary/10' : 'text-gray-300 hover:bg-white/[0.05]'
                    }`}
                  >
                    {link}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-white/10 px-2 pt-3">
              <div className="flex items-center gap-4">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="navbar-icon-link">
                    <Icon size={17} />
                  </a>
                ))}
              </div>
              <ThemeSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
