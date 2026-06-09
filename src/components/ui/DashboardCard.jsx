import { motion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';

export default function DashboardCard({ item, index = 0 }) {
  const Icon = item.icon;

  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="absolute top-4 right-4">
        <div className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 text-xs font-medium flex items-center gap-1">
          <Lock size={10} />
          Coming Soon
        </div>
      </div>

      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20">
        <Icon className="w-7 h-7 text-white" />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {item.title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-5 text-sm">
        {item.description}
      </p>

      <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:gap-3 transition-all duration-300">
        Get Notified
        <ArrowRight size={16} />
      </div>
    </motion.div>
  );
}
