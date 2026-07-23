import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Download } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import DecryptedText from './DecryptedText';
import api from '@/api';

const terminalLines = [
  { command: 'whoami', output: 'Md. Sakib Chowdhury' },
  { command: 'role', output: 'Full Stack Developer' },
  { command: 'passion', output: ['Backend Engineering &', 'AI-Powered Solutions'] },
  { command: 'status', output: ['Building scalable', 'solutions that make', 'an impact. 🚀'] },
];

const socialLinks = [
  {
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="pointer-events-none">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    href: 'https://www.facebook.com/muntasir.sakib.376/',
  },
  { icon: FaGithub, href: 'https://github.com/csakib049' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/md-sakib-chowdhury-3990791a8/' },
  {
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="pointer-events-none">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    href: 'https://www.instagram.com/s_a_a_k_i_b/',
  },
  {
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="pointer-events-none">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
    href: 'https://discordapp.com/users/1081408248197939363',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function Hero() {
  const [animKey, setAnimKey] = useState(0);
  const [resumeUrl, setResumeUrl] = useState('/cv.pdf');

  useEffect(() => {
    const timer = setInterval(() => setAnimKey(k => k + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      if (data?.resume) setResumeUrl(data.resume);
    }).catch(() => {});
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row">
      <img
        src="/sakib_perfect.jpeg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center top' }}
      />
      <div className="absolute inset-0 bg-dark/80" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="hidden lg:flex flex-col items-center gap-4 absolute right-8 bottom-12 z-30">
        {socialLinks.map(({ icon: Icon, href }, i) => (
          <motion.a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.25, color: '#ff7a00' }}
            className="text-gray-500 hover:text-primary transition-colors"
          >
            {typeof Icon === 'function' ? <Icon /> : <Icon size={18} />}
          </motion.a>
        ))}
      </div>

      <div
        className="flex flex-col lg:flex-row flex-1 order-1 relative z-10"
        style={{ transform: 'translateX(70px)' }}
      >
        <div className="lg:w-[340px] shrink-0 flex flex-col items-center justify-center pt-0 md:pt-24 lg:pt-0 px-6 lg:px-0 lg:pl-16 order-2 md:order-1 lg:order-1">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-[280px] lg:w-[260px]"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="rounded-xl overflow-hidden border border-primary/20"
            style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 0 20px rgba(255,122,0,0.1), inset 0 0 20px rgba(255,122,0,0.03)',
            }}
          >
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-[10px] text-gray-600 font-mono">terminal</span>
            </div>

            <div className="p-4 font-mono text-xs leading-relaxed">
              {terminalLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.4 }}
                  className="mb-3 last:mb-0"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-green-400">$</span>
                    <span className="text-primary">{line.command}</span>
                  </div>
                  {Array.isArray(line.output) ? (
                    line.output.map((text, j) => (
                      <div key={j} className="text-gray-300 ml-4">{text}</div>
                    ))
                  ) : (
                    <div className="text-gray-300 ml-4">{line.output}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="flex lg:hidden items-center gap-4 mt-8 lg:mt-10">
          {socialLinks.map(({ icon: Icon, href }, i) => (
            <motion.a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.25, color: '#ff7a00' }}
               className="text-gray-500 hover:text-primary transition-colors"
            >
              {typeof Icon === 'function' ? <Icon /> : <Icon size={18} />}
            </motion.a>
          ))}
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col justify-center px-6 lg:px-16 xl:px-20 order-1 md:order-2 lg:order-2 pt-24 md:pt-0 lg:pt-0"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border border-primary/20"
            style={{
              background: 'rgba(255,122,0,0.08)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-primary/90">Open to Internship Opportunities</span>
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 text-main"
        >
          <DecryptedText key={animKey} text="Hi, I'm Sakib" animateOn="view" sequential revealDirection="start" className="text-primary glow-text" encryptedClassName="text-primary/40" />
          <span className="inline-block ml-2">👋</span>
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="mb-4 max-w-2xl"
        >
          <TypeAnimation
            sequence={[
              'Full Stack Developer with a\nPassion for Backend Engineering',
              3000,
            ]}
            wrapper="div"
            cursor={true}
            repeat={Infinity}
            className="text-lg sm:text-xl md:text-2xl text-primary font-semibold leading-snug"
            style={{ whiteSpace: 'pre-line' }}
          />
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg text-[#9ca3af] max-w-xl mb-8 leading-relaxed"
        >
          I build scalable web applications, design robust APIs,
          and explore AI-powered solutions that solve real-world problems.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 flex-wrap"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 rounded-full bg-primary text-white font-medium text-sm flex items-center gap-2 cursor-pointer transition-shadow duration-300"
            style={{ boxShadow: '0 0 0 rgba(255,122,0,0)' }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 25px rgba(255,122,0,0.5)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 0 rgba(255,122,0,0)' }}
          >
            <Mail size={16} />
            <DecryptedText text="Get in Touch" animateOn="hover" sequential revealDirection="start" className="text-white" encryptedClassName="text-white/40" />
          </motion.button>

          <motion.a
            href={resumeUrl}
            download
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full font-medium text-sm flex items-center gap-2 text-gray-300 cursor-pointer transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = 'rgba(255,122,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            <Download size={16} />
            Download CV
          </motion.a>
        </motion.div>
      </motion.div>
      </div>

    </section>
  );
}
