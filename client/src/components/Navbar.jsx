import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = ['About', 'Experience', 'Projects', 'Achievements', 'Testimonials', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setOpen(false);
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg shadow-primary/5' : 'bg-transparent'
      }`}
      style={{
        background: scrolled
          ? 'rgba(5,5,5,0.8)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => window.open('/admin', '_blank')}
          className="text-lg md:text-xl font-bold tracking-tight text-main hover:text-primary transition-colors whitespace-nowrap"
        >
          Md. Sakib Chowdhury <span className="text-primary">●</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className={`text-sm transition-all duration-200 ${
                i === navLinks.length - 1
                  ? 'text-primary font-medium px-5 py-1.5 rounded-full cursor-pointer'
                  : 'text-gray-400 hover:text-primary'
              }`}
              style={
                i === navLinks.length - 1
                  ? {
                      background: 'rgba(255,122,0,0.08)',
                      border: '1px solid rgba(255,122,0,0.3)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }
                  : {}
              }
              onMouseEnter={(e) => {
                if (i === navLinks.length - 1) {
                  e.currentTarget.style.background = 'rgba(255,122,0,0.18)';
                  e.currentTarget.style.borderColor = 'rgba(255,122,0,0.6)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(255,122,0,0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (i === navLinks.length - 1) {
                  e.currentTarget.style.background = 'rgba(255,122,0,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255,122,0,0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {link}
            </button>
          ))}
        </div>

        <button
          className="md:hidden text-main p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'rgba(5,5,5,0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div className="flex flex-col px-6 py-4 gap-2">
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollTo(link)}
                  className="text-sm text-gray-400 hover:text-primary transition-colors text-left py-2"
                >
                  {link}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
