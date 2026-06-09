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
        description="Discover the powerful features that make Farmlyt AI the leading AI-powered agriculture platform."
      />

      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuresData.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-16 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
            >
              <SectionTitle
                subtitle="Why Farmlyt AI"
                title="The Complete Agriculture AI Platform"
                description="Everything you need to manage, monitor, and optimize your agricultural operations in one place."
                align="left"
              />

              <div className="space-y-3 mt-6">
                {highlights.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-gray-800/50 transition-colors duration-200 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 cursor-default"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.06 }}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-xs">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-950 dark:to-blue-950 flex items-center justify-center p-10 border border-emerald-200/50 dark:border-emerald-800/30">
                <div className="text-center">
                  <div className="text-5xl font-bold gradient-text mb-3">AI</div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
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
