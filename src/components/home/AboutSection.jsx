import { motion } from 'framer-motion';
import { Sparkles, Shield, Leaf, TrendingUp } from 'lucide-react';
import SectionTitle from '../common/SectionTitle';

const highlights = [
  {
    icon: Sparkles,
    title: 'Cutting-Edge AI',
    description: 'Advanced deep learning models trained on millions of agricultural images.',
  },
  {
    icon: Shield,
    title: '99.9% Uptime',
    description: 'Reliable cloud infrastructure ensures your tools are always available.',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly',
    description: 'Promoting sustainable farming practices through technology.',
  },
  {
    icon: TrendingUp,
    title: 'Data-Driven',
    description: 'Make informed decisions with AI-powered agricultural insights.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="About Farm AI"
          title="Revolutionizing Agriculture with Artificial Intelligence"
          description="We combine cutting-edge AI technology with agricultural expertise to provide farmers, researchers, and agribusinesses with powerful tools for smarter farming."
        />

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-3xl overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-950 dark:to-blue-950 rounded-3xl flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Smart Agriculture
                    <br />
                    for a Better Future
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-300">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
