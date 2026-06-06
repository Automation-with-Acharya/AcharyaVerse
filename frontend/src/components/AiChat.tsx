import { useState } from "react";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export default function AiChat() {
  const [input, setInput] = useState("");

  const [messages, setMessages] =
    useState<Message[]>([
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

    let aiResponse =
      "That's an interesting question.";

    const lower =
      input.toLowerCase();

    if (
      lower.includes("experience")
    ) {
      aiResponse =
        "Mayank has worked at Bank of America Continuum India for over six years.";
    }

    if (
      lower.includes("skills")
    ) {
      aiResponse =
        "Skills include .NET, C#, Python, React, Power BI and UiPath.";
    }

    if (
      lower.includes("physics")
    ) {
      aiResponse =
        "Physics is one of Mayank's biggest passions.";
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
          minHeight: "300px",
          border: "1px solid #444",
          padding: "15px",
          marginBottom: "20px",
        }}
      >
        {messages.map(
          (message, index) => (
            <div
              key={index}
              style={{
                marginBottom: "10px",
              }}
            >
              <strong>
                {message.sender ===
                "user"
                  ? "You"
                  : "AI Mayank"}
                :
              </strong>{" "}
              {message.text}
            </div>
          )
        )}
      </div>

      <input
        value={input}
        onChange={(e) =>
          setInput(
            e.target.value
          )
        }
        style={{
          width: "70%",
          padding: "10px",
        }}
      />

      <button
        onClick={sendMessage}
        style={{
          marginLeft: "10px",
          padding: "10px",
        }}
      >
        Send
      </button>
    </div>
  );
}