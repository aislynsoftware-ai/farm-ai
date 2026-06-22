import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Copy, Check, Code, BookOpen, Key, Globe,
  Terminal, ChevronDown, ChevronRight,
} from 'lucide-react';
import SEO from '../components/common/SEO';
import PageHeader from '../components/layout/PageHeader';

const LANGUAGES = ['cURL', 'Python', 'JavaScript', 'PHP'];

const CODE_SAMPLES = {
  cURL: `curl -X POST https://api.farmlytai.in/leafs/tomato \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "image=@tomato_leaf.jpg"`,
  Python: `import requests

url = "https://api.farmlytai.in/leafs/tomato"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
files = {"image": open("tomato_leaf.jpg", "rb")}

response = requests.post(url, headers=headers, files=files)
print(response.json())`,
  JavaScript: `const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('https://api.farmlytai.in/leafs/tomato', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));`,
  PHP: `$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.farmlytai.in/leafs/tomato");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "Authorization: Bearer YOUR_API_KEY"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
  "image" => new CURLFile("tomato_leaf.jpg")
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
};

const SECTIONS = [
  {
    title: 'Overview',
    icon: BookOpen,
    content:
      'Farmlyt AI provides powerful REST APIs for agricultural AI — crop disease detection, plant identification, food grain analysis, and more. Our APIs are designed to be simple, fast, and reliable.',
  },
  {
    title: 'Authentication',
    icon: Key,
    content:
      'All API requests require authentication via an API key passed in the Authorization header. You can generate and manage your API keys from the Developer Dashboard.',
  },
  {
    title: 'Base URL',
    icon: Globe,
    content: 'https://api.farmlytai.in',
  },
  {
    title: 'Rate Limits',
    icon: Terminal,
    content:
      'Rate limits vary by plan. Free: 50 req/mo. Basic: 150 req/mo. Standard: 500 req/mo. Pro: 1000 req/mo. Enterprise: Unlimited.',
  },
];

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/leafs/tomato',
    desc: 'Detect diseases in tomato leaves',
  },
  {
    method: 'POST',
    path: '/leafs/potato',
    desc: 'Detect diseases in potato leaves',
  },
  {
    method: 'POST',
    path: '/leafs/brinjal',
    desc: 'Detect diseases in brinjal leaves',
  },
  {
    method: 'POST',
    path: '/leafs/chili',
    desc: 'Detect diseases in chili leaves',
  },
  {
    method: 'POST',
    path: '/flowers/rose',
    desc: 'Detect diseases in rose flowers',
  },
  {
    method: 'POST',
    path: '/plant_idetification',
    desc: 'Identify plant species from image',
  },
  {
    method: 'POST',
    path: '/food_identification',
    desc: 'Identify food grains from image',
  },
  {
    method: 'POST',
    path: '/vegetable-spinach-identification',
    desc: 'Identify vegetables and spinach',
  },
  {
    method: 'POST',
    path: '/potted_plant',
    desc: 'Identify potted plant diseases',
  },
  {
    method: 'GET',
    path: '/get_leaf_predictions?user_id=',
    desc: 'Get prediction history for a user',
  },
];

const ERROR_CODES = [
  { code: 400, desc: 'Bad Request — Missing or invalid parameters' },
  { code: 401, desc: 'Unauthorized — Invalid or missing API key' },
  { code: 404, desc: 'Not Found — Endpoint does not exist' },
  { code: 429, desc: 'Too Many Requests — Rate limit exceeded' },
  { code: 500, desc: 'Internal Server Error — Please contact support' },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white cursor-pointer"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function CodeBlock({ code, language }) {
  return (
    <div className="relative group rounded-xl overflow-hidden bg-gray-900 dark:bg-black border border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700">
        <span className="text-[11px] font-mono text-gray-400">{language}</span>
        <CopyButton text={code} />
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="text-gray-200 font-mono text-[13px] whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

function EndpointBadge({ method }) {
  const colors = {
    POST: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    GET: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded border ${colors[method] || colors.GET}`}>
      {method}
    </span>
  );
}

export default function Developers() {
  const [lang, setLang] = useState('cURL');
  const [expandedSection, setExpandedSection] = useState(0);
  const [expandedEndpoint, setExpandedEndpoint] = useState(null);

  return (
    <main>
      <SEO
        title="Developer API"
        description="Integrate Farmlyt AI's powerful agriculture APIs into your applications. Comprehensive documentation with code examples."
        url="/developers"
      />
      <PageHeader
        title="Developer API"
        description="Build powerful agricultural AI applications with our REST API."
      />
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Documentation Sections */}
          <div className="mb-12 space-y-2">
            {SECTIONS.map((s, i) => (
              <div
                key={s.title}
                className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:border-emerald-200 dark:hover:border-emerald-700"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === i ? -1 : i)}
                  className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-gray-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <s.icon size={16} className="text-emerald-500" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{s.title}</span>
                  </div>
                  {expandedSection === i ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                </button>
                {expandedSection === i && (
                  <div className="px-4 pb-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{s.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Endpoints */}
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">API Endpoints</h2>
          <div className="space-y-2 mb-12">
            {ENDPOINTS.map((ep) => (
              <div
                key={ep.path}
                className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedEndpoint(expandedEndpoint === ep.path ? null : ep.path)}
                  className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-gray-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <EndpointBadge method={ep.method} />
                    <code className="text-xs font-mono text-gray-700 dark:text-gray-300 truncate">{ep.path}</code>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:inline truncate">{ep.desc}</span>
                  </div>
                  {expandedEndpoint === ep.path ? <ChevronDown size={14} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />}
                </button>
                {expandedEndpoint === ep.path && (
                  <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="pt-3 space-y-3">
                      <div>
                        <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Parameters</p>
                        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                          <code className="font-mono">image</code> (required) — Image file (JPEG/PNG)
                          {ep.method === 'POST' && (
                            <>
                              <br />
                              <code className="font-mono">user_id</code> (required for paid plans) — User identifier
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Response</p>
                        <pre className="text-xs text-gray-200 bg-gray-900 dark:bg-black rounded-xl p-3 overflow-x-auto">
                          <code>{JSON.stringify({
                            prediction: 'Disease or item name',
                            confidence: 95.5,
                            original_image: 'https://...',
                            predicted_image: 'https://...',
                          }, null, 2)}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Code Examples */}
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Code Examples</h2>
          <div className="flex gap-1 mb-4 flex-wrap">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  lang === l
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <CodeBlock code={CODE_SAMPLES[lang]} language={lang} />

          {/* Error Codes */}
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 mt-12">Error Codes</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            {ERROR_CODES.map((ec) => (
              <div key={ec.code} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-xs font-bold font-mono text-red-500 w-8">{ec.code}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{ec.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
