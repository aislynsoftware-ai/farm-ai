import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle({ isDark, toggle }) {
  return (
    <motion.button
      onClick={toggle}
      className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 cursor-pointer flex-shrink-0"
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
        animate={{ x: isDark ? 28 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon size={12} className="text-gray-700" />
        ) : (
          <Sun size={12} className="text-amber-500" />
        )}
      </motion.div>
    </motion.button>
  );
}
