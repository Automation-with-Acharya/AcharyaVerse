import { useState, useEffect, useRef } from "react";
import { knowledge } from "../data/knowledge";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export default function AiChat() {
  const [input, setInput] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello, I am AI Mayank. Ask me anything.",
    },
  ]);

  useEffect(() => {
    if (!chatContainerRef.current) return;

    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  const askQuestion = (question: string) => {
    setInput(question);

    setTimeout(() => {
      const userMessage: Message = {
        sender: "user",
        text: question,
      };

      let aiResponse = "That's an interesting question.";

      const lower = question.toLowerCase();

      if (lower.includes("experience")) {
        aiResponse = knowledge.experience;
      }

      if (lower.includes("skills")) {
        aiResponse = knowledge.skills;
      }

      if (lower.includes("physics")) {
        aiResponse = knowledge.physics;
      }

      if (lower.includes("project")) {
        aiResponse = knowledge.projects;
      }

      if (lower.includes("future")) {
        aiResponse = knowledge.future;
      }

      setMessages((prev) => [
        ...prev,
        userMessage,
        {
          sender: "ai",
          text: aiResponse,
        },
      ]);

      setInput("");
    }, 100);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      sender: "user",
      text: input,
    };

    let aiResponse = "That's an interesting question.";

    const lower = input.toLowerCase();

    if (lower.includes("experience")) {
      aiResponse = knowledge.experience;
    }

    if (lower.includes("skills")) {
      aiResponse = knowledge.skills;
    }

    if (lower.includes("physics")) {
      aiResponse = knowledge.physics;
    }

    if (lower.includes("project")) {
      aiResponse = knowledge.projects;
    }

    if (lower.includes("future")) {
      aiResponse = knowledge.future;
    }

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiResponse,
        },
      ]);

      setIsTyping(false);
    }, 1000);

    setInput("");
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <p>Try Asking:</p>

        <button
          onClick={() => askQuestion("Tell me about your experience")}
          style={{
            padding: "8px 14px",
            marginRight: "8px",
            marginBottom: "8px",
            borderRadius: "20px",
            border: "1px solid #2563eb",
            background: "#111827",
            color: "white",
            cursor: "pointer",
          }}
        >
          Experience
        </button>

        <button
          onClick={() => askQuestion("What are your skills?")}
          style={{
            padding: "8px 14px",
            marginRight: "8px",
            marginBottom: "8px",
            borderRadius: "20px",
            border: "1px solid #2563eb",
            background: "#111827",
            color: "white",
            cursor: "pointer",
          }}
        >
          Skills
        </button>

        <button
          onClick={() => askQuestion("Tell me about your projects")}
          style={{
            padding: "8px 14px",
            marginRight: "8px",
            marginBottom: "8px",
            borderRadius: "20px",
            border: "1px solid #2563eb",
            background: "#111827",
            color: "white",
            cursor: "pointer",
          }}
        >
          Projects
        </button>

        <button
          onClick={() => askQuestion("What are your future goals?")}
          style={{
            padding: "8px 14px",
            marginRight: "8px",
            marginBottom: "8px",
            borderRadius: "20px",
            border: "1px solid #2563eb",
            background: "#111827",
            color: "white",
            cursor: "pointer",
          }}
        >
          Future
        </button>

        <button
          onClick={() => askQuestion("Why do you like physics?")}
          style={{
            padding: "8px 14px",
            marginRight: "8px",
            marginBottom: "8px",
            borderRadius: "20px",
            border: "1px solid #2563eb",
            background: "#111827",
            color: "white",
            cursor: "pointer",
          }}
        >
          Physics
        </button>
      </div>

      <div
        ref={chatContainerRef}
        style={{
          height: "65vh",
          overflowY: "auto",
          border: "1px solid #333",
          padding: "20px",
          marginBottom: "20px",
          borderRadius: "12px",
          background: "#0f172a",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                message.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                background: message.sender === "user" ? "#2563eb" : "#1e293b",

                padding: "12px",

                borderRadius: "12px",

                maxWidth: "70%",

                color: "white",
              }}
            >
              <strong>{message.sender === "user" ? "You" : "AI Mayank"}</strong>

              <div
                style={{
                  marginTop: "5px",
                }}
              >
                {message.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div
            style={{
              marginBottom: "15px",
            }}
          >
            <strong>AI Mayank</strong>: Thinking...
          </div>
        )}
      </div>
      <input
        autoFocus
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        style={{
          width: "80%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #444",
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          marginLeft: "10px",
          padding: "12px 18px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}
