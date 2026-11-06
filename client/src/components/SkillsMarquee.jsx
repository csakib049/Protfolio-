import DecryptedText from './DecryptedText';
import skills from '@/data/skills.json';
import { localAsset } from '@/data/assets';

export default function SkillsMarquee() {
  if (!skills.length) return null;

  return (
    <section className="relative min-h-screen flex items-center py-12 overflow-hidden">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/sakib_perfect.webp"
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: 'center top' }}
        />
        <div className="absolute inset-0 bg-dark/75" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="text-center mb-10">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
            <DecryptedText
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
              className="glass rounded-full px-8 py-4 flex items-center gap-4 text-base font-medium text-main hover:text-primary hover:border-primary/30 transition-colors"
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
