import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@farmai.agriculture', href: 'mailto:hello@farmai.agriculture' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  { icon: MapPin, label: 'Address', value: '123 Agri-Tech Park, Nairobi, Kenya' },
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
    `w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-800 border ${
      errors[field] ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-emerald-500'
    } focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400`;

  return (
    <main>
      <PageHeader
        title="Contact Us"
        description="Have a question, suggestion, or want to learn more? We'd love to hear from you."
      />

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Get in Touch
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We are here to help and answer any questions you might have. We look forward to hearing from you.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={index}
                      href={item.href}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950 transition-colors duration-300">
                        <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-500">{item.label}</p>
                        <p className="font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
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
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {submitted ? (
                <motion.div
                  className="glass rounded-2xl p-12 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Thank you for reaching out. We will get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 lg:p-10 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name *
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
                        <p className="flex items-center gap-1 mt-1.5 text-sm text-red-500">
                          <AlertCircle size={14} />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
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
                        <p className="flex items-center gap-1 mt-1.5 text-sm text-red-500">
                          <AlertCircle size={14} />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
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
                      <p className="flex items-center gap-1 mt-1.5 text-sm text-red-500">
                        <AlertCircle size={14} />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us more about your inquiry..."
                      className={`${inputClass('message')} resize-none`}
                    />
                    {errors.message && (
                      <p className="flex items-center gap-1 mt-1.5 text-sm text-red-500">
                        <AlertCircle size={14} />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" size="lg" icon={Send} className="w-full sm:w-auto">
                    Send Message
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
