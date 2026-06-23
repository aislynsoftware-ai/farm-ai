import SEO from '../components/common/SEO';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import AboutSection from '../components/home/AboutSection';
import ServicesSection from '../components/home/ServicesSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import FeaturesSection from '../components/home/FeaturesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import ContactSection from '../components/home/ContactSection';

export default function Home() {
  return (
    <main>
      <SEO title="Home" description="AI-Powered Smart Agriculture Platform for crop disease detection, plant identification, and smart farming insights." url="/" />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ServicesSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      
      <ContactSection />
    </main>
  );
}
