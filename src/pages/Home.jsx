import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import AboutSection from '../components/home/AboutSection';
import ServicesSection from '../components/home/ServicesSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import FeaturesSection from '../components/home/FeaturesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ServicesSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
