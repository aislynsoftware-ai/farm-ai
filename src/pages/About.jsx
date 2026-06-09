import { motion } from 'framer-motion';
import { Target, Eye, Heart, Leaf, Shield, TrendingUp, Users, Globe } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import SectionTitle from '../components/common/SectionTitle';

const missionPoints = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'To democratize access to advanced agricultural technology by providing AI-powered tools that help farmers make data-driven decisions, reduce crop losses, and increase yields sustainably.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description:
      'A world where every farmer, regardless of scale or location, has access to cutting-edge AI technology that transforms agriculture into a more productive, sustainable, and profitable endeavor.',
  },
];

const benefits = [
  { icon: Leaf, title: 'Sustainable Farming', description: 'Reduce waste and optimize resource usage with AI-driven recommendations for water, fertilizer, and pesticides.' },
  { icon: Shield, title: 'Crop Protection', description: 'Early detection of diseases and pests minimizes crop damage and reduces the need for harmful chemicals.' },
  { icon: TrendingUp, title: 'Increased Yields', description: 'Data-driven insights help optimize planting, irrigation, and harvesting for maximum crop production.' },
  { icon: Users, title: 'Knowledge Sharing', description: 'Access a growing database of agricultural knowledge and best practices from experts worldwide.' },
  { icon: Globe, title: 'Global Impact', description: 'Contributing to global food security by empowering farmers with technology that increases productivity sustainably.' },
  { icon: Heart, title: 'Farmer Wellbeing', description: 'Reducing the physical and mental burden on farmers through automation and intelligent decision support.' },
];

const timeline = [
  { year: '2023', event: 'Farmlyt AI founded with a vision to transform agriculture' },
  { year: '2024', event: 'Launched AI disease detection with 95% accuracy' },
  { year: '2025', event: 'Expanded to 100+ crop categories and plant identification' },
  { year: '2026', event: 'Global reach serving farmers in 50+ countries' },
];

export default function About() {
  return (
    <main>
      <PageHeader
        title="About Farmlyt AI"
        description="Empowering farmers worldwide with artificial intelligence for smarter, more sustainable agriculture."
      />

      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {missionPoints.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="relative glass rounded-2xl p-6 lg:p-8 hover:shadow-xl hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all duration-300 hover:-translate-y-0.5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center mb-3.5 shadow-lg shadow-emerald-500/20">
                    <Icon className="w-5.5 h-5.5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-16 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Why Choose Us"
            title="Benefits of Farmlyt AI"
            description="Discover how Farmlyt AI can transform your agricultural practices and help you achieve better results."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-2.5">
                    <Icon className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Our Journey"
            title="Company Timeline"
            description="The story of Farmlyt AI and our mission to revolutionize agriculture."
          />

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 to-blue-500" />

            <div className="space-y-6">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative flex gap-6 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.35, delay: index * 0.1 }}
                >
                  <div className="relative z-10 w-[50px] h-[50px] rounded-xl gradient-bg flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20 hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-[11px]">{item.year}</span>
                  </div>
                  <div className="pt-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3.5 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 transition-all duration-300 flex-1">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                      {item.event}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
