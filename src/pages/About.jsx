import { motion } from 'framer-motion';
import { Target, Eye, Heart, Leaf, Shield, TrendingUp, Users, Globe, Sprout, Camera, CheckCircle, BookOpen, Award, Quote } from 'lucide-react';
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

const stats = [
  { label: 'Farmers Served', value: '50,000+' },
  { label: 'Crop Types', value: '100+' },
  { label: 'Detection Accuracy', value: '96%' },
  { label: 'Countries Reached', value: '50+' },
];

const offerings = [
  {
    icon: Camera,
    title: 'AI Disease Detection',
    description: 'Upload a photo of any crop and our AI instantly identifies diseases, pests, and nutrient deficiencies with industry-leading accuracy, providing actionable treatment recommendations.',
  },
  {
    icon: Leaf,
    title: 'Multi-Crop Recognition',
    description: 'Our platform supports vegetables, fruits, flowers, grains, and potted plants — each with dedicated, specialized AI models trained on thousands of labeled samples.',
  },
  {
    icon: Globe,
    title: 'Global Knowledge Base',
    description: 'Access a vast repository of agricultural knowledge, farming tips, and best practices curated from experts worldwide and tailored to your specific crops and region.',
  },
  {
    icon: TrendingUp,
    title: 'Smart Recommendations',
    description: 'Get personalized fertilizer, pesticide, and crop care recommendations based on real-time AI analysis of your crop health and local growing conditions.',
  },
];

const values = [
  { icon: Award, title: 'Innovation', description: 'Continuously pushing the boundaries of AI technology to deliver the most accurate and reliable agricultural solutions available.' },
  { icon: Users, title: 'Community', description: 'Building a global community of farmers, agronomists, and researchers working together to advance sustainable agriculture.' },
  { icon: Shield, title: 'Trust', description: 'Maintaining the highest standards of data privacy, security, and transparency in every aspect of our platform.' },
  { icon: Heart, title: 'Impact', description: 'Measurably improving the lives of farmers by reducing crop losses, increasing yields, and promoting sustainable practices.' },
];

const timeline = [
  { year: '2023', event: 'Farmlyt AI founded with a vision to transform agriculture using artificial intelligence.' },
  { year: '2024', event: 'Launched AI disease detection module with 95% accuracy for major vegetable crops.' },
  { year: '2025', event: 'Expanded to 100+ crop categories including fruits, flowers, and plant identification.' },
  { year: '2026', event: 'Global reach serving 50,000+ farmers across 50+ countries with continuous model improvements.' },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

export default function About() {
  return (
    <main>
      <PageHeader
        title="About Farmlyt AI"
        description="Empowering farmers worldwide with artificial intelligence for smarter, more sustainable agriculture."
      />

      {/* Mission & Vision */}
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

      {/* Our Story */}
      <section className="py-10 lg:py-16 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <SectionTitle
              subtitle="Our Story"
              title="Born from a Simple Idea"
              description="How a passion for agriculture and technology came together to create something transformative."
            />
            <motion.div
              className="mt-8 space-y-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed"
              {...fadeUp}
              transition={{ duration: 0.5 }}
            >
              <p>
                Farmlyt AI was founded in 2023 by a team of agronomists, data scientists, and software engineers who shared a common
                belief — that cutting-edge artificial intelligence should be accessible to every farmer, not just large agricultural corporations.
              </p>
              <p>
                We saw firsthand how small and medium-scale farmers struggled with crop diseases, pest infestations, and nutrient deficiencies,
                often losing entire harvests because they lacked access to expert agricultural advice. Traditional plant pathology services
                are expensive, slow, and concentrated in urban areas — leaving rural farmers with limited options.
              </p>
              <p>
                Our solution was simple: build an AI-powered platform that can diagnose crop issues instantly from a single photo,
                available on any smartphone. By training deep learning models on thousands of labeled crop images, we achieved
                diagnostic accuracy rivaling human experts — at a fraction of the cost and time.
              </p>
              <p>
                Today, Farmlyt AI serves over 50,000 farmers across 50+ countries, processing thousands of detections daily.
                But we are just getting started. Our roadmap includes yield prediction, weather integration, pest outbreak forecasting,
                and a marketplace connecting farmers directly with suppliers and buyers.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
              >
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <p className="text-emerald-700 dark:text-emerald-300 text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-10 lg:py-16 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="What We Offer"
            title="Our Core Services"
            description="Comprehensive AI-powered solutions designed to address every aspect of modern crop management."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {offerings.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Our Values"
            title="What Drives Us"
            description="The principles that guide every decision we make and every product we build."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {values.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center p-6 rounded-2xl glass hover:shadow-xl hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all duration-300 hover:-translate-y-0.5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                >
                  <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
                    <Icon className="w-5.5 h-5.5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">{item.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-10 lg:py-16 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Why Choose Us"
            title="Benefits of Farmlyt AI"
            description="Discover how Farmlyt AI can transform your agricultural practices and help you achieve better results."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {[
              { icon: Leaf, title: 'Sustainable Farming', description: 'Reduce waste and optimize resource usage with AI-driven recommendations for water, fertilizer, and pesticides.' },
              { icon: Shield, title: 'Crop Protection', description: 'Early detection of diseases and pests minimizes crop damage and reduces the need for harmful chemicals.' },
              { icon: TrendingUp, title: 'Increased Yields', description: 'Data-driven insights help optimize planting, irrigation, and harvesting for maximum crop production.' },
              { icon: Users, title: 'Knowledge Sharing', description: 'Access a growing database of agricultural knowledge and best practices from experts worldwide.' },
              { icon: Globe, title: 'Global Impact', description: 'Contributing to global food security by empowering farmers with technology that increases productivity sustainably.' },
              { icon: Heart, title: 'Farmer Wellbeing', description: 'Reducing the physical and mental burden on farmers through automation and intelligent decision support.' },
            ].map((benefit, index) => {
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
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{benefit.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Our Journey"
            title="Company Timeline"
            description="The story of Farmlyt AI and our mission to revolutionize agriculture."
          />
          <div className="relative max-w-3xl mx-auto mt-8">
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
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{item.event}</p>
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
