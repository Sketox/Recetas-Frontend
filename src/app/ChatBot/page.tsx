"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MicrophoneIcon,
  PlusIcon,
  Cog6ToothIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { fetchFromBackend } from "@/services/index";

type ChatMessage = {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string; // ISO
};

type ApiResp = { success: boolean; reply?: string; error?: string };

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Bonjour! Soy Chef Pierre. Dime qué tienes y te guío, voilà! 🍳",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [busy, setBusy] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || busy) return;

    const userMsg: ChatMessage = {
      id: `${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    const typingMsg: ChatMessage = {
      id: `${Date.now()}-typing`,
      sender: "bot",
      text: "…",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg, typingMsg]);
    setInput("");
    setBusy(true);

    try {
      // formateamos el historial para el backend (últimos 12)
      const payloadMsgs = [...messages, userMsg].slice(-12).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const data = (await fetchFromBackend("/ai/chef-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMsgs }),
      })) as ApiResp;

      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => !m.id.endsWith("-typing"));
        const replyText =
          data?.success && data.reply
            ? data.reply
            : data?.error || "Oh là là… ocurrió un petit problème. 🥖";
        return [
          ...withoutTyping,
          {
            id: `${Date.now()}-bot`,
            sender: "bot",
            text: replyText,
            timestamp: new Date().toISOString(),
          },
        ];
      });
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev.filter((m) => !m.id.endsWith("-typing")),
        {
          id: `${Date.now()}-bot`,
          sender: "bot",
          text: "Le serveur culinaire ne répond pas. Réessayez! 🧑‍🍳",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col px-4 text-[#333]">
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto pt-24 pb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex mb-4 ${
              m.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[70%] break-words shadow ${
                m.sender === "user"
                  ? "bg-[#FF8C42] text-white rounded-br-sm"
                  : "bg-gray-200 text-black rounded-bl-sm"
              }`}
            >
              {m.id.endsWith("-typing") ? (
                <span className="inline-flex gap-1">
                  <span className="animate-pulse">•</span>
                  <span className="animate-pulse [animation-delay:150ms]">
                    •
                  </span>
                  <span className="animate-pulse [animation-delay:300ms]">
                    •
                  </span>
                </span>
              ) : (
                <pre className="whitespace-pre-wrap text-sm">{m.text}</pre>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white pb-4 pt-2">
        <div className="border-2 border-[#FF8C42] bg-white w-full max-w-2xl mx-auto rounded-2xl p-3 flex items-center gap-3 shadow-lg">
          <PlusIcon className="h-5 w-5 text-[#FF8C42]" />
          <Cog6ToothIcon className="h-5 w-5 text-[#FF8C42]" />
          <input
            className="bg-transparent flex-1 text-black placeholder-gray-400 focus:outline-none"
            placeholder="Cuéntame qué quieres cocinar…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          {input.trim() ? (
            <button onClick={handleSend} disabled={busy} title="Enviar">
              <PaperAirplaneIcon className="h-5 w-5 text-[#FF8C42] rotate-45" />
            </button>
          ) : (
            <button type="button" disabled title="Micrófono (próximamente)">
              <MicrophoneIcon className="h-5 w-5 text-[#FF8C42] opacity-60" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
