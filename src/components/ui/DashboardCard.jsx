import { motion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';

export default function DashboardCard({ item, index = 0 }) {
  const Icon = item.icon;

  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div className="absolute top-3 right-3">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 text-[10px] font-medium">
          <Lock size={8} />
          Soon
        </span>
      </div>

      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center mb-3.5 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-5.5 h-5.5 text-white" />
      </div>

      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">
        {item.title}
      </h3>

      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-xs">
        {item.description}
      </p>

      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:gap-2.5 transition-all duration-300">
        Get Notified
        <ArrowRight size={14} />
      </span>
    </motion.div>
  );
}
