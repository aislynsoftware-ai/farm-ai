import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sprout, LogIn, UserPlus, LayoutDashboard, ChevronDown, LogOut, ChevronRight, Store } from 'lucide-react';
import { NAV_LINKS, ROUTES, APP_NAME } from '../../constants';
import ThemeToggle from '../common/ThemeToggle';
import Button from '../common/Button';
import GoogleTranslate from '../common/GoogleTranslate';
import { cn } from '../../utils/cn';

export default function Navbar({ isDark, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const userMenuRef = useRef(null);
  const dropdownRefs = useRef({});
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
    setMobileExpanded(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (openDropdown) {
        const ref = dropdownRefs.current[openDropdown];
        if (ref && !ref.contains(e.target)) setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openDropdown]);

  const isActive = (path) => location.pathname === path;
  const isChildActive = (children) => children?.some((c) => location.pathname === c.path);

  const renderDesktopLink = (link) => {
    if (link.children) {
      const active = isActive(link.path) || isChildActive(link.children);
      return (
        <div
          key={link.label}
          className="relative"
          ref={(el) => { dropdownRefs.current[link.label] = el; }}
          onMouseEnter={() => setOpenDropdown(link.label)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <button
            onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
            className={cn(
              'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group cursor-pointer',
              active
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300'
            )}
          >
            <span className="relative z-10">{link.label}</span>
            <ChevronDown
              size={12}
              className={`transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`}
            />
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
          </button>
          <AnimatePresence>
            {openDropdown === link.label && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full mt-1 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20 z-[9999] overflow-hidden"
              >
                {link.children.map((child) => (
                  <Link
                    key={child.label}
                    to={child.path}
                    onClick={() => setOpenDropdown(null)}
                    className={cn(
                      'flex items-center gap-2 px-3.5 py-2.5 text-xs transition-colors',
                      isActive(child.path)
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400'
                    )}
                  >
                    <ChevronRight size={11} className="text-emerald-400" />
                    {child.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

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
  };

  const renderMobileLink = (link) => {
    if (link.children) {
      const expanded = mobileExpanded === link.label;
      const active = isActive(link.path) || isChildActive(link.children);
      return (
        <div key={link.label}>
          <button
            onClick={() => setMobileExpanded(expanded ? null : link.label)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
              active
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900 hover:text-emerald-600 dark:hover:text-emerald-300'
            )}
          >
            <span>{link.label}</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-emerald-200 dark:border-emerald-700 pl-3">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.path}
                      className={cn(
                        'block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive(child.path)
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                          : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900 hover:text-emerald-600 dark:hover:text-emerald-300'
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

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
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-emerald-50/80 dark:bg-emerald-950/80 backdrop-blur-md',
        scrolled && 'shadow-lg shadow-emerald-500/5 dark:shadow-emerald-950/50'
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
            {NAV_LINKS.map(renderDesktopLink)}
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle isDark={isDark} toggle={toggleTheme} />
            <GoogleTranslate />
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/50 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 transition-all"
                  >
                    <Sprout size={13} />
                    {user.name || 'User'}
                    <ChevronDown size={12} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20 z-[9999] overflow-hidden">
                      <Link
                        to={ROUTES.DASHBOARD}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                      >
                        <LayoutDashboard size={13} />
                        Dashboard
                      </Link>
                      {user?.role === 'shop_owner' ? (
                        <Link
                          to="/my-shop"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                        >
                          <Store size={13} />
                          My Shop
                        </Link>
                      ) : (
                        <Link
                          to="/register-shop"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                        >
                          <Store size={13} />
                          Register Your Shop
                        </Link>
                      )}
                      <button
                        onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <LogOut size={13} />
                        Logout
                      </button>
                    </div>
                  )}
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
              {NAV_LINKS.map(renderMobileLink)}
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