import { useEffect, useRef, useState } from 'react';
import { Send, Mail, MapPin, Phone, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/api';

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
    <section id="contact" className="py-24 relative" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">Contact</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            Get In <span className="text-primary">Touch</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="reveal glass rounded-2xl p-5 flex items-center gap-4 hover:bg-white/[0.07] transition-all duration-300 group">
              <Mail className="text-primary flex-shrink-0 group-hover:scale-110 transition-transform" size={22} />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-sm font-medium">csakib049@gmail.com</p>
              </div>
            </div>
            <div className="reveal glass rounded-2xl p-5 flex items-center gap-4 hover:bg-white/[0.07] transition-all duration-300 group" style={{ animationDelay: '100ms' }}>
              <MapPin className="text-primary flex-shrink-0 group-hover:scale-110 transition-transform" size={22} />
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="text-sm font-medium">Mirpur-2, Dhaka-1216</p>
              </div>
            </div>
            <div className="reveal glass rounded-2xl p-5 flex items-center gap-4 hover:bg-white/[0.07] transition-all duration-300 group" style={{ animationDelay: '200ms' }}>
              <Phone className="text-primary flex-shrink-0 group-hover:scale-110 transition-transform" size={22} />
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-sm font-medium">+880 1823404469</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="md:col-span-3 reveal glass rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:scale-[1.02] transition-all duration-300 text-sm"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:scale-[1.02] transition-all duration-300 text-sm"
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:scale-[1.02] transition-all duration-300 text-sm"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:scale-[1.02] transition-all duration-300 text-sm resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary/20 text-primary font-medium hover:bg-primary/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
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
          </form>
        </div>
      </div>
    </section>
  );
}
