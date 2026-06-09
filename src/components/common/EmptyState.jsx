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
      className="flex flex-col items-center justify-center py-16 px-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
        {description}
      </p>
      {action}
    </motion.div>
  );
}
