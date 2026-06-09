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

      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {servicesData.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-16 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Why Our Services"
            title="Built for Modern Agriculture"
            description="Each service is crafted with cutting-edge AI technology to deliver accurate, fast, and actionable results."
          />

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: '95% Accuracy', desc: 'Industry-leading AI model accuracy for reliable results you can trust.' },
              { title: 'Under 2 Seconds', desc: 'Lightning-fast inference delivers results in milliseconds, not minutes.' },
              { title: '24/7 Availability', desc: 'Our cloud platform ensures your tools are always available when you need them.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center p-5 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
              >
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">{item.title}</div>
                <p className="text-gray-600 dark:text-gray-300 text-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
