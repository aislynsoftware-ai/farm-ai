import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function TestimonialCard({ testimonial, index = 0 }) {
  return (
    <motion.div
      className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}
          />
        ))}
      </div>

      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-sm italic">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
          {testimonial.avatar}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
            {testimonial.name}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {testimonial.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
