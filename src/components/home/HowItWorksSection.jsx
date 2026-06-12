import { motion } from 'framer-motion';
import { Upload, Brain, Download } from 'lucide-react';
import SectionTitle from '../common/SectionTitle';

const steps = [
  {
    icon: Upload,
    title: 'Upload an Image',
    description: 'Take a photo or upload an image of your plant, crop, or food item to our platform.',
    color: 'from-emerald-400 to-green-500',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Our advanced AI models analyze the image using deep learning algorithms trained on millions of samples.',
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: Download,
    title: 'Get Results',
    description: 'Receive detailed analysis, recommendations, and actionable insights within seconds.',
    color: 'from-emerald-600 to-blue-500',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative py-4 lg:py-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.05),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="How It Works"
          title="Three Simple Steps"
          description="Getting started with Farmlyt AI is easy. Follow these simple steps to transform your agricultural practices."
        />

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className="relative text-center p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-[36px] left-[60%] w-[80%] h-px bg-gradient-to-r from-emerald-200 to-emerald-300 dark:from-emerald-800 dark:to-emerald-700" />
                )}

                <div className="relative inline-flex mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg shadow-emerald-500/20`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-800 border-2 border-emerald-500 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xs max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
