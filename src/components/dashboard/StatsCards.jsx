import { motion } from 'framer-motion';
import { Bug, Leaf, Apple, Brain } from 'lucide-react';

const stats = [
  { icon: Bug, label: 'Diseases Detected', value: '1,247', change: '+12%', color: 'from-emerald-400 to-green-500' },
  { icon: Leaf, label: 'Plants Identified', value: '3,568', change: '+8%', color: 'from-green-400 to-emerald-500' },
  { icon: Apple, label: 'Food Analyzed', value: '892', change: '+15%', color: 'from-emerald-500 to-teal-500' },
  { icon: Brain, label: 'AI Predictions', value: '5,021', change: '+23%', color: 'from-green-500 to-blue-500' },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 lg:p-5 border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <Icon className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
