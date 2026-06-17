import { useEffect, useState } from 'react';
import api from '@/api';

export default function SkillsMarquee() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    api.get('/skills').then((res) => setSkills(res.data)).catch(() => {});
  }, []);

  if (!skills.length) return null;

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">Skills & Technologies</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            My <span className="text-primary">Skills</span>
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="glass rounded-full px-6 py-3 flex items-center gap-3 text-sm font-medium text-gray-300 hover:text-primary transition-colors"
            >
              {skill.logo ? (
                <img src={skill.logo} alt={skill.name} className="w-5 h-5 object-contain" />
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
