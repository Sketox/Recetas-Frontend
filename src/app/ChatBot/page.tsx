"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MicrophoneIcon,
  PlusIcon,
  Cog6ToothIcon,
  PaperAirplaneIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import { fetchFromBackend } from "@/services/index";

type ChatMessage = {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string; // ISO
};

type ApiResp = { success: boolean; reply?: string; error?: string };

/** Helper: devuelve el constructor de SpeechRecognition si existe */
type SRConstructor = new () => any;
const getSRConstructor = (): SRConstructor | null => {
  if (typeof window === "undefined") return null;
  return (
    ((window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition) ??
    null
  );
};

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "¡Qué hubo, mi llave! Soy el chef mas arrecho que hay, dime qué tienes en la refri y te armo algo costeño bacán. 🍤",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [busy, setBusy] = useState(false);

  // ---- Voz (dictado)
  const [listening, setListening] = useState(false);
  const [srSupported, setSrSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // ---- Lectura en voz alta (TTS)
  const [ttsSupported, setTtsSupported] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(false); // OFF por defecto
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const spokenIdsRef = useRef<Set<string>>(new Set());

  // ---- Scroll controlado
  const listRef = useRef<HTMLDivElement>(null);
  const [stickToBottom, setStickToBottom] = useState(true); // autoscroll solo si estamos cerca del final

  // Mantener ref del historial para payload
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Detectar si el usuario está cerca del fondo del contenedor
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onScroll = () => {
      const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setStickToBottom(distanceToBottom <= 80);
    };

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Hacer autoscroll solo si estamos "pegados al fondo"
  useEffect(() => {
    const el = listRef.current;
    if (!el || !stickToBottom) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
  }, [messages, stickToBottom]);

  // Inicializar SpeechRecognition (dictado)
  useEffect(() => {
    const SR = getSRConstructor();
    if (!SR) {
      setSrSupported(false);
      return;
    }

    const rec = new SR();
    rec.lang = "es-419"; // LATAM
    rec.continuous = false;
    rec.interimResults = true;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);

    rec.onerror = (e: any) => {
      const code = e?.error || "unknown";
      const tips: Record<string, string> = {
        "not-allowed":
          "Debes permitir el micrófono en el navegador (ícono de candado).",
        "service-not-allowed":
          "La política del navegador bloquea el servicio de voz. Desactiva bloqueadores o ‘Shields’.",
        "audio-capture":
          "No se detecta micrófono. Revisa permisos del sistema y navegador.",
        "no-speech":
          "No se detectó voz. Intenta hablar de nuevo o acerca el micrófono.",
        network:
          "El servicio de reconocimiento no respondió. Revisa tu conexión o bloqueadores.",
        aborted:
          "Se detuvo el reconocimiento. Vuelve a tocar el micrófono para reintentar.",
        unknown: "Ocurrió un problema con el micrófono.",
      };

      console.warn("[SR] onerror:", code, e);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-srerr`,
          sender: "bot",
          text: `${tips[code] || tips.unknown} 🎤`,
          timestamp: new Date().toISOString(),
        },
      ]);
      setListening(false);

      if (code === "no-speech") {
        try {
          recognitionRef.current?.start();
        } catch {}
      }
    };

    let finalTranscript = "";
    rec.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const tr = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalTranscript += tr;
        else interim += tr;
      }
      setInput((finalTranscript || interim).trim());
      if (finalTranscript) {
        const text = finalTranscript.trim();
        if (text) sendText(text);
        finalTranscript = "";
      }
    };

    recognitionRef.current = rec;
    return () => {
      try {
        rec.abort();
      } catch {}
    };
  }, []);

  // Inicializar SpeechSynthesis (TTS)
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setTtsSupported(false);
      return;
    }
    const synth = window.speechSynthesis;
    const loadVoices = () => setVoices(synth.getVoices());
    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => {
      try {
        synth.cancel();
      } catch {}
      synth.onvoiceschanged = null;
    };
  }, []);

  const pickSpanishVoice = (): SpeechSynthesisVoice | null => {
    const list = voices || [];
    return (
      list.find((v) =>
        /es[-_]?419|Latin|US Spanish|es[-_]?MX|es[-_]?US/i.test(
          v.lang || v.name
        )
      ) ||
      list.find((v) => (v.lang || "").toLowerCase().startsWith("es")) ||
      list[0] ||
      null
    );
  };

  const speak = (text: string) => {
    if (!ttsSupported || !ttsEnabled || !text) return;
    try {
      const synth = window.speechSynthesis;
      synth.cancel();

      const u = new SpeechSynthesisUtterance(text.replace(/\s+/g, " ").trim());
      const v = pickSpanishVoice();
      if (v) {
        u.voice = v;
        u.lang = v.lang;
      } else {
        u.lang = "es-419";
      }
      u.rate = 1;
      u.pitch = 1;

      u.onstart = () => setIsSpeaking(true);
      u.onend = () => setIsSpeaking(false);
      u.onerror = () => setIsSpeaking(false);

      synth.speak(u);
    } catch (e) {
      console.warn("[TTS] error:", e);
    }
  };

  const stopSpeaking = () => {
    if (!ttsSupported) return;
    try {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } catch {}
  };

  // Hablar automáticamente el último mensaje del bot (si TTS está ON)
  useEffect(() => {
    if (!ttsSupported || !ttsEnabled) return;
    const lastBot = [...messages]
      .reverse()
      .find((m) => m.sender === "bot" && !m.id.endsWith("-typing"));
    if (!lastBot) return;
    if (spokenIdsRef.current.has(lastBot.id)) return;
    spokenIdsRef.current.add(lastBot.id);
    speak(lastBot.text);
  }, [messages, ttsEnabled, ttsSupported]);

  const sendText = async (forcedText?: string) => {
    const text = (forcedText ?? input).trim();
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
      const payloadMsgs = [...messagesRef.current, userMsg]
        .slice(-12)
        .map((m) => ({ sender: m.sender, text: m.text }));

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
            : data?.error ||
              "Se nos cruzó el verde: no pude procesar tu pedido. 🌽";
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
          text: "El fogón está caído; intenta de nuevo en un ratito. 🍳",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const handleSend = () => sendText();

  const toggleMic = async () => {
    if (!srSupported) {
      alert(
        "Tu navegador no soporta dictado por voz (Web Speech API). Prueba Chrome/Edge/Brave o Safari."
      );
      return;
    }
    const rec = recognitionRef.current;
    if (!rec) return;

    if (listening) {
      rec.stop();
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      console.warn("[SR] getUserMedia error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-perm`,
          sender: "bot",
          text: "No tengo acceso al micrófono. Autoriza el permiso en el navegador/SO y reintenta. 🎤",
          timestamp: new Date().toISOString(),
        },
      ]);
      return;
    }

    setInput("");
    try {
      rec.start();
    } catch (err) {
      console.warn("[SR] start() error:", err);
    }
  };

  const toggleTTS = () => {
    if (!ttsSupported) {
      alert(
        "Tu navegador no soporta síntesis de voz. Prueba Chrome/Edge o Safari."
      );
      return;
    }
    const next = !ttsEnabled;
    setTtsEnabled(next);
    if (!next) stopSpeaking();
  };

  return (
    <div
      className="min-h-screen flex flex-col px-4 text-[#333] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/chatbot_background.webp')" }}
    >
      {/* Mensajes */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto pt-24 pb-4 overscroll-y-contain"
      >
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
                  : "bg-gray-200/90 text-black rounded-bl-sm"
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
                <p className="whitespace-pre-wrap text-sm">{m.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input + Controles */}
      <div className="sticky bottom-0 pb-4 pt-2">
        <div className="backdrop-blur bg-white/80 border-2 border-[#FF8C42] w-full max-w-2xl mx-auto rounded-2xl p-3 flex items-center gap-3 shadow-lg">
          <PlusIcon className="h-5 w-5 text-[#FF8C42]" />
          <Cog6ToothIcon className="h-5 w-5 text-[#FF8C42]" />

          {/* Botón TTS */}
          <button
            type="button"
            onClick={toggleTTS}
            title={
              ttsSupported
                ? ttsEnabled
                  ? isSpeaking
                    ? "Silenciar (hablando)"
                    : "Silenciar"
                  : "Activar lectura"
                : "No soportado"
            }
          >
            {ttsEnabled ? (
              <SpeakerWaveIcon
                className={`h-5 w-5 ${
                  isSpeaking ? "animate-pulse text-[#FF8C42]" : "text-[#FF8C42]"
                }`}
              />
            ) : (
              <SpeakerXMarkIcon className="h-5 w-5 text-[#FF8C42]" />
            )}
          </button>

          <input
            className="bg-transparent flex-1 text-black placeholder-gray-700 focus:outline-none"
            placeholder="Cuéntame qué quieres cocinar, mi llave…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          {input.trim() ? (
            <button onClick={handleSend} disabled={busy} title="Enviar">
              <PaperAirplaneIcon className="h-5 w-5 text-[#FF8C42] rotate-45" />
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleMic}
              disabled={busy}
              title={
                srSupported
                  ? listening
                    ? "Detener"
                    : "Hablar"
                  : "No soportado"
              }
              className="relative"
            >
              <MicrophoneIcon
                className={`h-5 w-5 ${
                  listening ? "animate-pulse text-[#FF8C42]" : "text-[#FF8C42]"
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
