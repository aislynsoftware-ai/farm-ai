import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import ServiceCard from '../components/ui/ServiceCard';
import SectionTitle from '../components/common/SectionTitle';
import servicesData from '../data/services';
import SEO from '../components/common/SEO';
import Skeleton from '../components/common/Skeleton';
import api from '../services/api';



export default function Services() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [agriTitles, setAgriTitles] = useState([]);
  const [crops, setCrops] = useState([]);
  const [subCrops, setSubCrops] = useState([]);

  useEffect(() => {
    Promise.all([
      api.farming.agriTitles().then(setAgriTitles).catch(() => {}),
      api.farming.allCrops().then(setCrops).catch(() => {}),
      api.farming.crops().then(setSubCrops).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const authLink = (path) => {
    try { return !!localStorage.getItem('token') ? path : '/login'; } catch { return path; }
  };

  return (
    <main>
      <SEO title="Services" description="Explore Farmlyt AI services including crop disease detection, plant identification, food analysis, and smart agriculture solutions." url="/services" />
      <PageHeader title="Our Services" description="Comprehensive AI-powered solutions designed to address every aspect of modern agriculture and farming." />

      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-10">{[1,2].map(i => <div key={i}><Skeleton className="w-48 h-6 mb-4" /><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{[1,2,3,4].map(j => <Skeleton key={j} className="h-40 rounded-2xl" />)}</div></div>)}</div>
          ) : (
            agriTitles.map((agri, ai) => {
              const crs = crops.filter((c) => Number(c.agri_id) === Number(agri.id));
              return (
                <motion.div key={agri.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ai * 0.06 }} className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 rounded-full bg-emerald-500" />
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">{agri.title}</h2>
                  </div>
                  {crs.length === 0 ? (
                    <p className="text-xs text-gray-400 ml-3">No crops available</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {crs.map((crop, ci) => {
                        const subs = subCrops.filter((s) => Number(s.crop_id) === Number(crop.id));
                        return (
                          <div key={crop.id}>
                            <motion.button
                              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.04 }}
                              onClick={() => {
                                navigate(authLink(`/agriculture/${agri.id}/crop/${crop.id}`));
                              }}
                              className="group w-full rounded-2xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 overflow-hidden hover:shadow-lg hover:border-emerald-400 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                            >
                              <div className="relative overflow-hidden">
                                {crop.image_url ? (
                                  <img src={crop.image_url} alt={crop.title} className="w-full h-52 object-cover bg-emerald-50/30 dark:bg-emerald-950 transition-transform duration-500 group-hover:scale-105" />
                                ) : (
                                  <div className="w-full h-52 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-950/30">
                                    <Sprout size={40} className="text-emerald-400" />
                                  </div>
                                )}
                              </div>
                              <div className="px-3 py-3 text-center">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{crop.title}</h3>
                                {subs.length > 0 && <p className="text-[11px] text-gray-400 mt-1">{subs.length} sub type{subs.length > 1 ? 's' : ''}</p>}
                                {subs.length === 0 && <p className="text-[11px] text-emerald-500 mt-1 font-medium">Detect Now →</p>}
                              </div>
                            </motion.button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {servicesData.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle subtitle="Why Our Services" title="Built for Modern Agriculture" description="Each service is crafted with cutting-edge AI technology to deliver accurate, fast, and actionable results." />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: '95% Accuracy', desc: 'Industry-leading AI model accuracy for reliable results you can trust.' },
              { title: 'Under 5 Seconds', desc: 'Lightning-fast inference delivers results in milliseconds, not minutes.' },
              { title: '24/7 Availability', desc: 'Our cloud platform ensures your tools are always available when you need them.' },
            ].map((item, index) => (
              <motion.div key={index} className="text-center p-5 bg-white dark:bg-gray-800 rounded-2xl border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.35, delay: index * 0.08 }}
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
