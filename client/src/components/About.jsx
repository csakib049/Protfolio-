import { useEffect, useRef, useState } from 'react';
import { Check, GraduationCap, Briefcase, Sparkles, Cpu, Award } from 'lucide-react';
import profile from '@/data/profile.json';
import { localAsset } from '@/data/assets';

export default function About() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((r, i) => {
              setTimeout(() => r.classList.add('visible'), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hasEducation = profile.education?.length > 0;
  const hasExperience = profile.experienceRole || profile.experienceCompany;

  return (
    <section id="about" className="relative min-h-screen flex items-center py-24" ref={ref}>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <span className="text-primary text-sm font-medium uppercase tracking-widest">
            {profile.smallLabel || 'ABOUT ME'}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-3 tracking-tight leading-none">
            {profile.heading || 'Building Software That Solves Problems'}
          </h2>
        </div>

        <div className="border-t border-glass/10 mb-12" />

        {/* Two-column: WHO I AM + Photo */}
        <div className="grid lg:grid-cols-[1fr_1.45fr] gap-10 lg:gap-24 items-start mb-12">
          <div className="space-y-6 reveal">
            <div className="flex items-center gap-3">
              <Sparkles size={24} className="text-primary" />
              <h3 className="text-2xl font-bold">Who I Am</h3>
            </div>
            <p className="text-muted leading-relaxed text-sm md:text-base">
              {profile.bio || 'I build scalable web applications, design robust APIs, and explore AI-powered solutions that solve real-world problems.'}
            </p>
          </div>

          {/* Right Column — Profile Photo (untouched) */}
          <div className="reveal flex justify-center lg:justify-end">
            <div className="relative w-[92%] lg:w-full max-w-md lg:max-w-none lg:sticky lg:top-24">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-[60px] opacity-60 pointer-events-none" />
              {profile.photo ? (
                <img
                  src={localAsset(profile.photo)}
                  alt="Profile"
                  className="relative w-full h-72 sm:h-80 lg:h-[calc(100vh-12rem)] rounded-2xl shadow-lg border border-glass/10 object-cover"
                />
              ) : (
                <div className="relative w-full h-72 sm:h-80 lg:h-[calc(100vh-12rem)] rounded-2xl bg-glass/5 border border-glass/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted/40"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-glass/10 mb-12" />

        {/* Cards: Education / Experience / Interests */}
        <div className={`grid gap-6 mb-12 ${
          hasEducation && hasExperience ? 'md:grid-cols-3' :
          hasEducation || hasExperience ? 'md:grid-cols-2' :
          'md:grid-cols-1 lg:max-w-lg lg:mx-auto'
        }`}>
          {hasEducation && (
            <div className="glass rounded-2xl p-6 reveal">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap size={22} className="text-primary" />
                <h3 className="text-lg font-semibold">Education</h3>
              </div>
              <div className="space-y-4">
                {profile.education.map((item, i) => (
                  <div key={i}>
                    {item.degree && <p className="text-sm font-medium text-main">{item.degree}</p>}
                    {item.institution && <p className="text-sm text-muted mt-0.5">{item.institution}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasExperience && (
            <div className="glass rounded-2xl p-6 reveal">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase size={22} className="text-primary" />
                <h3 className="text-lg font-semibold">Experience</h3>
              </div>
              {profile.experienceRole && (
                <p className="text-sm font-medium text-main">{profile.experienceRole}</p>
              )}
              {profile.experienceCompany && (
                <p className="text-sm text-muted mt-1">{profile.experienceCompany}</p>
              )}
            </div>
          )}

          <div className="glass rounded-2xl p-6 reveal">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={22} className="text-primary" />
              <h3 className="text-lg font-semibold">Interests</h3>
            </div>
            {profile.interests?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((item, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No interests added yet.</p>
            )}
          </div>
        </div>

        <div className="border-t border-glass/10 mb-12" />

        {/* Tech Stack */}
        <div className="mb-12 reveal">
          <div className="flex items-center gap-3 mb-6">
            <Cpu size={24} className="text-primary" />
            <h3 className="text-xl font-bold">Tech Stack</h3>
          </div>
          {profile.techStack?.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {profile.techStack.map((item, i) => (
                <span key={i} className="glass rounded-full px-5 py-2 text-sm font-medium text-muted">
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No tech stack items added yet.</p>
          )}
        </div>

        <div className="border-t border-glass/10 mb-12" />

        {/* Highlights */}
        <div className="mb-12 reveal">
          <div className="flex items-center gap-3 mb-6">
            <Award size={24} className="text-primary" />
            <h3 className="text-xl font-bold">Highlights</h3>
          </div>
          {profile.highlights?.length > 0 ? (
            <div className="space-y-3">
              {profile.highlights.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={14} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No highlights added yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
