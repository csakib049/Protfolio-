import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500 flex items-center gap-1">
          Made with <Heart size={14} className="text-primary" /> by Your Name
        </p>

        <div className="flex items-center gap-4">
          {[
            { icon: Github, href: '#' },
            { icon: Twitter, href: '#' },
            { icon: Linkedin, href: '#' },
          ].map(({ icon: Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 glass rounded-full text-gray-400 hover:text-primary transition-colors"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
