import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sprout, ChevronRight, Search } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import ServiceCard from '../components/ui/ServiceCard';
import servicesData from '../data/services';
import SectionTitle from '../components/common/SectionTitle';
import api from '../services/api';

export default function Services() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [agriRes, cropsRes, subRes] = await Promise.allSettled([
        api.farming.agriTitles(),
        api.farming.allCrops(),
        api.farming.crops(),
      ]);

      const agri = agriRes.status === 'fulfilled' && Array.isArray(agriRes.value) ? agriRes.value : [];
      const crops = cropsRes.status === 'fulfilled' && Array.isArray(cropsRes.value) ? cropsRes.value : [];
      const subs = subRes.status === 'fulfilled' && Array.isArray(subRes.value) ? subRes.value : [];

      const nested = agri.map((a) => ({
        ...a,
        crops: crops
          .filter((c) => Number(c.agri_id) === Number(a.id))
          .map((c) => ({
            ...c,
            subs: subs.filter((s) => Number(s.crop_id) === Number(c.id)),
          })),
      }));

      setResources(nested);
    }
    fetchData();
  }, []);

  return (
    <main>
      <PageHeader
        title="Our Services"
        description="Comprehensive AI-powered solutions designed to address every aspect of modern agriculture and farming."
      />

      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {servicesData.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {resources.length > 0 && (
        <section className="py-10 lg:py-16 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              subtitle="Resources"
              title="Agricultural Resources"
              description="Browse our collection of agricultural knowledge and guides."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {resources.map((agri) => (
                <div
                  key={agri.id}
                  className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-300"
                >
                  <Link to={`/agriculture/${agri.id}`}>
                    {agri.image_url && (
                      <img src={agri.image_url} alt={agri.title} className="w-full h-40 object-cover" />
                    )}
                    <div className="p-4 pb-2">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">{agri.title}</h3>
                    </div>
                  </Link>
                  <div className="px-4 pb-4 space-y-1">
                    {agri.crops.map((crop) => (
                      <div key={crop.id}>
                        {crop.subs.length > 0 ? (
                          crop.subs.map((sub) => (
                            <Link
                              key={sub.id}
                              to={`/crop/${sub.id}`}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors group"
                            >
                              {sub.image_url ? (
                                <img src={sub.image_url} alt={sub.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                              ) : (
                                <Sprout size={18} className="text-emerald-500 flex-shrink-0" />
                              )}
                              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex-1 font-medium">{sub.title}</span>
                              <ChevronRight size={14} className="text-gray-300 group-hover:text-emerald-400" />
                            </Link>
                          ))
                        ) : (
                          <Link
                            to="/predict"
                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors"
                          >
                            <Search size={12} /> Upload & Detect
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Why Our Services"
            title="Built for Modern Agriculture"
            description="Each service is crafted with cutting-edge AI technology to deliver accurate, fast, and actionable results."
          />

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: '95% Accuracy', desc: 'Industry-leading AI model accuracy for reliable results you can trust.' },
              { title: 'Under 2 Seconds', desc: 'Lightning-fast inference delivers results in milliseconds, not minutes.' },
              { title: '24/7 Availability', desc: 'Our cloud platform ensures your tools are always available when you need them.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center p-5 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
              >
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">{item.title}</div>
                <p className="text-gray-600 dark:text-gray-300 text-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
