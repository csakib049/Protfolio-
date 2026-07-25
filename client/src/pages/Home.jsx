import Navbar from '@/components/Navbar';
import FloatingDots from '@/components/FloatingDots';
import Hero from '@/components/Hero';
import About from '@/components/About';
import SkillsMarquee from '@/components/SkillsMarquee';
import Achievements from '@/components/Achievements';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import GitHubActivity from '@/components/GitHubActivity';
import Testimonials from '@/components/Testimonials';
import MediaCoverage from '@/components/MediaCoverage';
import Newsletter from '@/components/Newsletter';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ClickSpark from '@/components/ClickSpark';

export default function Home() {
  return (
    <ClickSpark
      sparkColor="#a855f7"
      sparkSize={12}
      sparkRadius={20}
      sparkCount={10}
      duration={500}
    >
    <div className="relative min-h-screen bg-dark overflow-hidden">
      <FloatingDots />
      <Navbar />
      <Hero />
      <About />
      <SkillsMarquee />
      <Projects />
      <GitHubActivity />
      <Achievements />
      <Experience />
      <Testimonials />
      <MediaCoverage />
      <Newsletter />
      <Contact />
      <Footer />
      <BackToTop />
    </div>
    </ClickSpark>
  );
}
