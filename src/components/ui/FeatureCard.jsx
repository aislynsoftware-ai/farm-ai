import { motion } from 'framer-motion';

export default function FeatureCard({ feature, index = 0 }) {
  const Icon = feature.icon;

  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
          <Icon className="w-[18px] h-[18px] text-white" />
        </div>

        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
          {feature.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xs">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}
