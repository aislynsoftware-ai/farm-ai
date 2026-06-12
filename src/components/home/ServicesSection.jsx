import servicesData from '../../data/services';
import ServiceCard from '../ui/ServiceCard';
import SectionTitle from '../common/SectionTitle';

export default function ServicesSection() {
  return (
    <section id="services" className="relative py-4 lg:py-4 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Our Services"
          title="Comprehensive AI Solutions for Agriculture"
          description="From disease detection to crop analytics, our AI-powered services cover every aspect of modern farming."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {servicesData.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
