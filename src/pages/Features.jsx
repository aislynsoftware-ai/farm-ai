import { motion } from 'framer-motion';
import { CheckCircle, Upload, Search, Sparkles, Smartphone, Globe, BarChart, Shield } from 'lucide-react';
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
  'Offline-capable mobile interface',
  'Real-time collaborative diagnostics',
];

const howItWorks = [
  { step: 1, icon: Upload, title: 'Upload a Photo', description: 'Take or select a photo of your crop leaf, fruit, or flower using any smartphone or camera.' },
  { step: 2, icon: Search, title: 'AI Analysis', description: 'Our deep learning models analyze the image in real-time, comparing it against thousands of labeled samples.' },
  { step: 3, icon: Sparkles, title: 'Get Results', description: 'Receive instant diagnosis with disease identification, treatment recommendations, and prevention tips.' },
  { step: 4, icon: BarChart, title: 'Track Progress', description: 'Monitor your crop health over time with detailed history, analytics, and personalized farming insights.' },
];

const featStats = [
  { icon: Smartphone, value: '50,000+', label: 'Active Users' },
  { icon: Globe, value: '50+', label: 'Countries' },
  { icon: BarChart, value: '96%', label: 'Avg. Accuracy' },
  { icon: Shield, value: '100+', label: 'Crop Types' },
];

export default function Features() {
  return (
    <main>
      <PageHeader
        title="Platform Features"
        description="Discover the powerful features that make Farmlyt AI the leading AI-powered agriculture platform."
      />

      {/* Stats */}
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featStats.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center p-5 rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                >
                  <Icon className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                  <div className="text-xl md:text-2xl font-bold gradient-text mb-0.5">{item.value}</div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">{item.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Features Grid */}
      <section className="py-10 lg:py-16 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Everything You Need"
            title="Complete Feature Set"
            description="A comprehensive suite of AI-powered tools designed for modern agriculture."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {featuresData.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Simple Process"
            title="How It Works"
            description="Get started in minutes with our intuitive four-step process."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  className="relative text-center p-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.35, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{item.step}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">{item.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Highlights */}
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
