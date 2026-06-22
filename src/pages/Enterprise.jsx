import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Headphones, Puzzle, Sparkles, Sliders, MessageCircle, Mail, Phone, ArrowUpRight, Send, AlertCircle } from 'lucide-react';
import SEO from '../components/common/SEO';
import PageHeader from '../components/layout/PageHeader';

const FEATURES = [
  { icon: Sliders, title: 'Custom Request Limits', desc: 'Tailored API rate limits based on your usage patterns and requirements.' },
  { icon: Headphones, title: 'Dedicated Support', desc: '24/7 priority support with a dedicated account manager for your organization.' },
  { icon: Puzzle, title: 'Custom Integrations', desc: 'Custom API integrations tailored to your existing infrastructure and workflows.' },
  { icon: Sparkles, title: 'White Label Solution', desc: 'Deploy our AI models under your own brand with custom UI and documentation.' },
  { icon: Shield, title: 'SLA Guarantee', desc: '99.9% uptime SLA with guaranteed response times and priority queuing.' },
  { icon: MessageCircle, title: 'On-Premise Deployment', desc: 'Deploy models on your own infrastructure for complete data sovereignty.' },
];

export default function Enterprise() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('access_key', import.meta.env.VITE_WEB3FORMS_KEY);
      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('phone', form.phone);
      fd.append('company', form.company);
      fd.append('message', form.message);
      fd.append('subject', `Enterprise Inquiry from ${form.company || form.name}`);

      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setForm({ name: '', email: '', phone: '', company: '', message: '' });
        setTimeout(() => setSent(false), 5000);
      } else {
        setApiError(data.message || 'Failed to send message');
      }
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <SEO
        title="Enterprise Solutions"
        description="Enterprise-grade AI solutions for agriculture. Custom integrations, dedicated support, white label solutions, and on-premise deployment."
        url="/enterprise"
      />
      <PageHeader
        title="Enterprise Solutions"
        description="Scale your agricultural AI capabilities with enterprise-grade infrastructure."
      />

      {/* Features Grid */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon size={18} className="text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gradient-to-b from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Get in Touch</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tell us about your requirements and we'll get back to you within 24 hours.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Methods */}
            <div className="space-y-3">
              <a
                href="https://wa.me/918892209021"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <MessageCircle size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">WhatsApp</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">+91 88922 09021</p>
                </div>
                <ArrowUpRight size={14} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
              </a>
              <a
                href="mailto:support@farmlytai.in"
                className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Mail size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">Email</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">support@farmlytai.in</p>
                </div>
                <ArrowUpRight size={14} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
              </a>
              <a
                href="tel:+918892209021"
                className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                  <Phone size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">Phone</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">+91 88922 09021</p>
                </div>
                <ArrowUpRight size={14} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
              </a>
            </div>

            {/* Contact Form */}
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-3">
                  <Check size={24} className="text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Message Sent!</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">We'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {apiError && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                    <span>{apiError}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300 transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300 transition-all"
                  />
                </div>
                <textarea
                  placeholder="Tell us about your requirements..."
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300 transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 transition-all duration-200 cursor-pointer"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
