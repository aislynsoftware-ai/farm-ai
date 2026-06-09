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
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.05),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="How It Works"
          title="Three Simple Steps"
          description="Getting started with Farm AI is easy. Follow these simple steps to transform your agricultural practices."
        />

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-emerald-200 to-emerald-300 dark:from-emerald-800 dark:to-emerald-700" />
                )}

                <div className="relative inline-flex mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl shadow-emerald-500/20`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-gray-800 border-2 border-emerald-500 flex items-center justify-center text-sm font-bold text-emerald-600">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm max-w-xs mx-auto">
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
