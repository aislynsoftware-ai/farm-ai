import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sprout } from 'lucide-react';
import { NAV_LINKS, ROUTES, APP_NAME } from '../../constants';
import ThemeToggle from '../common/ThemeToggle';
import Button from '../common/Button';
import { cn } from '../../utils/cn';

export default function Navbar({ isDark, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass shadow-lg shadow-black/5'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {APP_NAME}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} toggle={toggleTheme} />
            <Link to={ROUTES.DASHBOARD} className="hidden lg:block">
              <Button size="sm">Dashboard</Button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200',
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-2 px-4">
                <Link to={ROUTES.DASHBOARD}>
                  <Button size="sm" className="w-full">
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
