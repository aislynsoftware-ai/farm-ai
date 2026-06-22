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
    <section id="about" className="relative py-4 lg:py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="About Farmlyt AI"
          title="Revolutionizing Agriculture with Artificial Intelligence"
          description="We combine cutting-edge AI technology with agricultural expertise to provide farmers, researchers, and agribusinesses with powerful tools for smarter farming."
        />

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-emerald-200/30 dark:border-emerald-800/30">
              <img
                src="/about.png"
                alt="Smart Agriculture"
                className="w-full aspect-[16/10] object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex gap-3.5 p-3 rounded-xl border border-transparent hover:border-emerald-200 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all duration-300 hover:shadow-sm cursor-default">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-0.5 text-sm">
                      {item.title}
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
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
