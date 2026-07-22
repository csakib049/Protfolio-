import { useEffect, useRef, useState } from 'react';
import { Send, Mail, MapPin, Phone, Loader2, CheckCircle, AlertCircle, User } from 'lucide-react';
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
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-[1fr_1.45fr] gap-10 lg:gap-24 items-start">
          {/* Left Column — heading, contact info, form */}
          <div className="space-y-8">
            <div className="reveal">
              <span className="text-primary text-sm font-medium uppercase tracking-widest">Contact</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3">
                Get In <span className="text-primary">Touch</span>
              </h2>
            </div>

            <div className="space-y-6">
              <div className="reveal glass rounded-2xl p-5 flex items-center gap-4 hover:bg-glass/5 transition-all duration-300 group">
                <Mail className="text-primary flex-shrink-0 group-hover:scale-110 transition-transform" size={22} />
                <div>
                  <p className="text-sm text-muted">Email</p>
                  <p className="text-sm font-medium">csakib049@gmail.com</p>
                </div>
              </div>
              <div className="reveal glass rounded-2xl p-5 flex items-center gap-4 hover:bg-glass/5 transition-all duration-300 group" style={{ animationDelay: '100ms' }}>
                <MapPin className="text-primary flex-shrink-0 group-hover:scale-110 transition-transform" size={22} />
                <div>
                  <p className="text-sm text-muted">Location</p>
                  <p className="text-sm font-medium">Mirpur-2, Dhaka-1216</p>
                </div>
              </div>
              <div className="reveal glass rounded-2xl p-5 flex items-center gap-4 hover:bg-glass/5 transition-all duration-300 group" style={{ animationDelay: '200ms' }}>
                <Phone className="text-primary flex-shrink-0 group-hover:scale-110 transition-transform" size={22} />
                <div>
                  <p className="text-sm text-muted">Phone</p>
                  <p className="text-sm font-medium">+880 1823404469</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="reveal glass rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 focus:scale-[1.02] transition-all duration-300 text-sm"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 focus:scale-[1.02] transition-all duration-300 text-sm"
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 focus:scale-[1.02] transition-all duration-300 text-sm"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-glass/5 border border-glass/10 text-main placeholder-muted focus:outline-none focus:border-primary/50 focus:scale-[1.02] transition-all duration-300 text-sm resize-none"
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

          {/* Right Column — Photo */}
          <div className="reveal flex justify-center lg:justify-end">
            <div className="relative w-[92%] lg:w-full max-w-md lg:max-w-none lg:sticky lg:top-24">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-[60px] opacity-60 pointer-events-none" />
              <img
                src="/panjabi.jpeg"
                alt="Contact"
                className="relative w-full h-72 sm:h-80 lg:h-[calc(100vh-12rem)] rounded-2xl shadow-lg border border-glass/10 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
