import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServiceCard({ service, index = 0 }) {
  const Icon = service.icon;

  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex flex-col h-full">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-3.5 shadow-lg shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          <Icon className="w-5.5 h-5.5 text-white" />
        </div>

        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
          {service.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3.5 text-xs flex-1">
          {service.description}
        </p>

        {service.features && (
          <ul className="space-y-1 mb-3.5">
            {service.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <span className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:gap-2.5 transition-all duration-300 group/link mt-auto"
        >
          Learn More
          <ArrowRight size={14} className="transition-transform duration-300 group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}
