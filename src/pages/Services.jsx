import SEO from '../components/common/SEO';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sprout, ChevronRight, Search, ArrowRight, Cpu } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import ServiceCard from '../components/ui/ServiceCard';
import servicesData from '../data/services';
import SectionTitle from '../components/common/SectionTitle';
import api from '../services/api';
import Skeleton from '../components/common/Skeleton';

export default function Services() {
  const [loading, setLoading] = useState(true);
  const [aiServices, setAiServices] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      api.farming.aiServices(),
      api.farming.agriTitles(),
    ]).then(([aiRes, agriRes]) => {
      setAiServices(aiRes.status === 'fulfilled' ? aiRes.value : []);
      setResources(agriRes.status === 'fulfilled' ? agriRes.value : []);
      setLoading(false);
    });
  }, []);

  const getAgriLink = (serviceId) => {
    const match = resources.find((r) => Number(r.ai_service_id) === Number(serviceId));
    return match ? `/agriculture/${match.id}` : '/services';
  };

  return (
    <main>
      <SEO title="Services" description="Explore Farmlyt AI services including crop disease detection, plant identification, food analysis, and smart agriculture solutions." url="/services" />
      <PageHeader
        title="Our Services"
        description="Comprehensive AI-powered solutions designed to address every aspect of modern agriculture and farming."
      />

      {/* AI Services Section */}
      {loading ? (
        <section className="py-12 lg:py-16 bg-emerald-50/30 dark:bg-emerald-950/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Skeleton className="w-24 h-4 mx-auto mb-2" />
              <Skeleton variant="title" className="mx-auto w-1/2" />
              <Skeleton className="w-2/3 mx-auto mt-2" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 overflow-hidden">
                  <Skeleton variant="image" className="h-44 rounded-none" />
                  <div className="p-4">
                    <Skeleton className="w-1/2 h-4" />
                    <Skeleton className="w-full h-3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : aiServices.length > 0 && (
        <section className="py-12 lg:py-16 bg-emerald-50/30 dark:bg-emerald-950/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle subtitle="AI Services" title="AI Powered Solutions" description="Leverage cutting-edge AI for every aspect of farming." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {aiServices.map((svc, i) => (
                <motion.div
                  key={svc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <Link
                    to={getAgriLink(svc.id)}
                    className="group block rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-400 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative overflow-hidden">
                      {svc.image_url ? (
                        <img src={svc.image_url} alt={svc.name} className="w-full h-44 object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-44 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-950/30">
                          <Cpu size={48} className="text-emerald-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">{svc.name}</h3>
                      {svc.description && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{svc.description}</p>}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Resources Section */}
      {loading ? (
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Skeleton className="w-24 h-4 mx-auto mb-2" />
              <Skeleton variant="title" className="mx-auto w-1/2" />
              <Skeleton className="w-2/3 mx-auto mt-2" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 overflow-hidden">
                  <Skeleton variant="image" className="h-44 rounded-none" />
                  <div className="p-3">
                    <Skeleton className="w-1/2 h-4 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : resources.length > 0 && (
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle subtitle="Resources" title="Agricultural Resources" description="Browse our collection of agricultural knowledge and guides." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {resources.map((agri, index) => (
                <motion.div
                  key={agri.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                >
                  <Link
                    to={`/agriculture/${agri.id}`}
                    className="group block rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-400 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative overflow-hidden">
                      {agri.image_url ? (
                        <img src={agri.image_url} alt={agri.title} className="w-full h-44 object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-44 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-950/30">
                          <Sprout size={48} className="text-emerald-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="relative flex items-center justify-center">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white text-center">{agri.title}</h3>
                        <ArrowRight size={16} className="absolute right-0 text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Cards */}
      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {servicesData.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="Why Our Services" title="Built for Modern Agriculture" description="Each service is crafted with cutting-edge AI technology to deliver accurate, fast, and actionable results." />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: '95% Accuracy', desc: 'Industry-leading AI model accuracy for reliable results you can trust.' },
              { title: 'Under 5 Seconds', desc: 'Lightning-fast inference delivers results in milliseconds, not minutes.' },
              { title: '24/7 Availability', desc: 'Our cloud platform ensures your tools are always available when you need them.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center p-5 bg-white dark:bg-gray-800 rounded-2xl border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
              >
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">{item.title}</div>
                <p className="text-emerald-700 dark:text-emerald-300 text-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
