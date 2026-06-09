import { motion } from 'framer-motion';
import PageHeader from '../components/layout/PageHeader';
import ServiceCard from '../components/ui/ServiceCard';
import servicesData from '../data/services';
import SectionTitle from '../components/common/SectionTitle';

export default function Services() {
  return (
    <main>
      <PageHeader
        title="Our Services"
        description="Comprehensive AI-powered solutions designed to address every aspect of modern agriculture and farming."
      />

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {servicesData.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Why Our Services"
            title="Built for Modern Agriculture"
            description="Each service is crafted with cutting-edge AI technology to deliver accurate, fast, and actionable results."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: '95% Accuracy', desc: 'Industry-leading AI model accuracy for reliable results you can trust.' },
              { title: 'Under 2 Seconds', desc: 'Lightning-fast inference delivers results in milliseconds, not minutes.' },
              { title: '24/7 Availability', desc: 'Our cloud platform ensures your tools are always available when you need them.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold gradient-text mb-2">{item.title}</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
