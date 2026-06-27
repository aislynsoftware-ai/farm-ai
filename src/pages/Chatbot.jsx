import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send, Leaf, Sun, CloudRain, Bug, Sprout, Sparkles,
  Copy, Check, ThumbsUp, ThumbsDown, Paperclip, Bot, User,
  ChevronDown, X, Minimize2, Maximize2
} from 'lucide-react';

const suggestions = [
  { icon: Sprout, label: 'Diagnose Disease', emoji: '🪴' },
  { icon: Leaf, label: 'Fertilizer Advice', emoji: '🌾' },
  { icon: CloudRain, label: 'Irrigation Schedule', emoji: '💧' },
  { icon: Sun, label: 'Soil Analysis', emoji: '🌱' },
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
  p: ({ children }) => <p className="text-[14px] leading-[1.6] text-[#1C1917] dark:text-white/90 mb-2.5 last:mb-0">{children}</p>,
  h1: ({ children }) => <h1 className="text-base font-bold text-[#1C1917] dark:text-white mt-4 mb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-[15px] font-bold text-[#1C1917] dark:text-white mt-3.5 mb-1.5">{children}</h2>,
  h3: ({ children }) => <h3 className="text-[14px] font-semibold text-[#1C1917] dark:text-white mt-3 mb-1">{children}</h3>,
  strong: ({ children }) => <strong className="font-semibold text-[#1C1917] dark:text-white">{children}</strong>,
  em: ({ children }) => <em className="italic text-[#1C1917] dark:text-white/90">{children}</em>,
  ul: ({ children }) => <ul className="list-disc pl-4 mb-2.5 space-y-0.5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2.5 space-y-0.5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="text-[14px] leading-[1.6] text-[#78716C] dark:text-[#A1A1AA]">{children}</li>,
  code: ({ inline, className, children, ...props }) =>
    inline ? (
      <code className="px-1.5 py-0.5 rounded bg-[#F5F5F4] dark:bg-[#1C1C1E] text-emerald-600 dark:text-emerald-400 text-[12px] font-mono" {...props}>{children}</code>
    ) : (
      <pre className="overflow-x-auto rounded-lg bg-[#F5F5F4] dark:bg-[#1C1C1E] border border-[#E7E5E4] dark:border-[#27272A] p-3 mb-2.5 last:mb-0">
        <code className="text-[12px] leading-relaxed font-mono text-[#1C1917] dark:text-white/90" {...props}>{children}</code>
      </pre>
    ),
  pre: ({ children }) => <>{children}</>,
  table: ({ children }) => <div className="overflow-x-auto mb-2.5 last:mb-0"><table className="w-full text-[13px] border-collapse">{children}</table></div>,
  thead: ({ children }) => <thead className="bg-[#F5F5F4] dark:bg-[#1C1C1E]">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-[#E7E5E4] dark:border-[#27272A]">{children}</tr>,
  th: ({ children }) => <th className="px-2.5 py-1.5 text-left text-[12px] font-semibold text-[#1C1917] dark:text-white">{children}</th>,
  td: ({ children }) => <td className="px-2.5 py-1.5 text-[13px] text-[#78716C] dark:text-[#A1A1AA]">{children}</td>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-600/30 dark:decoration-emerald-400/30 hover:decoration-emerald-600 dark:hover:decoration-emerald-400 transition-all">
      {children}
    </a>
  ),
  img: ({ src, alt }) => <img src={src} alt={alt} className="max-w-full rounded-lg my-2" />,
  hr: () => <hr className="my-2.5 border-[#E7E5E4] dark:border-[#27272A]" />,
  blockquote: ({ children }) => (
    <blockquote className="border-l-3 border-emerald-500/40 pl-3 italic text-[#78716C] dark:text-[#A1A1AA] mb-2.5 last:mb-0">{children}</blockquote>
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
      {streaming && displayed !== text && <span className="inline-block w-[2px] h-[15px] bg-emerald-500 animate-pulse ml-0.5 align-text-bottom" />}
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
  const [isMinimized, setIsMinimized] = useState(false);
  const textRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const autoResize = useCallback(() => {
    const el = textRef.current;
    if (el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 100) + 'px'; }
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

  const toggleMinimize = useCallback(() => {
    setIsMinimized(!isMinimized);
  }, [isMinimized]);

  const showSuggestionCards = !suggestionClicked && messages.length === 1 && !loading;

  return (
    <div className="h-dvh flex flex-col bg-[#f5f7f8] dark:bg-[#0f172a] font-['Inter']">
      {/* Header - Emerald Gradient */}
      <header className="flex-shrink-0 bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-emerald-700 dark:to-emerald-600 shadow-lg">
        <div className="px-4 sm:px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg ring-2 ring-white/30">
                <Bot size={24} className="text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white dark:border-emerald-700 animate-pulse" />
            </div>
            
            <div>
              <h1 className="text-[17px] font-semibold text-white tracking-tight">Farmlyt AI Assistant</h1>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
                </span>
                <span className="text-[12px] font-medium text-white/80">Usually replies instantly</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={toggleMinimize}
              className="w-9 h-9 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white"
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>
            <button className="w-9 h-9 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors text-white/80 hover:text-white">
              <ChevronDown size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {!isMinimized && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 scroll-smooth py-4 px-4 sm:px-6">
            {/* Welcome State */}
            {messages.length === 1 && !suggestionClicked && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center min-h-[65vh] text-center max-w-2xl mx-auto"
              >
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                  className="mb-6"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                    <Leaf size={36} className="text-white" />
                  </div>
                </motion.div>
                
                <h2 className="text-2xl font-bold text-[#1C1917] dark:text-white mb-2">🌱 Farmlyt AI</h2>
                <p className="text-[15px] text-[#78716C] dark:text-[#A1A1AA] mb-8">How can I help your farm today?</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ 
                        scale: 1.02,
                        transition: { type: "spring", stiffness: 400, damping: 25 }
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => addMessage(s.label)}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-[#1e293b] shadow-sm hover:shadow-md transition-all duration-200 text-left border border-[#E7E5E4] dark:border-[#334155] hover:border-emerald-400/50 dark:hover:border-emerald-500/30"
                    >
                      <span className="text-2xl">{s.emoji}</span>
                      <span className="text-[14px] font-medium text-[#1C1917] dark:text-white">{s.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Messages */}
            <div className="flex flex-col gap-4 max-w-3xl mx-auto">
              {messages.map((msg, i) => {
                const isAssistant = msg.role === 'assistant';
                const isStreaming = streamingId === i;
                const showAvatar = isAssistant && (i === 0 || messages[i-1]?.role !== 'assistant');

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className={`flex items-start gap-2.5 ${!isAssistant ? 'justify-end' : ''}`}
                  >
                    {isAssistant && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                        <Bot size={14} className="text-white" />
                      </div>
                    )}

                    {isAssistant ? (
                      <div className="group max-w-[85%]">
                        <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white dark:bg-[#1e293b] shadow-sm border border-[#E7E5E4] dark:border-[#334155]">
                          {isStreaming ? (
                            <StreamText
                              text={msg.content}
                              streaming
                              done={() => setStreamingId(null)}
                            />
                          ) : (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={md}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          )}
                        </div>

                        {!isStreaming && (
                          <div className="flex gap-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            <button
                              onClick={() => handleCopy(msg.content, i)}
                              className="w-7 h-7 rounded-lg hover:bg-[#F5F5F4] dark:hover:bg-[#1C1C1E] flex items-center justify-center transition-colors"
                            >
                              {copiedId === i ? (
                                <Check size={13} className="text-emerald-500" />
                              ) : (
                                <Copy size={13} className="text-[#78716C] dark:text-[#A1A1AA]" />
                              )}
                            </button>
                            <button className="w-7 h-7 rounded-lg hover:bg-[#F5F5F4] dark:hover:bg-[#1C1C1E] flex items-center justify-center transition-colors">
                              <ThumbsUp size={13} className="text-[#78716C] dark:text-[#A1A1AA]" />
                            </button>
                            <button className="w-7 h-7 rounded-lg hover:bg-[#F5F5F4] dark:hover:bg-[#1C1C1E] flex items-center justify-center transition-colors">
                              <ThumbsDown size={13} className="text-[#78716C] dark:text-[#A1A1AA]" />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="max-w-[80%]">
                        <div className="px-4 py-2.5 rounded-2xl rounded-tr-none bg-emerald-500 dark:bg-emerald-600 text-white shadow-md">
                          <p className="text-[14px] leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Loading State */}
              {loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white dark:bg-[#1e293b] shadow-sm border border-[#E7E5E4] dark:border-[#334155]">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Composer - WhatsApp Style */}
          <div className="flex-shrink-0 bg-[#f5f7f8] dark:bg-[#0f172a] px-4 sm:px-6 py-3 border-t border-[#E7E5E4] dark:border-[#1e293b]">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 bg-white dark:bg-[#1e293b] rounded-full shadow-sm border border-[#E7E5E4] dark:border-[#334155] px-2 py-1 focus-within:border-emerald-500 focus-within:shadow-md transition-all duration-200">
                <button className="flex-shrink-0 w-9 h-9 rounded-full hover:bg-[#F5F5F4] dark:hover:bg-[#334155] flex items-center justify-center transition-colors">
                  <Paperclip size={18} className="text-[#78716C] dark:text-[#A1A1AA]" />
                </button>

                <textarea
                  ref={textRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    autoResize();
                  }}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent outline-none resize-none px-1 py-2 text-[14px] text-[#1C1917] dark:text-white placeholder-[#A8A29E] dark:placeholder-[#64748B] min-h-[40px] max-h-[100px]"
                  style={{ fontFamily: 'Inter' }}
                />

                <motion.button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                    input.trim() && !loading
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                      : 'bg-[#F5F5F4] dark:bg-[#334155] text-[#A8A29E] dark:text-[#64748B] cursor-not-allowed'
                  }`}
                >
                  <Send size={16} />
                </motion.button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}