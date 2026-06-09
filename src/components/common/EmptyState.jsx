import { Inbox } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data available',
  description = 'There is nothing to display here yet.',
  action,
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-700">
        <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-md mb-5">
        {description}
      </p>
      {action}
    </motion.div>
  );
}
