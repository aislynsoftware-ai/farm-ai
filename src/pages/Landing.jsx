import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { APP_NAME, ROUTES } from '../constants';
import SEO, { ORGANIZATION_SCHEMA, BreadcrumbListSchema } from '../components/common/SEO';

const SITE_URL = 'https://farmlyt.ai';
const SITE_NAME = APP_NAME;
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;
const FAVICON = `${SITE_URL}/favicon.ico`;

const FOCUS_KEYWORDS = [
  'crop disease detection', 'plant identification AI', 'smart farming',
  'agriculture AI platform', 'leaf disease detection', 'AI farming India',
  'precision agriculture', 'crop health monitoring', 'farm management software',
  'AI crop diagnosis', 'smart agriculture India', 'plant disease identifier',
];

const PAGE_TITLE = `${SITE_NAME} - AI-Powered Smart Agriculture | Crop Disease Detection & Plant Identification`;
const PAGE_DESC = 'AI-powered smart agriculture platform for crop disease detection, plant identification, and precision farming. Detect diseases in tomato, potato, brinjal, chili, fruits, and flowers with 98.5% accuracy. Get treatment recommendations instantly.';

const KEYWORD_CLUSTERS = [
  { group: 'Disease Detection', keywords: ['crop disease detection', 'leaf disease detection', 'plant disease identifier', 'tomato disease detection', 'potato blight detection'] },
  { group: 'Plant Identification', keywords: ['plant identification AI', 'identify plant species', 'crop recognition', 'plant leaf identification', 'agriculture image recognition'] },
  { group: 'Smart Farming', keywords: ['smart farming platform', 'precision agriculture', 'AI farming India', 'crop health monitoring', 'smart agriculture India'] },
];

const stats = [
  { value: '50K+', label: 'Farmers Served' },
  { value: '98.5%', label: 'Detection Accuracy' },
  { value: '200+', label: 'Diseases Covered' },
  { value: '24/7', label: 'AI Availability' },
];

const features = [
  { title: 'Crop Disease Detection', desc: 'Upload a leaf photo and AI identifies diseases like early blight, late blight, leaf curl, bacterial spot, and more with 98.5% accuracy.', icon: '🔬', keyword: 'crop disease detection' },
  { title: 'Plant Species Identification', desc: 'Identify any plant, flower, or tree species from a photo using our deep learning image recognition model.', icon: '🌿', keyword: 'plant identification AI' },
  { title: 'Fruit & Vegetable Analysis', desc: 'Analyze quality, ripeness, and diseases in fruits (guava, pomegranate, lemon) and vegetables (tomato, cauliflower, cucumber).', icon: '🍎', keyword: 'fruit disease detection' },
  { title: 'Precision Treatment Plans', desc: 'Get targeted organic and chemical treatment recommendations based on the detected disease severity and crop type.', icon: '🎯', keyword: 'precision agriculture' },
  { title: 'Smart Farm Analytics', desc: 'Track disease history, generate reports, and monitor crop health trends over time with your personal dashboard.', icon: '📊', keyword: 'crop health monitoring' },
  { title: 'Multi-Crop Support', desc: 'Covers major Indian crops — tomato, potato, brinjal, chili, ladyfinger, guava, pomegranate, lemon, custard apple, and more.', icon: '🌾', keyword: 'AI farming India' },
];

const howItWorks = [
  { step: '01', title: 'Capture or Upload', desc: 'Take a photo of the affected crop part using your phone or upload from gallery.' },
  { step: '02', title: 'AI Analyzes in Seconds', desc: 'Our YOLO-based deep learning model scans the image against 200+ trained disease classes.' },
  { step: '03', title: 'Get Diagnosis & Score', desc: 'Receive disease name, confidence percentage, and severity assessment instantly.' },
  { step: '04', title: 'Apply & Track Progress', desc: 'Follow AI-recommended treatments and monitor recovery via your dashboard.' },
];

const services = [
  { title: 'Leaf Disease Detection', crops: ['Tomato', 'Potato', 'Brinjal', 'Chili', 'Lady Finger', 'Cotton', 'Rice', 'Wheat'], icon: '🍃' },
  { title: 'Fruit Disease Analysis', crops: ['Guava', 'Pomegranate', 'Lemon', 'Tomato', 'Custard Apple', 'Apple', 'Mango'], icon: '🍑' },
  { title: 'Vegetable & Flower Health', crops: ['Cauliflower', 'Cucumber', 'Bitter Gourd', 'Rose', 'Jasmine', 'Marigold', 'Sunflower'], icon: '🌸' },
  { title: 'Potted Plant Identification', crops: ['Snake Plant', 'Peace Lily', 'Spider Plant', 'Aloe Vera', 'Rubber Plant', 'Fiddle Leaf', 'Monstera'], icon: '🪴' },
  { title: 'Potted Plant Disease', crops: ['Leaf Spot', 'Powdery Mildew', 'Root Rot', 'Rust', 'Blight', 'Mosaic Virus', 'Wilt'], icon: '🍂' },
  { title: 'Plant Identification', crops: ['Garden Plants', 'Wild Plants', 'Flowers', 'Shrubs', 'Herbs', 'Trees', 'Weeds'], icon: '🌿' },
  { title: 'Food Identification', crops: ['Fruits', 'Vegetables', 'Grains', 'Nuts', 'Spices', 'Legumes', 'Mushrooms'], icon: '🍎' },
  { title: 'Vegetable & Spinach ID', crops: ['Spinach', 'Kale', 'Lettuce', 'Cabbage', 'Broccoli', 'Fenugreek', 'Amaranth'], icon: '🥬' },
  { title: 'Soil Testing', crops: ['pH Level', 'Nitrogen', 'Phosphorus', 'Potassium', 'Organic Carbon', 'Micronutrients', 'Soil Texture'], icon: '🧪' },
];

const testimonials = [
  { name: 'Rajesh Kumar', role: 'Tomato Farmer, Tamil Nadu', text: 'Detected early blight in my tomato crop at an early stage using Farmlyt AI. Saved 80% of my yield.', rating: 5 },
  { name: 'Priya Sharma', role: 'Agri Entrepreneur, Punjab', text: 'Managing 50 acres of wheat and potato. The plant ID feature helps me monitor field health daily with just my phone.', rating: 5 },
  { name: 'Venkatesh Reddy', role: 'Farm Owner, Andhra Pradesh', text: 'Fertilizer costs reduced by 35% thanks to precision recommendations. The ROI in the first season itself was outstanding.', rating: 5 },
  { name: 'Suresh Patel', role: 'Cotton Farmer, Gujarat', text: 'Earlier I would guess and spray pesticides. Now AI tells me exactly what disease and what treatment. No more guesswork.', rating: 5 },
];

const faqData = [
  { q: 'How does AI crop disease detection work?', a: 'Upload a photo of the affected plant part. Our YOLO-based deep learning model compares it against 200+ trained disease classes and returns the most likely diagnosis with a confidence score.' },
  { q: 'Is Farmlyt AI free to use?', a: 'Yes! Basic disease detection and plant identification are completely free. No signup required for one-time diagnoses.' },
  { q: 'Which crops are supported?', a: 'We support 25+ crop species including tomato, potato, brinjal, chili, ladyfinger, guava, pomegranate, lemon, custard apple, cauliflower, cucumber, cotton, rice, wheat, and more.' },
  { q: 'How accurate is the disease detection?', a: 'Our models achieve 98.5% accuracy on the test dataset, validated against 200,000+ labeled agricultural images.' },
  { q: 'Can I track crop health over time?', a: 'Yes! Create a free account to access your personal dashboard where you can track disease history, generate reports, and monitor crop recovery.' },
  { q: 'Does it work offline?', a: 'Currently our AI models run on cloud servers, so an internet connection is required. We are working on a lightweight offline version.' },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

export default function Landing() {
  const [testiIndex, setTestiIndex] = useState(0);

  return (
    <main>
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESC} />
        <meta name="keywords" content={FOCUS_KEYWORDS.join(', ')} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={SITE_URL} />
        <link rel="icon" type="image/x-icon" href={FAVICON} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#059669" />
        <meta name="author" content={SITE_NAME} />
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="classification" content="Agriculture, Technology, AI" />

        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESC} />
        <meta property="og:image" content={DEFAULT_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:country-name" content="India" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESC} />
        <meta name="twitter:image" content={DEFAULT_IMAGE} />
        <meta name="twitter:site" content="@farmlytai" />
        <meta name="twitter:creator" content="@farmlytai" />

        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Organization',
          name: SITE_NAME, url: SITE_URL, logo: DEFAULT_IMAGE,
          description: PAGE_DESC, foundingDate: '2024',
          contactPoint: { '@type': 'ContactPoint', telephone: '+91-8892209021', contactType: 'customer service', email: 'support@farmlyt.ai' },
          sameAs: ['https://twitter.com/farmlytai'], areaServed: { '@type': 'Country', name: 'India' },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'WebPage',
          name: PAGE_TITLE, description: PAGE_DESC, url: SITE_URL,
          inLanguage: 'en', keywords: FOCUS_KEYWORDS.join(', '),
          breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }] },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: faqData.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Product',
          name: 'Farmlyt AI - Crop Disease Detection',
          description: 'AI-powered crop disease detection and plant identification platform',
          image: DEFAULT_IMAGE, brand: { '@type': 'Brand', name: SITE_NAME },
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', availability: 'https://schema.org/InStock', priceValidUntil: '2027-12-31' },
          aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '1200', bestRating: '5' },
        })}</script>
      </Helmet>

      <h1 className="sr-only">{PAGE_TITLE}</h1>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(5,150,105,0.1),transparent_50%)]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-6" translate="no">
                🌱 AI-Powered Smart Agriculture
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Detect Crop Diseases.{' '}
                <span className="bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">Grow Smarter.</span>
              </h2>
              <p className="mt-6 text-base md:text-lg text-gray-300 leading-relaxed max-w-xl">
                Upload a photo of your crop and let AI detect diseases, identify plants, and recommend treatments — in seconds, with 98.5% accuracy.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to={`${ROUTES.PREDICT}?type=plant`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-emerald-500/25">
                  Detect Disease Now →
                </Link>
                <Link to={ROUTES.BLOGS} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20 backdrop-blur">
                  Read Farming Guides
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-5 mt-8 text-xs text-gray-400">
                <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> No signup needed</span>
                <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Free disease detection</span>
                <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> 98.5% accuracy</span>
                <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> 25+ crops supported</span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-3xl blur-xl" />
                <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur rounded-3xl border border-gray-700/50 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-400 ml-2">AI Crop Analysis Interface</span>
                  </div>
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-emerald-900/50 to-gray-800/50 border border-gray-700/50 overflow-hidden">
                    <img src="/land.jpg" alt="AI Crop Analysis" className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-emerald-400">🔬</span>
                      <span className="text-xs font-medium text-emerald-300">Detection Result (Sample)</span>
                    </div>
                    <p className="text-sm text-emerald-200">Disease: <strong>Early Blight</strong> (Alternaria solani)</p>
                    <p className="text-xs text-emerald-300/70">Confidence: 97.3% | Severity: Moderate | Treatment: Organic fungicide recommended</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Keywords Bar */}
      <section className="py-10 bg-emerald-50/50 dark:bg-emerald-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-4">— SEO Keyword Clusters —</p>
          <div className="flex flex-wrap justify-center gap-4">
            {KEYWORD_CLUSTERS.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">{c.group}</p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {c.keywords.map((kw, j) => <span key={j} className="text-[10px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">{kw}</span>)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.35, delay: i * 0.08 }}
                className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">{s.value}</div>
                <p className="text-emerald-700 dark:text-emerald-300 text-xs">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 lg:py-16 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">Features</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">AI-Powered Farming Features</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">From disease detection to precision treatment — everything you need to protect your crops and maximize yield.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.35, delay: i * 0.06 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5"
              >
                <span className="text-3xl block mb-2.5" role="img" aria-hidden="true">{f.icon}</span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{f.desc}</p>
                <span className="mt-2.5 inline-block text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">{f.keyword}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 lg:py-16 bg-emerald-50/30 dark:bg-emerald-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">How It Works</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">From Photo to Solution in 4 Steps</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">No technical skills needed. Just upload a photo and get AI-powered crop disease diagnosis instantly.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((h, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative text-center"
              >
                {i < 3 && <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-emerald-200 to-emerald-100 dark:from-emerald-800 dark:to-emerald-700" />}
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20 relative z-10">
                  <span className="text-white font-bold text-lg">{h.step}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{h.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-10 lg:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">Services</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Crops We Cover</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">Comprehensive disease detection and analysis for vegetables, fruits, flowers, and field crops.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.35, delay: i * 0.08 }}
                className="bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl p-6 border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <span className="text-3xl block mb-3" role="img" aria-hidden="true">{s.icon}</span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">{s.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {s.crops.map((crop, j) => <span key={j} className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 text-[10px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors">{crop}</span>)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 lg:py-16 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">Testimonials</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Trusted by Farmers Across India</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">Join 50,000+ farmers who trust AI for crop health monitoring.</p>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="overflow-hidden">
              <motion.div key={testiIndex} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-emerald-200 dark:border-emerald-700 text-center hover:border-emerald-400 dark:hover:border-emerald-400 transition-all"
              >
                <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                  {testimonials[testiIndex].name.split(' ').map(n => n[0]).join('')}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed mb-4">"{testimonials[testiIndex].text}"</p>
                <div className="flex justify-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, s) => <span key={s} className={`text-sm ${s < testimonials[testiIndex].rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}>★</span>)}
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{testimonials[testiIndex].name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{testimonials[testiIndex].role}</p>
              </motion.div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTestiIndex(i)} aria-label={`Testimonial ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === testiIndex ? 'bg-emerald-500 w-6' : 'bg-gray-300 dark:bg-gray-600'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 lg:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqData.map((f, i) => (
              <details key={i} className="group bg-emerald-50/30 dark:bg-emerald-950/20 rounded-xl border-2 border-gray-200 dark:border-gray-600 overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-300">
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none text-sm font-medium text-gray-900 dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors">
                  {f.q}
                  <span className="text-emerald-500 group-open:rotate-180 transition-transform text-xs">▼</span>
                </summary>
                <div className="px-4 pb-4 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-emerald-600 via-green-700 to-emerald-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">Ready to Protect Your Crops with AI?</h2>
            <p className="text-sm text-emerald-100 mt-4 max-w-xl mx-auto">Join 50,000+ farmers using AI-powered crop disease detection to save yields and increase profits.</p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link to={`${ROUTES.PREDICT}?type=plant`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-700 font-semibold text-sm hover:bg-emerald-50 transition-all shadow-lg">
                Detect Disease Now →
              </Link>
              <Link to={ROUTES.CONTACT} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-white font-semibold text-sm hover:bg-emerald-500/30 transition-all backdrop-blur">
                Talk to Our Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
