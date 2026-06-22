import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ChevronDown, ChevronRight, Leaf, Apple, Flower2, Grid3X3, Bug, Search, Sprout } from 'lucide-react';
import SEO from '../components/common/SEO';
import PageHeader from '../components/layout/PageHeader';

const DOCS = [
  {
    category: 'Leaf Disease Detection',
    icon: Leaf,
    color: 'from-emerald-500 to-green-600',
    endpoints: [
      {
        path: '/leafs/tomato',
        method: 'POST',
        description: 'Detect diseases in tomato leaves',
        params: [
          { name: 'image', type: 'file', required: true, desc: 'JPEG/PNG image of tomato leaf' },
          { name: 'user_id', type: 'string', required: true, desc: 'User identifier for coin deduction' },
        ],
        request: `curl -X POST https://api.farmlytai.in/leafs/tomato \\
  -F "image=@tomato_leaf.jpg" \\
  -F "user_id=USR123456"`,
        response: `{
  "prediction": "Early Blight",
  "confidence": 96.5,
  "original_image": "https://...",
  "predicted_image": "https://..."
}`,
        classes: ['Early Blight', 'Late Blight', 'Septoria Leaf Spot', 'Bacterial Spot', 'Healthy'],
      },
      {
        path: '/leafs/potato',
        method: 'POST',
        description: 'Detect diseases in potato leaves',
        params: [
          { name: 'image', type: 'file', required: true, desc: 'JPEG/PNG image of potato leaf' },
          { name: 'user_id', type: 'string', required: true, desc: 'User identifier for coin deduction' },
        ],
        request: `curl -X POST https://api.farmlytai.in/leafs/potato \\
  -F "image=@potato_leaf.jpg" \\
  -F "user_id=USR123456"`,
        response: `{
  "prediction": "Early Blight",
  "confidence": 94.2,
  "original_image": "https://...",
  "predicted_image": "https://..."
}`,
        classes: ['Early Blight', 'Late Blight', 'Healthy', 'Plant Pests', 'Cyst Nematode'],
      },
      {
        path: '/leafs/brinjal',
        method: 'POST',
        description: 'Detect diseases in brinjal leaves',
        params: [
          { name: 'image', type: 'file', required: true, desc: 'JPEG/PNG image of brinjal leaf' },
          { name: 'user_id', type: 'string', required: true, desc: 'User identifier for coin deduction' },
        ],
        request: `curl -X POST https://api.farmlytai.in/leafs/brinjal \\
  -F "image=@brinjal_leaf.jpg" \\
  -F "user_id=USR123456"`,
        response: `{
  "prediction": "Leaf Spot Disease",
  "confidence": 97.1,
  "original_image": "https://...",
  "predicted_image": "https://..."
}`,
        classes: ['Healthy Leaf', 'Insect Pest Disease', 'Leaf Spot Disease', 'Mosaic Virus Disease', 'Wilt Disease'],
      },
    ],
  },
  {
    category: 'Fruit Disease Detection',
    icon: Apple,
    color: 'from-orange-500 to-red-500',
    endpoints: [
      {
        path: '/fruits/tomato',
        method: 'POST',
        description: 'Detect diseases in tomato fruits',
        params: [
          { name: 'image', type: 'file', required: true, desc: 'JPEG/PNG image of tomato fruit' },
          { name: 'user_id', type: 'string', required: true, desc: 'User identifier' },
        ],
        request: `curl -X POST https://api.farmlytai.in/fruits/tomato \\
  -F "image=@tomato.jpg" \\
  -F "user_id=USR123456"`,
        response: `{
  "prediction": "Healthy",
  "confidence": 98.0,
  "original_image": "https://...",
  "predicted_image": "https://..."
}`,
        classes: ['Healthy', 'Unhealthy'],
      },
      {
        path: '/fruits/pomegranate',
        method: 'POST',
        description: 'Detect diseases in pomegranate fruits',
        params: [
          { name: 'image', type: 'file', required: true, desc: 'JPEG/PNG image of pomegranate' },
          { name: 'user_id', type: 'string', required: true, desc: 'User identifier' },
        ],
        request: `curl -X POST https://api.farmlytai.in/fruits/pomegranate \\
  -F "image=@pomegranate.jpg" \\
  -F "user_id=USR123456"`,
        response: `{
  "prediction": "Anthracnose",
  "confidence": 95.8,
  "original_image": "https://...",
  "predicted_image": "https://..."
}`,
        classes: ['Alternaria', 'Anthracnose', 'Bacterial Blight', 'Cercospora', 'Healthy'],
      },
    ],
  },
  {
    category: 'Flower Disease Detection',
    icon: Flower2,
    color: 'from-pink-500 to-rose-500',
    endpoints: [
      {
        path: '/flowers/rose',
        method: 'POST',
        description: 'Detect diseases in rose flowers',
        params: [
          { name: 'image', type: 'file', required: true, desc: 'JPEG/PNG image of rose' },
          { name: 'user_id', type: 'string', required: true, desc: 'User identifier' },
        ],
        request: `curl -X POST https://api.farmlytai.in/flowers/rose \\
  -F "image=@rose.jpg" \\
  -F "user_id=USR123456"`,
        response: `{
  "prediction": "Botrytis Blight",
  "confidence": 93.4,
  "original_image": "https://...",
  "predicted_image": "https://..."
}`,
        classes: ['Botrytis Blight', 'Bud Rot', 'Healthy', 'Petal Blight', 'Thrips'],
      },
    ],
  },
  {
    category: 'Plant Identification',
    icon: Sprout,
    color: 'from-emerald-500 to-teal-500',
    endpoints: [
      {
        path: '/plant_idetification',
        method: 'POST',
        description: 'Identify plant species from an image',
        params: [
          { name: 'image', type: 'file', required: true, desc: 'JPEG/PNG image of the plant' },
          { name: 'user_id', type: 'string', required: true, desc: 'User identifier' },
        ],
        request: `curl -X POST https://api.farmlytai.in/plant_idetification \\
  -F "image=@plant.jpg" \\
  -F "user_id=USR123456"`,
        response: `{
  "prediction": "Aloe Vera",
  "confidence": 97.2,
  "original_image": "https://...",
  "predicted_image": "https://..."
}`,
        classes: ['Aloe Vera', 'Apple', 'Ashoka', 'Banana', 'Coconut', 'Mango', 'Neem', 'Rose', 'Tulasi', '50+ species'],
      },
    ],
  },
  {
    category: 'Food Grain Identification',
    icon: Grid3X3,
    color: 'from-purple-500 to-violet-500',
    endpoints: [
      {
        path: '/food_identification',
        method: 'POST',
        description: 'Identify food grains from an image',
        params: [
          { name: 'image', type: 'file', required: true, desc: 'JPEG/PNG image of food grains' },
        ],
        request: `curl -X POST https://api.farmlytai.in/food_identification \\
  -F "image=@grains.jpg"`,
        response: `{
  "prediction": "Basmati Rice",
  "confidence": 96.0,
  "original_image": "https://...",
  "predicted_image": "https://..."
}`,
        classes: ['Rice', 'Wheat', 'Bajra', 'Jowar', 'Moong Dal', 'Chana Dal', '60+ food items'],
      },
    ],
  },
  {
    category: 'Vegetable & Spinach Identification',
    icon: Bug,
    color: 'from-blue-500 to-cyan-500',
    endpoints: [
      {
        path: '/vegetable-spinach-identification',
        method: 'POST',
        description: 'Identify vegetables and spinach varieties',
        params: [
          { name: 'image', type: 'file', required: true, desc: 'JPEG/PNG image of vegetable' },
        ],
        request: `curl -X POST https://api.farmlytai.in/vegetable-spinach-identification \\
  -F "image=@vegetable.jpg"`,
        response: `{
  "prediction": "Spinach",
  "confidence": 98.5,
  "original_image": "https://...",
  "predicted_image": "https://..."
}`,
        classes: ['Spinach', 'Beetroot', 'Cabbage', 'Carrot', 'Cauliflower', 'Tomato', '26+ vegetables'],
      },
    ],
  },
];

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer"
    >
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function EndpointDoc({ ep, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">POST</span>
          <code className="text-xs font-mono text-gray-800 dark:text-gray-200 truncate">{ep.path}</code>
        </div>
        {open ? <ChevronDown size={14} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 pt-3">{ep.description}</p>
          <div>
            <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Parameters</p>
            <div className="space-y-1">
              {ep.params.map((p) => (
                <div key={p.name} className="flex items-start gap-3 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5">
                  <code className="font-mono text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{p.name}</code>
                  <span className="text-gray-400">({p.type})</span>
                  {p.required && <span className="text-red-400 text-[10px]">required</span>}
                  <span>{p.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Detectable Classes</p>
            <div className="flex flex-wrap gap-1">
              {ep.classes.map((c) => (
                <span key={c} className="px-2 py-0.5 text-[10px] rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{c}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Example Request</p>
              <CopyBtn text={ep.request} />
            </div>
            <pre className="text-xs text-gray-200 bg-gray-900 dark:bg-black rounded-xl p-3 overflow-x-auto"><code>{ep.request}</code></pre>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Example Response</p>
              <CopyBtn text={ep.response} />
            </div>
            <pre className="text-xs text-gray-200 bg-gray-900 dark:bg-black rounded-xl p-3 overflow-x-auto"><code>{ep.response}</code></pre>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function ApiDocs() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <main>
      <SEO
        title="API Documentation"
        description="Complete API documentation for Farmlyt AI. All endpoints, parameters, examples, and response formats."
        url="/api-docs"
      />
      <PageHeader
        title="API Documentation"
        description="Everything you need to integrate Farmlyt AI APIs into your application."
      />
      <section className="py-12 bg-gradient-to-b from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-950/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 flex-wrap">
            {DOCS.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.category}
                  onClick={() => setActiveCategory(i)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeCategory === i
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700'
                  }`}
                >
                  <Icon size={14} />
                  {cat.category}
                </button>
              );
            })}
          </div>

          {/* Active Category Endpoints */}
          <div className="space-y-3">
            {DOCS[activeCategory].endpoints.map((ep, i) => (
              <EndpointDoc key={ep.path} ep={ep} index={i} />
            ))}
          </div>

          {/* Common Response Format */}
          <div className="mt-12 p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Common Response Format</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              All API endpoints return a consistent JSON response structure:
            </p>
            <pre className="text-xs text-gray-200 bg-gray-900 dark:bg-black rounded-xl p-4 overflow-x-auto"><code>{JSON.stringify({
  prediction: 'string — detected disease or identified item name',
  confidence: 'number — confidence percentage (0-100)',
  original_image: 'string — URL of the uploaded original image',
  predicted_image: 'string — URL of the prediction visualization',
}, null, 2)}</code></pre>
          </div>
        </div>
      </section>
    </main>
  );
}
