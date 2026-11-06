import Navbar from '@/components/Navbar';
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
import ScrollVelocity from '@/components/ScrollVelocity';
import skills from '@/data/skills.json';

const skillNames = skills.map(({ name }) => name.trim()).filter(Boolean);
const skillRows = [skillNames.join(' • ')].filter(Boolean);

export default function Home() {
  return (
    <div className="relative min-h-screen bg-dark overflow-hidden">
      <div className="portfolio-hero-shell theme-grid-background">
        <Navbar />
        <div className="relative z-10 pt-[4.25rem]">
          <ScrollVelocity texts={skillRows} velocity={32} />
        </div>
        <Hero />
      </div>
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
  );
}
