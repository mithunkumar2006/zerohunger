import { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, RefreshCw } from "lucide-react";
import Button from "../common/Button";

export default function AIChatbot() {
  const {
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    sendBotMessage,
    isBotThinking,
    clearChat
  } = useApp();

  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isBotThinking]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendBotMessage(input.trim());
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="w-80 md:w-96 h-[460px] bg-[#0a0f1d]/90 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4 relative"
          >
            {/* Top glowing bar */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Sparkles size={16} className="animate-spin" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-display">Gaia Assistance</h4>
                  <p className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    AI_COGNITIVE_NODE_ONLINE
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                  title="Reset conversation"
                >
                  <RefreshCw size={12} />
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Messages box */}
            <div
              ref={scrollRef}
              className="flex-1 p-5 overflow-y-auto space-y-4"
            >
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-tr-none shadow-md"
                        : "bg-[#151c2e] border border-white/5 text-slate-200 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isBotThinking && (
                <div className="flex justify-start">
                  <div className="bg-[#151c2e] border border-white/5 text-slate-200 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input bar */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-white/[0.01] flex gap-2">
              <input
                type="text"
                placeholder="Ask about freshness metrics, carbon..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-[#0b1329]/60 border border-white/10 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <Button type="submit" variant="primary" className="!px-3 !py-2.5 !rounded-xl">
                <Send size={12} />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating bubble */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 text-white flex items-center justify-center shadow-2xl relative group"
      >
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <AnimatePresence mode="wait">
          {isChatOpen ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <MessageSquare size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
