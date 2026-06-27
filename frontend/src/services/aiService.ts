import { knowledge } from "../data/knowledge";

export type ApiProvider = "offline" | "ollama" | "openai";

export interface AiConfig {
  provider: ApiProvider;
  ollamaUrl: string;
  ollamaModel: string;
  openaiKey: string;
  openaiModel: string;
  voiceEnabled: boolean;
  speechRate: number;
  speechPitch: number;
}

export const DEFAULT_CONFIG: AiConfig = {
  provider: "offline",
  ollamaUrl: "http://localhost:11434",
  ollamaModel: "llama3",
  openaiKey: "",
  openaiModel: "gpt-4o-mini",
  voiceEnabled: true,
  speechRate: 1.0,
  speechPitch: 1.0,
};

// Keyword scoring fallback logic
export function getOfflineResponse(question: string): string {
  const lower = question.toLowerCase();
  let bestKey = "";
  let bestScore = 0;

  for (const key of Object.keys(knowledge)) {
    const keyWords = key.split(/\s+/);
    let score = 0;
    for (const kw of keyWords) {
      if (lower.includes(kw)) score += 2;
    }
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

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey"))
    return knowledge["hello"];

  if (lower.includes("help") || lower.includes("what can"))
    return knowledge["help"];

  if (lower.includes("who") || lower.includes("mayank") || lower.includes("yourself"))
    return knowledge["who"];

  return "That's an interesting question! I am AI Mayank and I know about Mayank's career, skills, projects, physics passion and future goals. Try asking about any of those topics!";
}

// Build RAG System Prompt
function buildSystemPrompt(): string {
  const context = Object.entries(knowledge)
    .map(([topic, info]) => `[Topic: ${topic}]\n${info}`)
    .join("\n\n");

  return `You are AI Mayank, the personal digital twin chatbot of Mayank Acharya. 
Your goal is to answer questions about Mayank's career, projects, skills, education, and hobbies (like physics).

Use the following curated knowledge base context about Mayank to formulate your response. 
Keep your tone professional, friendly, intelligent, and engaging.

Context:
${context}

Instructions:
1. Always speak in the first person ("I", "my", "me") as if you are Mayank himself.
2. If the user asks a question not answered in the context, politely state that you don't have that specific information but suggest related topics from his experience (RPA, Power BI, DevOps, React, Physics, AcharyaVerse).
3. Do not invent details or exaggerate achievements. Stay accurate to the provided context.`;
}

// Query local Ollama API
async function queryOllama(config: AiConfig, prompt: string, onToken: (text: string) => void): Promise<string> {
  const url = `${config.ollamaUrl}/api/chat`;
  const system = buildSystemPrompt();

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.ollamaModel,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt }
      ],
      stream: true
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama returned status ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("Response body is not readable");

  const decoder = new TextDecoder("utf-8");
  let accumulatedText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    // Ollama chat stream returns line-delimited JSON chunks
    const lines = chunk.split("\n").filter(l => l.trim() !== "");
    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.message?.content) {
          accumulatedText += parsed.message.content;
          onToken(accumulatedText);
        }
      } catch (e) {
        // Skip parsing errors for incomplete stream lines
      }
    }
  }

  return accumulatedText;
}

// Query OpenAI API
async function queryOpenAI(config: AiConfig, prompt: string, onToken: (text: string) => void): Promise<string> {
  if (!config.openaiKey) {
    throw new Error("OpenAI API Key is missing");
  }

  const system = buildSystemPrompt();
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.openaiKey}`
    },
    body: JSON.stringify({
      model: config.openaiModel,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt }
      ],
      stream: true
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API returned status ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("Response body is not readable");

  const decoder = new TextDecoder("utf-8");
  let accumulatedText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    // OpenAI stream returns SSE format: "data: {...}"
    const lines = chunk.split("\n").filter(l => l.trim() !== "");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const dataStr = line.slice(6);
        if (dataStr.trim() === "[DONE]") continue;
        try {
          const parsed = JSON.parse(dataStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            accumulatedText += content;
            onToken(accumulatedText);
          }
        } catch (e) {
          // Skip parsing errors
        }
      }
    }
  }

  return accumulatedText;
}

// Main chat dispatch method
export async function getAiResponse(
  config: AiConfig,
  prompt: string,
  onToken: (text: string) => void,
  onStatusChange?: (status: "connecting" | "streaming" | "done" | "offline-fallback") => void
): Promise<{ text: string; fallback: boolean }> {
  if (config.provider === "offline") {
    onStatusChange?.("offline-fallback");
    const response = getOfflineResponse(prompt);
    // Simulate token streaming for local offline fallback
    let current = "";
    const words = response.split(" ");
    for (let i = 0; i < words.length; i++) {
      current += (i === 0 ? "" : " ") + words[i];
      onToken(current);
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    onStatusChange?.("done");
    return { text: response, fallback: false };
  }

  try {
    onStatusChange?.("connecting");
    if (config.provider === "ollama") {
      onStatusChange?.("streaming");
      const text = await queryOllama(config, prompt, onToken);
      onStatusChange?.("done");
      return { text, fallback: false };
    } else {
      onStatusChange?.("streaming");
      const text = await queryOpenAI(config, prompt, onToken);
      onStatusChange?.("done");
      return { text, fallback: false };
    }
  } catch (error) {
    console.error("AI API Error, falling back to local Knowledge Base:", error);
    onStatusChange?.("offline-fallback");
    const response = getOfflineResponse(prompt);
    let current = "";
    const words = response.split(" ");
    for (let i = 0; i < words.length; i++) {
      current += (i === 0 ? "" : " ") + words[i];
      onToken(current);
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    onStatusChange?.("done");
    return { text: response, fallback: true };
  }
}
