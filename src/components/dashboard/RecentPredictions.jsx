import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bug, Leaf, Apple, Clock } from 'lucide-react';
import api from '../../services/api';

const iconMap = { tomato: Bug, potato: Bug, brinjal: Bug, chilli: Bug, lady_finger: Bug, brinjal_veg: Leaf, cauliflower: Leaf, cucumber: Leaf, ridge: Leaf, bitter_gourd: Leaf, custard_apple: Apple, guava: Apple, pomegranate: Apple, lemon_fruit: Apple, tomato_fruit: Apple, jasmine: Leaf, rose: Leaf, marigold: Leaf, chrysanthemum: Leaf };

const colorMap = {
  detected: 'text-red-500 bg-red-50 dark:bg-red-950/30',
  healthy: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
  identified: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
  default: 'text-gray-500 bg-gray-50 dark:bg-gray-800',
};

export default function RecentPredictions() {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    api.farming.getLeafPredictions().then((data) => {
      if (Array.isArray(data)) setPredictions(data.slice(0, 5));
    }).catch(() => {});
  }, []);

  if (predictions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Predictions</h3>
        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium hover:underline cursor-pointer">View All</span>
      </div>
      <div className="space-y-3">
        {predictions.map((item, index) => {
          const Icon = iconMap[item.crop] || Bug;
          const status = item.disease && item.disease.toLowerCase() !== 'healthy' ? 'Detected' : item.disease === 'healthy' ? 'Healthy' : 'Analyzed';
          const color = item.disease && item.disease.toLowerCase() !== 'healthy' ? colorMap.detected : item.disease === 'healthy' ? colorMap.healthy : colorMap.default;
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
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{item.disease || item.prediction || item.crop}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                    <Clock size={10} />
                    {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                  </span>
                  <span className="text-[10px] text-gray-400">{item.crop}</span>
                </div>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${color}`}>
                {status}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
