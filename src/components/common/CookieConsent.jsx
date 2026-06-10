import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'farmlyt_cookie_consent';
const VISIT_KEY = 'farmlyt_visit_count';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
    const visits = parseInt(localStorage.getItem(VISIT_KEY) || '0', 10);
    localStorage.setItem(VISIT_KEY, visits + 1);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="max-w-5xl mx-auto rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 shadow-2xl shadow-emerald-900/10 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center flex-shrink-0">
              <Cookie size={20} className="text-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                We use cookies to enhance your experience. By continuing, you agree to our{' '}
                <Link to="/cookies" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">Cookie Policy</Link>.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={decline}
                className="px-3 py-1.5 rounded-lg border-2 border-emerald-200 dark:border-emerald-700 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors cursor-pointer shadow-lg shadow-emerald-200/50 dark:shadow-none"
              >
                Accept
              </button>
              <button
                onClick={decline}
                className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
