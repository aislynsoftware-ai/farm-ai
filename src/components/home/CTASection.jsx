import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

const initialForm = { name: '', email: '', subject: '', message: '' };

export default function CTASection() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.trim().length < 10) errs.message = 'Min 10 characters';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
      setForm(initialForm);
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const inputClass = (field) =>
    `w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border ${
      errors[field] ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 dark:border-gray-600 focus:border-emerald-500'
    } focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 text-sm`;

  return (
    <section className="relative py-12 lg:py-16 overflow-hidden">
      <div className="absolute inset-0 gradient-bg opacity-5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-3xl" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          {submitted ? (
            <motion.div
              className="glass rounded-2xl p-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Thank you for reaching out. We will get back to you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <div className="glass rounded-2xl p-6 lg:p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Get in Touch
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Have a question or want to learn more? We would love to hear from you.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className={inputClass('name')} />
                    {errors.name && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={12} />{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" className={inputClass('email')} />
                    {errors.email && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={12} />{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" className={inputClass('subject')} />
                  {errors.subject && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={12} />{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Tell us more..." className={`${inputClass('message')} resize-none`} />
                  {errors.message && <p className="flex items-center gap-1 mt-1 text-xs text-red-500"><AlertCircle size={12} />{errors.message}</p>}
                </div>

                <div className="pt-1 text-center">
                  <Button type="submit" icon={Send} className="w-full sm:w-auto">
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
