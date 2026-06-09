import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import FeatureCard from '../components/ui/FeatureCard';
import featuresData from '../data/features';
import SectionTitle from '../components/common/SectionTitle';

const highlights = [
  'Powered by advanced deep learning models',
  'Scalable microservices architecture',
  'End-to-end encrypted data transmission',
  '99.9% platform uptime guarantee',
  'Continuous model improvement & updates',
  'Multi-language support',
];

export default function Features() {
  return (
    <main>
      <PageHeader
        title="Platform Features"
        description="Discover the powerful features that make Farm AI the leading AI-powered agriculture platform."
      />

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuresData.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <SectionTitle
                subtitle="Why Farm AI"
                title="The Complete Agriculture AI Platform"
                description="Everything you need to manage, monitor, and optimize your agricultural operations in one place."
                align="left"
              />

              <div className="space-y-4 mt-8">
                {highlights.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-950 dark:to-blue-950 flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="text-6xl font-bold gradient-text mb-4">AI</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Powering the Future of Agriculture
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
