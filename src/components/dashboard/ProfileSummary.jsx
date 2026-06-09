import { motion } from 'framer-motion';
import { User, MapPin, Calendar, Award } from 'lucide-react';

export default function ProfileSummary() {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
          JD
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">John Doe</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">Premium Farmer</p>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-400">
          <MapPin size={14} className="text-gray-400" />
          Nairobi, Kenya
        </div>
        <div className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-400">
          <Calendar size={14} className="text-gray-400" />
          Member since 2024
        </div>
        <div className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-400">
          <Award size={14} className="text-gray-400" />
          247 predictions made
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Storage Used</span>
          <span className="text-[11px] font-medium text-gray-900 dark:text-white">2.4 GB / 5 GB</span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <div className="h-full w-[48%] rounded-full bg-gradient-to-r from-emerald-500 to-green-600" />
        </div>
      </div>
    </motion.div>
  );
}
