import Navbar from '@/components/Navbar';
import FloatingDots from '@/components/FloatingDots';
import Hero from '@/components/Hero';
import About from '@/components/About';
import SkillsMarquee from '@/components/SkillsMarquee';
import Achievements from '@/components/Achievements';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-dark overflow-hidden">
      <FloatingDots />
      <Navbar />
      <Hero />
      <About />
      <SkillsMarquee />
      <Achievements />
      <Experience />
      <Projects />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
