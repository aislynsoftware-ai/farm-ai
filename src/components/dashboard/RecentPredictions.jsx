import { motion } from 'framer-motion';
import { Bug, Leaf, Apple, Clock } from 'lucide-react';

const predictions = [
  { id: 1, type: 'Disease', icon: Bug, name: 'Tomato Late Blight', status: 'Detected', time: '2 min ago', color: 'text-red-500 bg-red-50 dark:bg-red-950/30' },
  { id: 2, type: 'Plant', icon: Leaf, name: 'Maize (Zea mays)', status: 'Identified', time: '15 min ago', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
  { id: 3, type: 'Food', icon: Apple, name: 'Granny Smith Apple', status: 'Analyzed', time: '1 hour ago', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
  { id: 4, type: 'Disease', icon: Bug, name: 'Wheat Rust', status: 'Healthy', time: '3 hours ago', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
];

export default function RecentPredictions() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Predictions</h3>
        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium hover:underline cursor-pointer">View All</span>
      </div>
      <div className="space-y-3">
        {predictions.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-gray-600 dark:text-gray-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                    <Clock size={10} />
                    {item.time}
                  </span>
                </div>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${item.color}`}>
                {item.status}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
