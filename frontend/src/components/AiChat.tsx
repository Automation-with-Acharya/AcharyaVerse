import { useState, useEffect, useRef } from "react";
import { knowledge } from "../data/knowledge";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: number;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
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

function getResponse(question: string): string {
  const lower = question.toLowerCase();

  // Score each knowledge key by how many keywords it matches
  let bestKey = "";
  let bestScore = 0;

  for (const key of Object.keys(knowledge)) {
    const keyWords = key.split(/\s+/);
    let score = 0;
    for (const kw of keyWords) {
      if (lower.includes(kw)) score += 2;
    }
    // Also check if any word in the question partially matches the key
    const qWords = lower.split(/\s+/);
    for (const qw of qWords) {
      if (key.includes(qw) && qw.length > 3) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }

  if (bestScore > 0 && bestKey) return knowledge[bestKey];

  // Topic-specific fallback patterns
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey"))
    return knowledge["hello"];

  if (lower.includes("help") || lower.includes("what can"))
    return knowledge["help"];

  if (lower.includes("who") || lower.includes("mayank") || lower.includes("yourself"))
    return knowledge["who"];

  return "That's an interesting question! I am AI Mayank and I know about Mayank's career, skills, projects, physics passion and future goals. Try asking about any of those topics!";
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#a78bfa",
          }}
        />
      ))}
    </div>
  );
}

export default function AiChat() {
  const [input, setInput]     = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [msgId, setMsgId]     = useState(100);

  const chatRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      sender: "ai",
      text: "Hello! I am AI Mayank — a digital twin powered by Mayank's personal knowledge base. Ask me anything about his career, projects, skills, or physics passion! 🚀",
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const sendMessage = (customQuestion?: string) => {
    const question = (customQuestion ?? input).trim();
    if (!question) return;

    const userMsg: Message = {
      id: msgId,
      sender: "user",
      text: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setMsgId((n) => n + 2);

    const response = getResponse(question);

    // Simulate realistic typing delay based on response length
    const delay = Math.min(800 + response.length * 10, 2500);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: msgId + 1,
          sender: "ai",
          text: response,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, delay);
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
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

              <div style={{ maxWidth: "72%" }}>
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
                  }}
                >
                  {msg.text}
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

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", alignItems: "flex-end", gap: "10px", marginBottom: "8px" }}
            >
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
                }}
              >
                🤖
              </div>
              <div
                style={{
                  background: "rgba(167,139,250,0.1)",
                  border: "1px solid rgba(167,139,250,0.2)",
                  padding: "12px 16px",
                  borderRadius: "16px 16px 16px 4px",
                }}
              >
                <TypingDots />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
