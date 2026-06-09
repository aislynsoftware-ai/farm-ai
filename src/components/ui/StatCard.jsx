import { motion } from 'framer-motion';

export default function StatCard({ stat, index = 0 }) {
  const Icon = stat.icon;

  return (
    <motion.div
      className="relative text-center p-6 lg:p-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
      </div>

      <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
        {stat.value}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {stat.label}
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-500">
        {stat.description}
      </p>
    </motion.div>
  );
}
