import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  href,
  onClick,
  className,
  disabled,
  type = 'button',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105 active:scale-95',
    secondary:
      'border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:scale-105 active:scale-95',
    outline:
      'border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-105 active:scale-95',
    ghost:
      'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      disabled={disabled}
      {...props}
    >
      {content}
    </motion.button>
  );
}
