import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, User, Loader, Trash2, Leaf, Sun, CloudRain, Bug, Sprout } from 'lucide-react';

const suggestions = [
  { icon: Bug, text: 'Identify crop disease' },
  { icon: Sun, text: 'Best planting season' },
  { icon: CloudRain, text: 'Soil moisture tips' },
  { icon: Leaf, text: 'Fertilizer advice' },
  { icon: Sprout, text: 'Companion planting' },
];

const replies = [
  "Maintain soil pH between 6.0–7.0 for most crops. Test your soil before each growing season.",
  "Yellowing lower leaves usually signals nitrogen deficiency. Apply a balanced NPK fertilizer.",
  "Water deeply 2-3 times per week rather than light daily watering. Early morning is optimal.",
  "Marigolds repel nematodes. Basil near tomatoes improves flavor and repels flies.",
  "Powdery mildew needs good air circulation. Space plants properly and avoid overhead watering.",
  "Add well-rotted compost to improve both drainage and water retention in any soil type.",
  "Most vegetables require 6-8 hours of direct sunlight. Leafy greens tolerate partial shade.",
  "Rotate crop families each year to prevent soil-borne diseases from building up.",
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI farming assistant. Ask me anything about crops, soil, pests, or sustainable farming practices.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (text) => {
    if (!text.trim() || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', content: replies[Math.floor(Math.random() * replies.length)] }]);
      setLoading(false);
    }, 1200 + Math.random() * 800);
  };

  const handleSend = () => addMessage(input);
  const newChat = () => { setMessages([messages[0]]); inputRef.current?.focus(); };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950 mt-20" >
      <div className="max-w-3xl mx-auto w-full px-4 flex flex-col h-full">

        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <MessageCircle size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white">Farmlyt AI</h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Agricultural Assistant
              </p>
            </div>
          </div>
          <button onClick={newChat} className="px-3 py-1.5 rounded-lg text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer flex items-center gap-1.5">
            <Trash2 size={13} />
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-2 mb-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => addMessage(s.text)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-300 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <s.icon size={14} className="text-emerald-500" />
                  {s.text}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                    <MessageCircle size={15} className="text-white" />
                  </div>
                )}
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={15} className="text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                <div
                  className={`px-4 py-3 text-sm leading-relaxed shadow-md ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-2xl rounded-tr-sm max-w-[75%]'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm max-w-[80%] shadow-gray-200/50 dark:shadow-black/20'
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                <MessageCircle size={15} className="text-white" />
              </div>
              <div className="px-5 py-3.5 rounded-2xl rounded-tl-sm bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700/50">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={endRef} />
        </div>

        <div className="pb-3 pt-2 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-end gap-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-1 pl-4 transition-all duration-200 focus-within:border-emerald-400 focus-within:shadow-md">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask about farming, crops, or soil..."
              className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none py-2.5"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center hover:bg-emerald-700 disabled:opacity-40 transition-all cursor-pointer flex-shrink-0 mr-1"
            >
              {loading ? <Loader size={16} className="animate-spin text-white" /> : <Send size={16} className="text-white" />}
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-2">
            AI responses are for guidance. Verify with local agricultural experts.
          </p>
        </div>

      </div>
    </div>
  );
}
