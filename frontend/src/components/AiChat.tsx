import { useState } from "react";
import { knowledge } from "../data/knowledge";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export default function AiChat() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello, I am AI Mayank. Ask me anything.",
    },
  ]);

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

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        sender: "ai",
        text: aiResponse,
      },
    ]);

    setInput("");
  };

  return (
    <div>
      <div
        style={{
          height: "500px",
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
