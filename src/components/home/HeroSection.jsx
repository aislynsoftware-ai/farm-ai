import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { HERO, ROUTES } from '../../constants';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.1),transparent_60%),radial-gradient(ellipse_at_bottom_left,_rgba(59,130,246,0.08),transparent_50%)]" />

      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-22 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-pulse" />
              AI-Powered Agriculture
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-5xl font-extrabold leading-tight mb-5">
              <span className="gradient-text">{HERO.title}</span>
            </h1>

            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed mb-7">
              {HERO.description}
            </p>

            <div className="flex flex-wrap gap-3 mb-7">
  {[
    "Disease Detection",
    "Yield Prediction",
    "Potted Plant Identity",
    "AI Analytics",
  ].map((item) => (
    <span
      key={item}
      className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium"
    >
      {item}
    </span>
  ))}
</div>
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link to={ROUTES.DASHBOARD}>
                <Button size="lg" icon={ArrowRight} iconPosition="right">
                  {HERO.primaryBtn}
                </Button>
              </Link>
              <Link to={ROUTES.SERVICES}>
                <Button variant="secondary" size="lg" icon={Play}>
                  {HERO.secondaryBtn}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-3xl blur-xl" />
              <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur rounded-3xl border border-gray-700/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-400 ml-2">AI Crop Analysis Interface</span>
                </div>
                <div className="aspect-[3/2] rounded-2xl bg-gradient-to-br from-emerald-900/50 to-gray-800/50 border border-gray-700/50 overflow-hidden">
                  <img src="/hero.png" alt="AI Crop Analysis" className="w-full h-full object-cover" />
                </div>
                <div className="mt-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-1">
                                     
                  </div>
                  <p className="text-sm text-emerald-200">Disease: <strong>Bacterial Spot</strong> (Cassava leaf) Confidence: 97.3%</p>
                 
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
    </section>
  );
}
