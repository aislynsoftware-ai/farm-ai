import { motion } from 'framer-motion';

export default function StatCard({ stat, index = 0 }) {
  const Icon = stat.icon;

  return (
    <motion.div
      className="relative text-center p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      </div>

      <div className="text-2xl md:text-3xl font-bold gradient-text mb-0.5">
        {stat.value}
      </div>

      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
        {stat.label}
      </h3>

      <p className="text-[11px] text-gray-500 dark:text-gray-400">
        {stat.description}
      </p>
    </motion.div>
  );
}
