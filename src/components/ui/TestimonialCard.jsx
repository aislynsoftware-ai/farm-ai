import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function TestimonialCard({ testimonial, index = 0 }) {
  return (
    <motion.div
      className="relative bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="flex items-center gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}
          />
        ))}
      </div>

      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-xs italic">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      <div className="flex items-center gap-2.5 mt-auto">
        <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {testimonial.avatar}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-xs">
            {testimonial.name}
          </h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-500">
            {testimonial.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
