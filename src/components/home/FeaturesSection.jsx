import featuresData from '../../data/features';
import FeatureCard from '../ui/FeatureCard';
import SectionTitle from '../common/SectionTitle';

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-950/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Platform Features"
          title="Built for Performance and Scale"
          description="Our platform is engineered with cutting-edge technology to deliver fast, reliable, and secure AI-powered agricultural insights."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresData.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
