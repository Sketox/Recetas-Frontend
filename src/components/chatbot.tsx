"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { text: string; from: "user" | "ai" }[]
  >([
    {
      text: "¡Hola! 👋 Bienvenido al Asistente de Recetas. ¿En qué tipo de recetas estás interesado hoy? Puedo ayudarte con ideas para desayunos, almuerzos, cenas y más.",
      from: "ai"
    }
  ]);

  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { text, from: "user" }]);
    setInput("");
    setLoading(true);

    try {
      const { fetchFromBackend } = await import("@/services/index");
      
      const data = await fetchFromBackend("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message: text }),
      }) as any;

      if (data.success && data.recipes) {
        const aiReply = data.recipes
          .map(
            (r: any) =>
              `🍽️ *${r.titulo}*\n🧂 Ingredientes: ${r.ingredientes.join(", ")}\n📖 Instrucciones: ${r.instrucciones.join(". ")}`
          )
          .join("\n\n");

        setMessages((prev) => [...prev, { text: aiReply, from: "ai" }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "No encontré recetas, intenta con otros ingredientes.", from: "ai" },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Error al conectar con el servidor.", from: "ai" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!loading) sendMessage(input);
    }
  };

  const toggleListening = () => {
    setListening((l) => !l);
    if (!listening) {
      setTimeout(() => setListening(false), 5000);
    }
  };

  const handleGoRecipeDetail = () => {
    if (!isMounted) return;
    router.push("/recipe-detail");
  };

  return (
    <div className="flex flex-col h-full max-h-[450px] w-full rounded-lg border border-gray-300 bg-white shadow-lg overflow-hidden">
      {/* Chat messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50"
      >
        {messages.length === 0 && !loading && (
          <p className="text-center text-gray-400 select-none">
            Escribe algo o pulsa el micrófono para hablar
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-xl whitespace-pre-wrap ${msg.from === "user"
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <LoadingIndicator />
            <div className="ml-3 bg-gray-200 text-gray-900 rounded-bl-none rounded-xl px-4 py-2">
              IA está escribiendo...
            </div>
          </div>
        )}
      </div>

      {/* Input + mic */}
      <div className="flex items-center border-t border-gray-300 px-4 py-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={loading || listening}
          placeholder={listening ? "Escuchando..." : "Escribe tu mensaje..."}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button
          onClick={listening ? undefined : () => sendMessage(input)}
          disabled={loading || listening || !input.trim()}
          style={{ backgroundColor: "var(--color-orange-500)" }}
          className="ml-2 px-4 py-2 rounded-full text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Enviar mensaje"
        >
          ➤
        </button>

        <button
          onClick={toggleListening}
          aria-label={listening ? "Detener micrófono" : "Activar micrófono"}
          className={`ml-3 p-2 rounded-full border-2 ${listening ? "border-red-500 bg-red-100" : "border-gray-300"
            } hover:border-red-500 transition-colors`}
        >
          <MicIcon active={listening} />
        </button>
      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <svg
      className="animate-spin h-6 w-6 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="IA hablando"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  );
}

function MicIcon({ active }: { active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-6 w-6 transition-colors duration-300 ${active ? "text-red-600" : "text-gray-600"
        }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      {active ? (
        // Micrófono activo (rojo)
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 1v11m0 0a3 3 0 003-3v-2a3 3 0 00-6 0v2a3 3 0 003 3zm-7 4a7 7 0 0014 0M5 15v2a7 7 0 0014 0v-2"
        />
      ) : (
        // Micrófono inactivo
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 1v11m0 0a3 3 0 003-3v-2a3 3 0 00-6 0v2a3 3 0 003 3z"
        />
      )}
    </svg>
  );
}
