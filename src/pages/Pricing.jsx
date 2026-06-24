import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, HelpCircle } from 'lucide-react';
import SEO from '../components/common/SEO';
import PageHeader from '../components/layout/PageHeader';
import { Link } from 'react-router-dom';
import api from '../services/api';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.plan.pricing().then(setPlans).catch(() => {});
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const isLoggedIn = !!user;

  const getPlanLink = (plan) => {
    const n = plan.name.toUpperCase();
    if (n === 'ENTERPRISE') return '/enterprise';
    if (!isLoggedIn) return '/register';
    if (n === 'FREE') return '/dashboard';
    return `/plan-checkout?plan=${n}`;
  };

  const getPlanText = (plan) => {
    const n = plan.name.toUpperCase();
    if (n === 'ENTERPRISE') return 'Contact Sales';
    if (!isLoggedIn) return 'Get Started';
    if (n === 'FREE') return 'Go to Dashboard';
    return 'Purchase Plan';
  };

  return (
    <main>
      <SEO
        title="Pricing"
        description="Choose the perfect plan for your agricultural AI needs. From free to enterprise-grade API access."
        url="/pricing"
      />
      <PageHeader
        title="Transparent Pricing"
        description="Choose the plan that fits your needs. Scale as you grow."
      />
      <section className="py-16 bg-gradient-to-b from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
          >
            {plans.concat([
              { name: 'ENTERPRISE', price: 'Custom', requests: 'Unlimited', popular: false, features: ['Unlimited API requests', 'All detection models', 'Real-time priority', 'Dedicated account manager', 'White label solution', 'Custom integrations', 'SLA guarantee', 'On-premise deployment'] }
            ]).map((plan) => (
              <motion.div
                key={plan.name}
                variants={item}
                className={`relative flex flex-col rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 ${
                  plan.popular
                    ? 'border-emerald-500 bg-white dark:bg-gray-800 shadow-lg shadow-emerald-500/10 scale-[1.02] z-10'
                    : 'border-gray-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 hover:border-emerald-200 dark:hover:border-emerald-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                      <Sparkles size={11} />
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-xs text-gray-500 dark:text-gray-400"> total</span>}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{plan.requests}</p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {(plan.features || []).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <Check size={13} className="mt-0.5 text-emerald-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={getPlanLink(plan)}
                  className={`block text-center py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg hover:shadow-emerald-500/25'
                      : plan.name === 'ENTERPRISE'
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                      : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/70'
                  }`}
                >
                  {getPlanText(plan)}
                </Link>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800">
              <HelpCircle size={14} className="text-emerald-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Need a custom plan?{' '}
                <Link to="/enterprise" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                  Contact our sales team
                </Link>
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
