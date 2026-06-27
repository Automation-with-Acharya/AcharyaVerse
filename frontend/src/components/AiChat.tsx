import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAiResponse,
  DEFAULT_CONFIG,
  type AiConfig,
  type ApiProvider,
} from "../services/aiService";

type Message = {
  id: number;
  sender: "user" | "ai";
  text: string;
  timestamp: string; // ISO string for localstorage serialization
  isStreaming?: boolean;
};

const SUGGESTED = [
  { label: "Who are you?",       question: "Who is Mayank Acharya?" },
  { label: "Experience",         question: "Tell me about your experience at Bank of America" },
  { label: "Projects",           question: "What projects have you built?" },
  { label: "Skills",             question: "What are your technical skills?" },
  { label: "Automation",         question: "Tell me about your automation work" },
  { label: "AI Goals",           question: "What are your AI and future goals?" },
  { label: "Physics",            question: "Why do you love physics?" },
  { label: "Achievements",       question: "What are your key achievements?" },
  { label: "Contact",            question: "How can I contact you?" },
];

export default function AiChat() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState<"idle" | "connecting" | "streaming" | "done" | "offline-fallback">("idle");
  const [showSettings, setShowSettings] = useState(false);

  // Load config from localStorage
  const [config, setConfig] = useState<AiConfig>(() => {
    const saved = localStorage.getItem("acharyaverse_ai_config");
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  // Load messages from localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("acharyaverse_ai_messages");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 0,
            sender: "ai",
            text: "Hello! I am AI Mayank — a digital twin powered by Mayank's personal knowledge base. Ask me anything about his career, projects, skills, or physics passion! 🚀",
            timestamp: new Date().toISOString(),
          },
        ];
  });

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem("acharyaverse_ai_config", JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem("acharyaverse_ai_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      const initialMsg: Message[] = [
        {
          id: Date.now(),
          sender: "ai",
          text: "System cache cleared. How can I help you today? 🪐",
          timestamp: new Date().toISOString(),
        },
      ];
      setMessages(initialMsg);
    }
  };

  const sendMessage = async (customQuestion?: string) => {
    const question = (customQuestion ?? input).trim();
    if (!question) return;

    const userMsgId = Date.now();
    const userMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: question,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Prepare a blank AI message for streaming
    const aiMsgId = userMsgId + 1;
    const initialAiMsg: Message = {
      id: aiMsgId,
      sender: "ai",
      text: "",
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, initialAiMsg]);

    try {
      const result = await getAiResponse(
        config,
        question,
        (currentText) => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === aiMsgId ? { ...msg, text: currentText } : msg))
          );
        },
        (currentStatus) => {
          setStatus(currentStatus);
        }
      );

      // Finish streaming update
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                text: result.text,
                isStreaming: false,
                // Add a note if it fell back
                ...(result.fallback && {
                  text: result.text + "\n\n*(Sent in local fallback mode because LLM was offline)*",
                }),
              }
            : msg
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
      setStatus("idle");
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    } catch (e) {
      return "";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      {/* ── TOP CONTROL BAR ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        {/* Connection status badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: config.provider === "offline" ? "#fbbf24" : "#34d399",
              boxShadow: config.provider === "offline" ? "0 0 8px #fbbf24" : "0 0 8px #34d399",
            }}
          />
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.8rem",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Mode: {config.provider === "offline" ? "Knowledge Base (Offline)" : config.provider === "ollama" ? "Local Ollama" : "OpenAI API"}
          </span>
        </div>

        {/* Settings and Clear Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: "6px 12px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#a78bfa",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.82rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease",
            }}
          >
            ⚙️ {showSettings ? "Close Settings" : "Connection Config"}
          </button>
          <button
            onClick={handleClearChat}
            style={{
              padding: "6px 12px",
              background: "rgba(244,63,94,0.05)",
              border: "1px solid rgba(244,63,94,0.15)",
              borderRadius: "8px",
              color: "#f43f5e",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.82rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            🗑️ Clear Chat
          </button>
        </div>
      </div>

      {/* ── SETTINGS COLLAPSIBLE PANEL ── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              overflow: "hidden",
              background: "rgba(2,4,12,0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(167,139,250,0.2)",
              borderRadius: "14px",
              padding: "16px 20px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              {/* Provider Selection */}
              <div>
                <label style={{ display: "block", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: "#64748b", marginBottom: "6px", textTransform: "uppercase" }}>
                  AI Provider
                </label>
                <select
                  value={config.provider}
                  onChange={(e) => setConfig((prev) => ({ ...prev, provider: e.target.value as ApiProvider }))}
                  style={{
                    width: "100%", padding: "8px 12px", background: "#0a0f1d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white", outline: "none"
                  }}
                >
                  <option value="offline">Offline Knowledge Base (Keyword RAG)</option>
                  <option value="ollama">Local Ollama Instance</option>
                  <option value="openai">OpenAI API</option>
                </select>
              </div>

              {/* Ollama config */}
              {config.provider === "ollama" && (
                <>
                  <div>
                    <label style={{ display: "block", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: "#64748b", marginBottom: "6px", textTransform: "uppercase" }}>
                      Ollama Endpoint URL
                    </label>
                    <input
                      type="text"
                      value={config.ollamaUrl}
                      onChange={(e) => setConfig((prev) => ({ ...prev, ollamaUrl: e.target.value }))}
                      style={{
                        width: "100%", padding: "8px 12px", background: "#0a0f1d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white", outline: "none"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: "#64748b", marginBottom: "6px", textTransform: "uppercase" }}>
                      Ollama Model Name
                    </label>
                    <input
                      type="text"
                      value={config.ollamaModel}
                      onChange={(e) => setConfig((prev) => ({ ...prev, ollamaModel: e.target.value }))}
                      style={{
                        width: "100%", padding: "8px 12px", background: "#0a0f1d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white", outline: "none"
                      }}
                    />
                  </div>
                </>
              )}

              {/* OpenAI config */}
              {config.provider === "openai" && (
                <>
                  <div>
                    <label style={{ display: "block", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: "#64748b", marginBottom: "6px", textTransform: "uppercase" }}>
                      OpenAI API Key
                    </label>
                    <input
                      type="password"
                      value={config.openaiKey}
                      placeholder="sk-..."
                      onChange={(e) => setConfig((prev) => ({ ...prev, openaiKey: e.target.value }))}
                      style={{
                        width: "100%", padding: "8px 12px", background: "#0a0f1d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white", outline: "none"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", color: "#64748b", marginBottom: "6px", textTransform: "uppercase" }}>
                      OpenAI Model Choice
                    </label>
                    <input
                      type="text"
                      value={config.openaiModel}
                      onChange={(e) => setConfig((prev) => ({ ...prev, openaiModel: e.target.value }))}
                      style={{
                        width: "100%", padding: "8px 12px", background: "#0a0f1d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white", outline: "none"
                      }}
                    />
                  </div>
                </>
              )}
            </div>
            <div style={{ marginTop: "12px", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: "#475569" }}>
              💡 Real-time context from Mayank's complete professional achievements portfolio is automatically fed to the LLM system prompt.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestion chips */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {SUGGESTED.map((item) => (
          <motion.button
            key={item.label}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => sendMessage(item.question)}
            style={{
              padding: "9px 18px",
              borderRadius: "50px",
              border: "1px solid rgba(167,139,250,0.3)",
              background: "rgba(167,139,250,0.08)",
              color: "#a78bfa",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.88rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
              letterSpacing: "0.02em",
            }}
          >
            {item.label}
          </motion.button>
        ))}
      </div>

      {/* Chat window */}
      <div
        ref={chatRef}
        style={{
          flex: 1,
          minHeight: "400px",
          maxHeight: "60vh",
          overflowY: "auto",
          background: "rgba(2,8,20,0.7)",
          border: "1px solid rgba(167,139,250,0.15)",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "16px",
          scrollbarWidth: "thin",
          scrollbarColor: "#a78bfa #0f172a",
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: "16px",
                gap: "10px",
                alignItems: "flex-end",
              }}
            >
              {/* AI avatar */}
              {msg.sender === "ai" && (
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6d28d9, #a78bfa)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9rem",
                    flexShrink: 0,
                  }}
                >
                  🤖
                </div>
              )}

              <div style={{ maxWidth: "80%" }}>
                {/* Sender label */}
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.78rem",
                    color: "#475569",
                    marginBottom: "4px",
                    textAlign: msg.sender === "user" ? "right" : "left",
                  }}
                >
                  {msg.sender === "user" ? "You" : "AI Mayank"} · {formatTime(msg.timestamp)}
                </div>

                {/* Bubble */}
                <div
                  style={{
                    background:
                      msg.sender === "user"
                        ? "linear-gradient(135deg, #1d4ed8, #4f46e5)"
                        : "rgba(167,139,250,0.1)",
                    border:
                      msg.sender === "user"
                        ? "1px solid rgba(79,70,229,0.4)"
                        : "1px solid rgba(167,139,250,0.2)",
                    padding: "12px 16px",
                    borderRadius:
                      msg.sender === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    color: "white",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text || (msg.isStreaming && status === "connecting" ? "Establishing quantum link..." : "Thinking...")}
                </div>
              </div>

              {/* User avatar */}
              {msg.sender === "user" && (
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1d4ed8, #4f46e5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9rem",
                    flexShrink: 0,
                  }}
                >
                  👤
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Live status subtext */}
        {status !== "idle" && (
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.75rem",
              color: "#a78bfa",
              marginTop: "10px",
              textAlign: "center",
              letterSpacing: "0.02em",
            }}
          >
            {status === "connecting" && "⚡ Connecting to LLM server..."}
            {status === "streaming" && "📡 Receiving live telemetry tokens..."}
            {status === "offline-fallback" && "⚠️ API Offline - Utilizing internal static index"}
          </div>
        )}
      </div>

      {/* Input row */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask me anything about Mayank..."
          style={{
            flex: 1,
            padding: "16px 20px",
            background: "rgba(2,8,20,0.8)",
            border: "1px solid rgba(167,139,250,0.25)",
            borderRadius: "12px",
            color: "white",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "1.02rem",
            outline: "none",
            transition: "border-color 0.2s ease",
          }}
        />

        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(109,40,217,0.4)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => sendMessage()}
          disabled={isTyping}
          style={{
            padding: "16px 24px",
            background: "linear-gradient(135deg, #6d28d9, #a78bfa)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: isTyping ? "not-allowed" : "pointer",
            fontFamily: "'Orbitron', monospace",
            fontSize: "0.95rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            opacity: isTyping ? 0.6 : 1,
            transition: "opacity 0.2s ease",
            whiteSpace: "nowrap",
          }}
        >
          Send →
        </motion.button>
      </div>
    </div>
  );
}
