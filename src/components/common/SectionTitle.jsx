import { motion } from 'framer-motion';

export default function SectionTitle({
  subtitle,
  title,
  description,
  align = 'center',
  light = false,
}) {
  const alignments = {
    center: 'text-center',
    left: 'text-left',
  };

  return (
    <motion.div
      className={`max-w-3xl mx-auto mb-16 ${alignments[align]}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      {subtitle && (
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 rounded-full border border-emerald-200 dark:border-emerald-800">
          {subtitle}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${light ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-lg md:text-xl leading-relaxed ${light ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
