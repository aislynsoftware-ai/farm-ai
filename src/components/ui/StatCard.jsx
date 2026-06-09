import { motion } from 'framer-motion';

export default function StatCard({ stat, index = 0 }) {
  const Icon = stat.icon;

  return (
    <motion.div
      className="relative text-center p-5 lg:p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
      </div>

      <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
        {stat.value}
      </div>

      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-0.5">
        {stat.label}
      </h3>

      <p className="text-xs text-gray-500 dark:text-gray-500">
        {stat.description}
      </p>
    </motion.div>
  );
}
