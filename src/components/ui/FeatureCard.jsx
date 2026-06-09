import { motion } from 'framer-motion';

export default function FeatureCard({ feature, index = 0 }) {
  const Icon = feature.icon;

  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {feature.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}
