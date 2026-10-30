import { useEffect, useState } from 'react';
import DecryptedText from './DecryptedText';
import skills from '@/data/skills.json';
import { localAsset } from '@/data/assets';

export default function SkillsMarquee() {
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setAnimKey(k => k + 1), 4000);
    return () => clearInterval(timer);
  }, []);

  if (!skills.length) return null;

  return (
    <section
      className="relative min-h-screen flex items-center py-12 overflow-hidden"
      style={{
        backgroundImage: 'url(/blur.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="text-center mb-10">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
            <DecryptedText
              key={animKey}
              text="MY SKILLS"
              animateOn="view"
              sequential
              revealDirection="start"
              className="text-primary glow-text"
              encryptedClassName="text-primary/40"
            />
          </h2>
          <p className="text-muted mt-4 text-sm tracking-wider uppercase">Technologies &amp; Tools</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="glass rounded-full px-8 py-4 flex items-center gap-4 text-base font-medium text-black border-black hover:text-primary transition-colors"
            >
              {skill.logo ? (
                <img src={localAsset(skill.logo)} alt={skill.name} className="w-7 h-7 object-contain" loading="lazy" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">
                  {skill.name.charAt(0).toUpperCase()}
                </div>
              )}
              {skill.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
