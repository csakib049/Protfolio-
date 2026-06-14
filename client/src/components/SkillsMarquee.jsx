import { useEffect, useState } from 'react';
import api from '@/api';

export default function SkillsMarquee() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    api.get('/skills').then((res) => setSkills(res.data)).catch(() => {});
  }, []);

  if (!skills.length) return null;

  const doubled = [...skills, ...skills];

  return (
    <section className="py-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="text-center">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">Skills</span>
        </div>
      </div>
      <div className="relative">
        <div className="flex marquee gap-8 w-max">
          {doubled.map((skill, i) => (
            <div
              key={`${skill._id}-${i}`}
              className="glass rounded-full px-6 py-3 text-sm font-medium text-gray-300 whitespace-nowrap hover:text-primary transition-colors"
            >
              {skill.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
