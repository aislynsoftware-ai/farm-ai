import { useState, useEffect, useRef, useCallback } from 'react';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'mr', name: 'मराठी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'ur', name: 'اردو' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'অসমীয়া' },
  { code: 'sd', name: 'سنڌي' },
  { code: 'ne', name: 'नेपाली' },
  { code: 'ks', name: 'कॉशुर' },
  { code: 'mai', name: 'मैथिली' },
  { code: 'mni', name: 'মৈতৈলোন্' },
  { code: 'sa', name: 'संस्कृतम्' },
  { code: 'sat', name: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
  { code: 'it', name: 'Italiano' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh-CN', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ar', name: 'العربية' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'th', name: 'ไทย' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'tl', name: 'Filipino' },
  { code: 'ro', name: 'Română' },
  { code: 'pl', name: 'Polski' },
  { code: 'sv', name: 'Svenska' },
  { code: 'da', name: 'Dansk' },
  { code: 'fi', name: 'Suomi' },
  { code: 'no', name: 'Norsk' },
  { code: 'cs', name: 'Čeština' },
  { code: 'hu', name: 'Magyar' },
  { code: 'uk', name: 'Українська' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'iw', name: 'עברית' },
  { code: 'ms', name: 'Bahasa Melayu' },
  { code: 'my', name: 'မြန်မာ' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'km', name: 'ភាសាខ្មែរ' },
];

const STORAGE_KEY = 'farmai_lang';

function findName(code) {
  const lang = LANGUAGES.find((l) => l.code === code);
  return lang ? lang.name : 'English';
}

function findCode(name) {
  const lang = LANGUAGES.find((l) => l.name === name);
  return lang ? lang.code : 'en';
}

function setGoogtransCookie(code) {
  if (code === 'en') {
    document.cookie = 'googtrans=; path=/; max-age=0';
  } else {
    document.cookie = `googtrans=/en/${code}; path=/; max-age=86400`;
  }
}

function deleteAllGoogtransCookies() {
  document.cookie.split(';').forEach((c) => {
    if (c.trim().startsWith('googtrans=')) {
      document.cookie = 'googtrans=; path=/; max-age=0';
      document.cookie =
        'googtrans=; path=/; domain=' + window.location.hostname + '; max-age=0';
    }
  });
}

function triggerGoogleCombo(code) {
  const combo = document.querySelector('.goog-te-combo');
  if (!combo) return false;
  combo.value = code;
  combo.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

export default function GoogleTranslate() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('English');
  const menuRef = useRef(null);

  const applyLanguage = useCallback((code) => {
    const name = findName(code);
    setCurrent(name);
    localStorage.setItem(STORAGE_KEY, name);
    setGoogtransCookie(code);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const valid = stored && LANGUAGES.some((l) => l.name === stored);
    const initialName = valid ? stored : 'English';
    const initialCode = findCode(initialName);

    setCurrent(initialName);
    deleteAllGoogtransCookies();
    if (initialCode !== 'en') {
      setGoogtransCookie(initialCode);
    }

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: LANGUAGES.map((l) => l.code).join(','),
          autoDisplay: false,
        },
        'google_translate_element_hidden',
      );
    };

    const scriptExists = document.querySelector(
      '[src*="translate_a/element.js"]',
    );
    if (!scriptExists) {
      const script = document.createElement('script');
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (
      window.google &&
      window.google.translate &&
      window.google.translate.TranslateElement
    ) {
      window.googleTranslateElementInit();
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const changeLanguage = useCallback(
    (code) => {
      setOpen(false);
      applyLanguage(code);

      if (triggerGoogleCombo(code)) return;

      let attempts = 0;
      const poll = setInterval(() => {
        attempts++;
        if (triggerGoogleCombo(code)) {
          clearInterval(poll);
        } else if (attempts >= 15) {
          clearInterval(poll);
          window.location.reload();
        }
      }, 200);
    },
    [applyLanguage],
  );

  return (
    <div className="relative" ref={menuRef}>
      <div id="google_translate_element_hidden" style={{ display: 'none' }} />
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
      >
        <Globe size={13} />
        <span className="hidden sm:inline notranslate" translate="no">
          {current}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20 z-[9999] max-h-64 overflow-y-auto">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setOpen(false);
                changeLanguage(lang.code);
              }}
              className={`cursor-pointer w-full text-left px-3 py-2 text-xs transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/40 notranslate ${
                current === lang.name
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/50 dark:bg-emerald-950/30'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
              translate="no"
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
      <style>{`
        .goog-te-banner-frame { display: none !important; }
        .goog-te-balloon-frame { display: none !important; }
        iframe.goog-te-banner-frame { display: none !important; visibility: hidden !important; }
        .skiptranslate { display: none !important; }
        body { top: 0 !important; }
      `}</style>
    </div>
  );
}
