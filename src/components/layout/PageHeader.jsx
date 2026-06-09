import { motion } from 'framer-motion';

export default function PageHeader({
  title,
  description,
  gradient = 'from-emerald-500 via-green-500 to-blue-500',
}) {
  return (
    <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(59,130,246,0.05),transparent_50%)]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          className={`text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-6`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
