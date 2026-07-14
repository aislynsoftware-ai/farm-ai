import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Smartphone, Globe, Cpu, AppWindow, Server, Zap, Database, Bot, Code, Palette, Layout, Shield, Workflow, GitBranch, Layers, Cloud, BarChart, Eye, Bell, BookOpen, Puzzle, TestTube, Timer, RefreshCw, Headphones, Gift } from 'lucide-react';
import SEO from '../components/common/SEO';

const sections = [
  {
    id: 'ai',
    icon: Brain,
    title: 'AI Development',
    color: 'from-emerald-500 to-green-600',
    shadow: 'shadow-emerald-500/20',
    items: [
      { icon: Cpu, label: 'Computer Vision Models', desc: 'Custom-trained deep learning models for plant disease detection, fruit grading, vegetable classification, and flower identification using TensorFlow and PyTorch.' },
      { icon: Bot, label: 'AI Chatbot', desc: 'Intelligent conversational assistant powered by LLMs that helps farmers with crop advice, disease diagnosis, and agricultural best practices in real-time.' },
      { icon: Database, label: 'Image Recognition', desc: 'Multi-class image classification for leaves, fruits, vegetables, soil types, and potted plants with high accuracy using transfer learning.' },
      { icon: AppWindow, label: 'Prediction APIs', desc: 'RESTful AI prediction APIs for crop recommendation, fertilizer suggestion, and soil analysis based on sensor data and image inputs.' },
      { icon: Eye, label: 'Object Detection', desc: 'Real-time object detection models for identifying pests, diseases, and nutrient deficiencies in crops using YOLO and SSD architectures.' },
      { icon: BarChart, label: 'Data Analytics', desc: 'Predictive analytics for crop yield estimation, market price forecasting, and weather pattern analysis using statistical ML models.' },
    ],
    techs: ['TensorFlow', 'PyTorch', 'YOLO', 'OpenCV', 'Scikit-learn', 'LLMs', 'Flask', 'REST API'],
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Mobile App Development',
    color: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/20',
    items: [
      { icon: AppWindow, label: 'Cross-Platform Apps', desc: 'Built with React Native for seamless iOS and Android experiences — farmers can detect diseases, identify plants, and access insights on the go.' },
      { icon: Cpu, label: 'Real-Time Camera AI', desc: 'On-device camera integration with real-time AI inference for instant plant disease detection and crop identification without internet dependency.' },
      { icon: Zap, label: 'Offline Mode', desc: 'Core features work offline with local caching — critical for rural areas with limited connectivity. Syncs data when connection is restored.' },
      { icon: Smartphone, label: 'User-Friendly Interface', desc: 'Intuitive mobile UI designed for farmers with minimal technical knowledge — supports multiple regional languages for accessibility.' },
      { icon: Bell, label: 'Push Notifications', desc: 'Real-time alerts for weather changes, disease outbreaks, watering reminders, and community activity to keep farmers informed always.' },
      { icon: RefreshCw, label: 'Auto Sync & Updates', desc: 'Background data synchronization, over-the-air updates, and seamless version upgrades without disrupting the user experience.' },
    ],
    techs: ['React Native', 'Expo', 'Firebase', 'TensorFlow Lite', 'Redux', 'Maps API', 'Camera API', 'Push Notifications'],
  },
  {
    id: 'web',
    icon: Globe,
    title: 'Web Development',
    color: 'from-orange-500 to-red-500',
    shadow: 'shadow-orange-500/20',
    items: [
      { icon: Layout, label: 'Responsive Frontend', desc: 'Modern single-page applications built with React.js, featuring server-side rendering, progressive web app capabilities, and smooth animations with Framer Motion.' },
      { icon: Server, label: 'Backend Architecture', desc: 'Robust Python Flask backend with RESTful API design, middleware authentication, file upload handling, and integration with third-party services like Razorpay.' },
      { icon: Database, label: 'Database Management', desc: 'MySQL database design with complex queries, joins, aggregations, and optimized indexing for handling user data, predictions, payments, and content management.' },
      { icon: Code, label: 'Full-Stack Features', desc: 'End-to-end features including user auth with OTP, admin panels, community forums, real-time chatbot, payment gateways, and dynamic content management systems.' },
      { icon: Shield, label: 'Security & Auth', desc: 'JWT-based authentication, role-based access control, OTP verification, admin token validation, and secure payment processing with encrypted transactions.' },
      { icon: Cloud, label: 'Cloud Deployment', desc: 'Automated CI/CD pipelines, containerized deployments, CDN integration, and scalable cloud infrastructure for handling thousands of concurrent users.' },
    ],
    techs: ['React.js', 'Flask', 'MySQL', 'Tailwind CSS', 'Framer Motion', 'Razorpay', 'Cloud', 'CI/CD'],
  },
];

const fadeUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };

export default function Development() {
  const location = useLocation();

  const scrollToHash = useCallback((hash) => {
    if (!hash) return;
    const id = hash.replace('#', '');
    const tryScroll = (retries = 0) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (retries < 20) {
        setTimeout(() => tryScroll(retries + 1), 100);
      }
    };
    tryScroll();
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    scrollToHash(hash);

    const onHashChange = () => scrollToHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [location.hash, scrollToHash]);

  const handleHashClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950 dark:to-gray-900 pt-24 pb-16">
      <SEO title="Development" description="AI, Mobile, and Web development by Farmlyt AI" url="/development" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" {...fadeUp} transition={{ duration: 0.5 }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Our Development Expertise</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
            End-to-end development across AI, mobile, and web — powering the future of smart agriculture
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} onClick={(e) => handleHashClick(e, s.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer ${s.id === 'ai' ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' : s.id === 'mobile' ? 'border-blue-300 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' : 'border-orange-300 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300'}`}>
                <s.icon size={14} />
                {s.title}
              </a>
            ))}
          </div>
        </motion.div>

        {sections.map((section, si) => (
          <motion.section
            key={section.id}
            id={section.id}
            className="mb-20 last:mb-0"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: si * 0.1 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg ${section.shadow}`}>
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {section.title === 'AI Development' && 'Machine learning, computer vision, and NLP solutions'}
                  {section.title === 'Mobile App Development' && 'Cross-platform mobile applications for farmers'}
                  {section.title === 'Web Development' && 'Full-stack web applications with modern frameworks'}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {section.items.map((item, ii) => (
                <motion.div
                  key={ii}
                  className="group relative bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: ii * 0.08 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{item.label}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </motion.div>
              ))}
            </div>

            {section.techs && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-1">Tech Stack:</span>
                {section.techs.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700/50 text-[10px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.section>
        ))}
      </div>
    </main>
  );
}