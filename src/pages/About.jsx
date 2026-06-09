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
  {
    icon: Leaf,
    title: 'Sustainable Farming',
    description: 'Reduce waste and optimize resource usage with AI-driven recommendations for water, fertilizer, and pesticides.',
  },
  {
    icon: Shield,
    title: 'Crop Protection',
    description: 'Early detection of diseases and pests minimizes crop damage and reduces the need for harmful chemicals.',
  },
  {
    icon: TrendingUp,
    title: 'Increased Yields',
    description: 'Data-driven insights help optimize planting, irrigation, and harvesting for maximum crop production.',
  },
  {
    icon: Users,
    title: 'Knowledge Sharing',
    description: 'Access a growing database of agricultural knowledge and best practices from experts worldwide.',
  },
  {
    icon: Globe,
    title: 'Global Impact',
    description: 'Contributing to global food security by empowering farmers with technology that increases productivity sustainably.',
  },
  {
    icon: Heart,
    title: 'Farmer Wellbeing',
    description: 'Reducing the physical and mental burden on farmers through automation and intelligent decision support.',
  },
];

const timeline = [
  { year: '2023', event: 'Farm AI founded with a vision to transform agriculture' },
  { year: '2024', event: 'Launched AI disease detection with 95% accuracy' },
  { year: '2025', event: 'Expanded to 100+ crop categories and plant identification' },
  { year: '2026', event: 'Global reach serving farmers in 50+ countries' },
];

export default function About() {
  return (
    <main>
      <PageHeader
        title="About Farm AI"
        description="Empowering farmers worldwide with artificial intelligence for smarter, more sustainable agriculture."
      />

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {missionPoints.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="relative glass rounded-2xl p-8 lg:p-10"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Why Choose Us"
            title="Benefits of Farm AI"
            description="Discover how Farm AI can transform your agricultural practices and help you achieve better results."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Our Journey"
            title="Company Timeline"
            description="The story of Farm AI and our mission to revolutionize agriculture."
          />

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-blue-500" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative flex gap-8 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                >
                  <div className="relative z-10 w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                    <span className="text-white font-bold text-sm">{item.year}</span>
                  </div>
                  <div className="pt-3">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
