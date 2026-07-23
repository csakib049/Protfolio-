import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, Code, Server, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/api';

const helpItems = [
  { icon: Code, title: 'Web Development', desc: 'Full-stack applications, React, Node.js, and more' },
  { icon: Server, title: 'API Design', desc: 'RESTful and GraphQL APIs, third-party integrations' },
];

export default function Contact() {
  const ref = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });
    try {
      await api.post('/messages', form);
      setStatus({ type: 'success', text: 'Message sent successfully!' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus({ type: 'error', text: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <section id="contact" className="py-24 relative bg-dark" ref={ref}>
      <img
        src="/bottom_background.png"
        alt=""
        className="absolute bottom-0 left-0 w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: '50% 25%' }}
      />
      <div className="absolute inset-0 bg-dark/80 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[3fr_3fr_4fr] gap-8 items-start">
          {/* ===== Column 1 — Let's Work Together! ===== */}
          <div className="reveal space-y-6 order-1">
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Let&apos;s Work <span className="text-primary">Together!</span>
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              I&apos;m passionate about creating innovative solutions and building
              meaningful digital experiences. Open to projects, consultation, or
              simply connecting — let&apos;s make something great together.
            </p>

            {/* Contact Information */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <Mail size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-muted text-xs">Email</p>
                    <p className="text-main text-xs">csakib049@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <Phone size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-muted text-xs">Phone</p>
                    <p className="text-main text-xs">+880 1823404469</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <MapPin size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-muted text-xs">Location</p>
                    <p className="text-main text-xs">Mirpur-2, Dhaka-1216</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What I Can Help With */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-3">What I Can Help With</h3>
              <ul className="space-y-3">
                {helpItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-main">{item.title}</p>
                      <p className="text-xs text-muted">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ===== Column 2 — Send me a message ===== */}
          <div className="reveal space-y-6 order-3 lg:order-2">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                Send me a <span className="text-primary">message</span>
              </h2>
              <p className="text-sm text-muted mt-2 leading-relaxed">
                Fill out the form below and I&apos;ll get back to you as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-5">
              <div>
                <label className="text-xs text-muted font-medium mb-1.5 block">Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted/50 focus:outline-none focus:border-primary/50 focus:scale-[1.02] transition-all duration-300 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted font-medium mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted/50 focus:outline-none focus:border-primary/50 focus:scale-[1.02] transition-all duration-300 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted font-medium mb-1.5 block">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Project Collaboration"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted/50 focus:outline-none focus:border-primary/50 focus:scale-[1.02] transition-all duration-300 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted font-medium mb-1.5 block">Your Message</label>
                <textarea
                  name="message"
                  placeholder="Tell me about your project..."
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted/50 focus:outline-none focus:border-primary/50 focus:scale-[1.02] transition-all duration-300 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm tracking-wider hover:brightness-110 active:scale-[0.98] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={16} />}
                {loading ? 'Sending...' : 'Send Message'}
              </button>

              {status.text && (
                <div
                  className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl ${
                    status.type === 'success'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {status.text}
                </div>
              )}

              <p className="text-[11px] text-muted/50 text-center">
                This form is secured and your information is protected.
              </p>
            </form>
          </div>

          {/* ===== Column 3 — Photo ===== */}
          <div className="reveal order-2 lg:order-3">
            <div className="glass rounded-2xl overflow-hidden h-full">
              <img
                src="/panjabi.jpeg"
                alt="Contact"
                className="w-full h-72 sm:h-96 lg:h-full lg:min-h-[600px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
