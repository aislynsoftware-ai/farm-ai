import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Copy, Check, Code, BookOpen, Key, Globe,
  Terminal, ChevronDown, ChevronRight,
} from 'lucide-react';
import SEO from '../components/common/SEO';
import PageHeader from '../components/layout/PageHeader';

const API_BASE = 'https://farmlytai.in/api';

const LANGUAGES = ['cURL', 'Python', 'JavaScript', 'PHP'];

const CODE_SAMPLES = {
  cURL: `curl -X POST ${API_BASE}/leafs/tomato \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "image=@tomato_leaf.jpg"`,
  Python: `import requests

url = "${API_BASE}/leafs/tomato"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
files = {"image": open("tomato_leaf.jpg", "rb")}

response = requests.post(url, headers=headers, files=files)
print(response.json())`,
  JavaScript: `const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('${API_BASE}/leafs/tomato', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));`,
  PHP: `$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${API_BASE}/leafs/tomato");
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
      'Farmlyt AI provides powerful REST APIs for agricultural AI — crop disease detection, plant identification, food grain analysis, and more. Our APIs are designed to be simple, fast, and reliable. All endpoints are accessible at the base URL below.',
  },
  {
    title: 'Authentication',
    icon: Key,
    content:
      'All API requests require authentication via an API key passed in the Authorization header. Generate and manage your API keys from the Developer Dashboard. Format: Authorization: Bearer YOUR_API_KEY',
  },
  {
    title: 'Base URL',
    icon: Globe,
    content: API_BASE,
  },
  {
    title: 'Rate Limits',
    icon: Terminal,
    content:
      'Rate limits by plan. Free: 10 total. Basic: 150 total. Standard: 500 total. Pro: 1000 total. Enterprise: Unlimited. Exceeding your limit returns a 429 Too Many Requests response.',
  },
];

const ERROR_CODES = [
  { code: 400, desc: 'Bad Request — Missing or invalid parameters' },
  { code: 401, desc: 'Unauthorized — Invalid or missing API key' },
  { code: 403, desc: 'Forbidden — Plan does not allow this action' },
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

export default function Developers() {
  const [lang, setLang] = useState('cURL');
  const [expandedSection, setExpandedSection] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

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
          {/* User ID Banner */}
          {user?.user_id && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key size={14} className="text-emerald-500" />
                <span className="text-xs text-emerald-700 dark:text-emerald-300">
                  Your User ID:
                </span>
                <code className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-700">
                  {user.user_id}
                </code>
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(user.user_id); }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all cursor-pointer"
                title="Copy User ID"
              >
                <Copy size={11} />
                Copy
              </button>
            </div>
          )}
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
                    {s.title === 'Base URL' ? (
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-emerald-600 dark:text-emerald-400 border border-gray-200 dark:border-gray-700 select-all">
                          {s.content}
                        </code>
                        <CopyButton text={s.content} />
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{s.content}</p>
                    )}
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