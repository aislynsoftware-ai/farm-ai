import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { ROUTES } from '../../constants';

export default function CTASection() {
  return (
    <section className="relative py-12 lg:py-16 overflow-hidden">
      <div className="absolute inset-0 gradient-bg opacity-5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-3xl" />

      <motion.div
        className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative glass rounded-2xl p-6 md:p-8 lg:p-10">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Ready to Transform Your Farming?
          </h2>

          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed">
            Join thousands of farmers using AI to increase crop yields, reduce losses, and farm smarter.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to={ROUTES.DASHBOARD}>
              <Button size="lg" icon={ArrowRight} iconPosition="right">
                Get Started Free
              </Button>
            </Link>
            <Link to={ROUTES.CONTACT}>
              <Button variant="secondary" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
            No credit card required. Free forever for basic use.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
