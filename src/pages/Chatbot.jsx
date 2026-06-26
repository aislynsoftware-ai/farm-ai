import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  MessageCircle, Send, Leaf, Sun, CloudRain, Bug, Sprout, Sparkles,
  Copy, Check, ThumbsUp, ThumbsDown, Bell, Paperclip,
} from 'lucide-react';

const suggestions = [
  { icon: Bug, label: 'Diagnose crop disease' },
  { icon: Sun, label: 'Best planting season' },
  { icon: CloudRain, label: 'Irrigation schedule' },
  { icon: Leaf, label: 'Fertilizer recommendation' },
  { icon: Sprout, label: 'Tomato care guide' },
];

const replies = [
  "Maintain soil pH between **6.0–7.0** for most crops. Test your soil before each growing season.\n\n| Nutrient | Ideal Range |\n|----------|------------|\n| Nitrogen | 40–80 ppm |\n| Phosphorus | 25–50 ppm |\n| Potassium | 150–300 ppm |",
  "Yellowing lower leaves usually signals **nitrogen deficiency**. Apply a balanced NPK fertilizer (10-10-10) at a rate of **1–2 kg per 100 sq ft**.",
  "Water deeply **2–3 times per week** rather than light daily watering. Early morning (6–9 AM) is optimal to reduce evaporation and prevent fungal diseases.",
  "**Marigolds** repel nematodes. **Basil** near tomatoes improves flavor and repels flies.\n\n1. Plant mint in containers (invasive otherwise)\n2. Use dill to attract beneficial insects\n3. Avoid fennel near most vegetables",
  "**Powdery mildew** needs good air circulation. Space plants properly and avoid overhead watering.\n\n> Treatment: Mix 1 tsp baking soda in 1L water and apply neem oil weekly.",
  "Add **well-rotted compost** (2–3 inches) to improve both drainage and water retention. For clay soil, add gypsum and organic matter.",
  "Most vegetables require **6–8 hours** of direct sunlight. Leafy greens tolerate partial shade (4–5 hours). Root vegetables need full sun.",
  "Rotate crop families yearly:\n- **Year 1**: Legumes (fix nitrogen)\n- **Year 2**: Leafy greens (use nitrogen)\n- **Year 3**: Root crops\n- **Year 4**: Fruiting crops",
];

const md = {
  p: ({ children }) => <p className="text-[15px] leading-[1.75] text-[#1C1917] dark:text-white/90 mb-3 last:mb-0">{children}</p>,
  h1: ({ children }) => <h1 className="text-lg font-bold text-[#1C1917] dark:text-white mt-5 mb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-bold text-[#1C1917] dark:text-white mt-4 mb-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-[15px] font-semibold text-[#1C1917] dark:text-white mt-3 mb-1.5">{children}</h3>,
  strong: ({ children }) => <strong className="font-semibold text-[#1C1917] dark:text-white">{children}</strong>,
  em: ({ children }) => <em className="italic text-[#1C1917] dark:text-white/90">{children}</em>,
  ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="text-[15px] leading-[1.75] text-[#78716C] dark:text-[#A1A1AA]">{children}</li>,
  code: ({ inline, className, children, ...props }) =>
    inline ? (
      <code className="px-1.5 py-0.5 rounded-md bg-[#F5F5F4] dark:bg-[#1C1C1E] text-emerald-600 dark:text-emerald-400 text-[13px] font-mono" {...props}>{children}</code>
    ) : (
      <pre className="overflow-x-auto rounded-xl bg-[#F5F5F4] dark:bg-[#1C1C1E] border border-[#E7E5E4] dark:border-[#27272A] p-3.5 mb-3 last:mb-0">
        <code className="text-[13px] leading-relaxed font-mono text-[#1C1917] dark:text-white/90" {...props}>{children}</code>
      </pre>
    ),
  pre: ({ children }) => <>{children}</>,
  table: ({ children }) => <div className="overflow-x-auto mb-3 last:mb-0"><table className="w-full text-[14px] border-collapse">{children}</table></div>,
  thead: ({ children }) => <thead className="bg-[#F5F5F4] dark:bg-[#1C1C1E]">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-[#E7E5E4] dark:border-[#27272A]">{children}</tr>,
  th: ({ children }) => <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#1C1917] dark:text-white">{children}</th>,
  td: ({ children }) => <td className="px-3 py-2 text-[14px] text-[#78716C] dark:text-[#A1A1AA]">{children}</td>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-600/30 dark:decoration-emerald-400/30 hover:decoration-emerald-600 dark:hover:decoration-emerald-400 transition-all">
      {children}
    </a>
  ),
  img: ({ src, alt }) => <img src={src} alt={alt} className="max-w-full rounded-lg my-2" />,
  hr: () => <hr className="my-3 border-[#E7E5E4] dark:border-[#27272A]" />,
  blockquote: ({ children }) => (
    <blockquote className="border-l-3 border-emerald-500/40 pl-3.5 italic text-[#78716C] dark:text-[#A1A1AA] mb-3 last:mb-0">{children}</blockquote>
  ),
};

function StreamText({ text, streaming, done }) {
  const [displayed, setDisplayed] = useState('');
  const timerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (!streaming) { setDisplayed(text); return; }
    const words = text.split(' ');
    let i = 0;
    setDisplayed('');
    timerRef.current = setInterval(() => {
      i++;
      if (mountedRef.current) setDisplayed(words.slice(0, i).join(' '));
      if (i >= words.length) { clearInterval(timerRef.current); done(); }
    }, 20);
    return () => { mountedRef.current = false; clearInterval(timerRef.current); };
  }, [text, streaming]);

  return (
    <>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>{displayed || ' '}</ReactMarkdown>
      {streaming && displayed !== text && <span className="inline-block w-[2px] h-[17px] bg-emerald-500 animate-pulse ml-0.5 align-text-bottom" />}
    </>
  );
}

export default function Chatbot() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hello! I'm your AI farming assistant. Ask me anything about crops, soil, pests, or sustainable farming practices.",
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingId, setStreamingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [suggestionClicked, setSuggestionClicked] = useState(false);
  const inputRef = useRef(null);
  const textRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const autoResize = useCallback(() => {
    const el = textRef.current;
    if (el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 120) + 'px'; }
  }, []);

  const addMessage = useCallback((text) => {
    if (!text.trim() || loading) return;
    setInput('');
    setSuggestionClicked(true);
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    setTimeout(() => {
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setMessages((prev) => {
        const idx = prev.length;
        setTimeout(() => setStreamingId(idx), 10);
        return [...prev, { role: 'assistant', content: reply }];
      });
      setLoading(false);
    }, 500 + Math.random() * 300);
  }, [loading]);

  const handleSend = useCallback(() => addMessage(input), [input, addMessage]);
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }, [handleSend]);

  const handleCopy = useCallback(async (content, idx) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(idx);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    document.documentElement.classList.toggle('dark');
  }, []);

  const showSuggestionCards = !suggestionClicked && messages.length === 1 && !loading;

  return (
    <div className="h-dvh pt-20 flex flex-col bg-[#FAFAF9] dark:bg-[#0B0B0C]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 scroll-smooth">
        <div className="sticky top-0 z-20 bg-[#FAFAF9]/80 dark:bg-[#0B0B0C]/80 backdrop-blur-md border-b border-[#E7E5E4] dark:border-[#27272A]">
          <div className="max-w-[1100px] mx-auto px-3 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
                <MessageCircle size={16} className="text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1C1917] dark:text-white">Farmlyt AI</span>
                <span className="hidden sm:flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Online
                </span>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#78716C] dark:text-[#A1A1AA] hover:text-[#1C1917] dark:hover:text-white hover:bg-[#F5F5F4] dark:hover:bg-[#1C1C1E] transition-all cursor-pointer relative"
                aria-label="Notifications"
              >
                <Bell size={14} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              </button>
              <div className="w-7 h-7 rounded-lg bg-[#F5F5F4] dark:bg-[#1C1C1E] flex items-center justify-center text-[10px] font-semibold text-[#78716C] dark:text-[#A1A1AA] border border-[#E7E5E4] dark:border-[#27272A] cursor-pointer hover:border-[#D6D3D1] dark:hover:border-[#3F3F46] transition-all ml-0.5">
                U
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto px-4 py-3">
          <AnimatePresence>
            {showSuggestionCards && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="mb-4"
              >
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles size={12} className="text-emerald-600" />
                  <span className="text-xs text-[#78716C] dark:text-[#A1A1AA]">Try asking about</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15, delay: i * 0.03 }}
                      onClick={() => addMessage(s.label)}
                      className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-white dark:bg-[#161616] border border-[#E7E5E4] dark:border-[#27272A] text-left text-xs text-[#78716C] dark:text-[#A1A1AA] hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:text-[#1C1917] dark:hover:text-white hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150 cursor-pointer group"
                    >
                      <span className="w-7 h-7 rounded-lg bg-[#F5F5F4] dark:bg-[#1C1C1E] flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/30 transition-colors flex-shrink-0">
                        <s.icon size={13} />
                      </span>
                      <span className="text-[13px] leading-tight">{s.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-2">
            {messages.map((msg, i) => {
              const isAssistant = msg.role === 'assistant';
              const isStreaming = streamingId === i;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex gap-2.5 ${isAssistant ? '' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <MessageCircle size={13} className="text-white" />
                    </div>
                  )}

                  {isAssistant ? (
                    <div className="group max-w-[65%] min-w-0">
                      <div className="px-4 py-2.5 bg-white dark:bg-[#161616] rounded-xl rounded-bl-sm shadow-sm border border-[#E7E5E4] dark:border-[#27272A]">
                        {isStreaming ? (
                          <StreamText text={msg.content} streaming done={() => setStreamingId(null)} />
                        ) : (
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>{msg.content}</ReactMarkdown>
                        )}
                      </div>
                      {!isStreaming && (
                        <div className="flex items-center gap-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pl-1">
                          <button
                            onClick={() => handleCopy(msg.content, i)}
                            className="w-6 h-6 rounded-md flex items-center justify-center text-[#78716C] dark:text-[#A1A1AA] hover:text-[#1C1917] dark:hover:text-white hover:bg-[#F5F5F4] dark:hover:bg-[#1C1C1E] transition-all cursor-pointer"
                            aria-label="Copy"
                          >
                            {copiedId === i ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                          </button>
                          <button className="w-6 h-6 rounded-md flex items-center justify-center text-[#78716C] dark:text-[#A1A1AA] hover:text-emerald-500 hover:bg-[#F5F5F4] dark:hover:bg-[#1C1C1E] transition-all cursor-pointer" aria-label="Like">
                            <ThumbsUp size={11} />
                          </button>
                          <button className="w-6 h-6 rounded-md flex items-center justify-center text-[#78716C] dark:text-[#A1A1AA] hover:text-red-500 hover:bg-[#F5F5F4] dark:hover:bg-[#1C1C1E] transition-all cursor-pointer" aria-label="Dislike">
                            <ThumbsDown size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl rounded-br-sm max-w-[65%] shadow-sm">
                      <p className="text-[15px] leading-[1.65]">{msg.content}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {loading && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5 mt-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <MessageCircle size={13} className="text-white" />
              </div>
              <div className="px-4 py-3 rounded-xl rounded-bl-sm bg-white dark:bg-[#161616] shadow-sm border border-[#E7E5E4] dark:border-[#27272A]">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      <div className="bg-gradient-to-t from-[#FAFAF9] via-[#FAFAF9]/90 to-transparent dark:from-[#0B0B0C] dark:via-[#0B0B0C]/90 dark:to-transparent pt-3 pb-2">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="flex items-center min-h-[56px] bg-white/80 dark:bg-[#161616]/80 backdrop-blur-xl rounded-xl border border-[#E7E5E4]/80 dark:border-[#27272A]/80 shadow-sm px-2">
            <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#78716C] dark:text-[#A1A1AA] hover:text-[#1C1917] dark:hover:text-white hover:bg-[#F5F5F4] dark:hover:bg-[#1C1C1E] transition-all cursor-pointer flex-shrink-0" aria-label="Attach file">
              <Paperclip size={15} />
            </button>
            <textarea
              ref={textRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about farming, crops, or soil..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-[#1C1917] dark:text-white placeholder-[#78716C] dark:placeholder-[#A1A1AA] outline-none resize-none py-2.5 px-1.5 max-h-[120px] leading-[1.4]"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center hover:bg-emerald-700 disabled:opacity-25 disabled:hover:bg-emerald-600 transition-all cursor-pointer flex-shrink-0 shadow-sm"
              aria-label="Send"
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
          <p className="text-center text-[10px] text-[#78716C]/50 dark:text-[#A1A1AA]/50 mt-1.5">
            AI responses are for guidance. Verify with local agricultural experts.
          </p>
        </div>
      </div>
    </div>
  );
}
