import { motion } from 'framer-motion';
import { Bell, Sprout } from 'lucide-react';

export default function WelcomeBanner() {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-green-700 to-blue-800 p-6 lg:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Welcome back, Farmer!</h2>
            <p className="text-emerald-100/80 text-xs mt-0.5">Here&apos;s your farm overview for today</p>
          </div>
        </div>
        <button className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-200 cursor-pointer">
          <Bell size={18} className="text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </motion.div>
  );
}
