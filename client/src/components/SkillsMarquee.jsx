import { useEffect, useState } from 'react';
import api, { API_ORIGIN } from '@/api';

export default function SkillsMarquee() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    api.get('/skills').then((res) => setSkills(res.data)).catch(() => {});
  }, []);

  if (!skills.length) return null;

  return (
    <section
      className="relative min-h-screen flex items-center py-12 overflow-hidden"
      style={{
        backgroundImage: 'url(/blur.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="text-center mb-10">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">Skills & Technologies</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-white">
            My <span className="text-primary">Skills</span>
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="glass rounded-full px-8 py-4 flex items-center gap-4 text-base font-medium text-black border-black hover:text-primary transition-colors"
            >
              {skill.logo ? (
                <img src={API_ORIGIN + skill.logo} alt={skill.name} className="w-7 h-7 object-contain" />
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
