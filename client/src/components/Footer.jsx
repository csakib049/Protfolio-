import { useState } from 'react';
import { Github, Linkedin, Heart, X, Loader2, UserPlus } from 'lucide-react';
import api from '@/api';

const socialLinks = [
  { icon: Github, href: 'https://github.com/csakib049', title: 'GitHub' },
  {
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    href: 'https://www.facebook.com/muntasir.sakib.376/',
    title: 'Facebook',
  },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/md-sakib-chowdhury-3990791a8/', title: 'LinkedIn' },
  {
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    href: 'https://www.instagram.com/s_a_a_k_i_b/',
    title: 'Instagram',
  },
  {
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
    href: 'https://discord.com/users/1081408248197939363',
    title: 'Discord',
  },
];

export default function Footer() {
  const [showSignup, setShowSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDoubleClick = () => setShowSignup(true);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { data } = await api.post('/auth/signup', form);
      localStorage.setItem('token', data.token);
      setMessage('Account created! You can now go to /admin');
      setForm({ name: '', email: '', password: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <img
        src="/digitalSignature_icon.png"
        alt="Signature"
        className="fixed bottom-6 left-6 z-40 h-36 w-auto opacity-60 hover:opacity-100 transition-all duration-300 hidden sm:block"
      />
      <footer className="border-t border-glass/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between pr-20">
          <span className="hidden md:inline" />

          <p
            className="text-sm text-muted flex items-center gap-1 cursor-default select-none"
            onDoubleClick={handleDoubleClick}
          >
            Made with <Heart size={14} /> by <span className="text-primary">Sakib</span>
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, title }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 glass rounded-full text-muted hover:text-primary transition-colors"
                title={title}
              >
                {typeof Icon === 'function' ? <Icon /> : <Icon size={16} />}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {showSignup && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => { setShowSignup(false); setMessage(''); }}
        >
          <div className="glass rounded-3xl p-8 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Admin Sign Up</h2>
              <button onClick={() => { setShowSignup(false); setMessage(''); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm"
              />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm"
              />
              <input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary/20 text-primary font-medium hover:bg-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                Create Admin Account
              </button>
              {message && (
                <p className="text-sm text-center text-muted">{message}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
