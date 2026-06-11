import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sprout, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import { NAV_LINKS, ROUTES, APP_NAME } from '../../constants';
import ThemeToggle from '../common/ThemeToggle';
import Button from '../common/Button';
import { cn } from '../../utils/cn';

export default function Navbar({ isDark, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass-solid shadow-lg shadow-black/5 dark:shadow-black/20'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt={APP_NAME} className="h-11 w-auto" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {APP_NAME}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group',
                    active
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300'
                  )}
                >
                  <span className="relative z-10">{link.label}</span>
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {!active && (
                    <span className="absolute inset-x-2 bottom-1 h-0.5 bg-emerald-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle isDark={isDark} toggle={toggleTheme} />
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to={ROUTES.DASHBOARD}>
                    <Button size="sm" icon={LayoutDashboard}>Dashboard</Button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-emerald-700 dark:text-emerald-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <Sprout size={12} />{user.name || 'User'}
                  </span>
                </div>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN}>
                    <Button variant="ghost" size="sm" icon={LogIn}>Login</Button>
                  </Link>
                  <Link to={ROUTES.REGISTER}>
                    <Button size="sm" icon={UserPlus}>Register</Button>
                  </Link>
                </>
              )}
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
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
            className="lg:hidden border-t border-emerald-100 dark:border-emerald-800 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-xl shadow-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                        : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900 hover:text-emerald-600 dark:hover:text-emerald-300'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-emerald-100 dark:border-emerald-800 space-y-2 px-4">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                      {user.name || 'User'}
                    </div>
                    <Link to={ROUTES.DASHBOARD} className="block">
                      <Button size="sm" className="w-full justify-center">Dashboard</Button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 rounded-xl text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to={ROUTES.LOGIN} className="block">
                      <Button variant="outline" size="sm" icon={LogIn} className="w-full justify-center">Login</Button>
                    </Link>
                    <Link to={ROUTES.REGISTER} className="block">
                      <Button size="sm" icon={UserPlus} className="w-full justify-center">Register</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
