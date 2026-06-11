import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'venkatesh@aislyntech.com', href: 'mailto:venkatesh@aislyntech.com' },
  { icon: Phone, label: 'Phone', value: '+91 8892209021', href: 'tel:+918892209021' },
  { icon: MessageCircle, label: 'WhatsApp', value: '+91 8892209021', href: 'https://wa.me/918892209021' },
  { icon: MapPin, label: 'Address', value: 'No:1688, 1st floor, 18th Cross, 21st Main Rd, MC Layout, Vijayanagar, Bengaluru, Karnataka 560040' },
];

const initialForm = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
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
    else if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
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
    <main>
      <PageHeader
        title="Contact Us"
        description="Have a question, suggestion, or want to learn more? We'd love to hear from you."
      />

      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
            <motion.div
              className="lg:col-span-2 space-y-5"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Get in Touch
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  We are here to help and answer any questions you might have. We look forward to hearing from you.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={index}
                      href={item.href}
                      className="flex items-start gap-3.5 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950 transition-colors duration-300">
                        <Icon className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{item.label}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
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
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Thank you for reaching out. We will get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 lg:p-8 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={inputClass('name')}
                      />
                      {errors.name && (
                        <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                          <AlertCircle size={12} />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={inputClass('email')}
                      />
                      {errors.email && (
                        <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                          <AlertCircle size={12} />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className={inputClass('subject')}
                    />
                    {errors.subject && (
                      <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                        <AlertCircle size={12} />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us more about your inquiry..."
                      className={`${inputClass('message')} resize-none`}
                    />
                    {errors.message && (
                      <p className="flex items-center gap-1 mt-1 text-xs text-red-500">
                        <AlertCircle size={12} />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-1">
                    <Button type="submit" icon={Send} className="w-full sm:w-auto">
                      Send Message
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
