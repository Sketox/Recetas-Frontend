"use client";
import { useState, useEffect, useRef } from "react";
import { MicrophoneIcon, SpeakerWaveIcon } from "@heroicons/react/24/solid";

// TypeScript: Declare SpeechRecognition for browsers
type SpeechRecognition = typeof window.SpeechRecognition extends undefined
  ? typeof window.webkitSpeechRecognition
  : typeof window.SpeechRecognition;
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ConversationItem {
  role: "user" | "chef";
  content: string;
}

export default function ChefVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Inicializar reconocimiento de voz
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition no soportado");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "es-ES";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.continuous = false;

    recognitionRef.current.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      await processUserInput(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Error en reconocimiento:", event.error);
      setIsListening(false);
    };

    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  // Procesar input del usuario
  const processUserInput = async (userMessage: string) => {
    setIsListening(false);
    setIsProcessing(true);

    // Agregar mensaje del usuario
    setConversation((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    try {
      // Enviar al backend
      const response = await fetch("http://localhost:5000/api/chef-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Error en la respuesta del servidor");

      const data = await response.json();

      // Agregar respuesta del chef
      setConversation((prev) => [
        ...prev,
        { role: "chef", content: data.response },
      ]);

      // Reproducir respuesta
      speakResponse(data.response);
    } catch (error) {
      console.error("Error:", error);
      setConversation((prev) => [
        ...prev,
        {
          role: "chef",
          content: "Oh là là! Un problème en cuisine...",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Convertir texto a voz
  const speakResponse = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Cancelar cualquier voz anterior

      const utterance = new SpeechSynthesisUtterance(text);
      synthesisRef.current = utterance;

      // Configurar voz francesa si está disponible
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find((v) => v.lang.includes("fr"));
      if (frenchVoice) {
        utterance.voice = frenchVoice;
        utterance.rate = 0.9;
        utterance.pitch = 0.95;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  // Manejar el micrófono
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.abort();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Cargar voces disponibles
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log("Voces disponibles:", voices);
      };

      // Forzar carga de voces en Chrome
      window.speechSynthesis.getVoices();
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header del Chef */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 flex items-center space-x-4">
          <div className="bg-white p-2 rounded-full">
            <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center">
              <span className="text-3xl">👨‍🍳</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Chef Pierre</h1>
            <p className="text-amber-100">Votre assistant culinaire</p>
          </div>
        </div>

        {/* Historial de conversación */}
        <div className="h-64 p-4 overflow-y-auto space-y-4">
          {conversation.map((item, index) => (
            <div
              key={index}
              className={`flex ${
                item.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  item.role === "user"
                    ? "bg-blue-100 text-blue-900 rounded-br-none"
                    : "bg-amber-100 text-amber-900 rounded-bl-none"
                }`}
              >
                <p>{item.content}</p>
              </div>
            </div>
          ))}

          {(isListening || isProcessing) && (
            <div className="flex justify-center">
              <div className="px-4 py-2 bg-gray-100 rounded-lg">
                <p className="text-gray-600">
                  {isListening ? "Escuchando..." : "Chef está pensando..."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="p-4 bg-gray-50 flex justify-center">
          <button
            onClick={toggleListening}
            disabled={isProcessing}
            className={`flex items-center justify-center w-16 h-16 rounded-full ${
              isListening
                ? "bg-red-500 animate-pulse"
                : isProcessing
                ? "bg-gray-400"
                : "bg-orange-500 hover:bg-orange-600"
            } transition-colors text-white shadow-lg`}
          >
            <MicrophoneIcon className="h-8 w-8" />
          </button>
        </div>
      </div>

      {/* Estado actual */}
      <div className="mt-4 text-sm text-gray-600">
        {isListening && (
          <p className="flex items-center">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Habla ahora...
          </p>
        )}
        {conversation.some((item) => item.role === "chef") && (
          <p className="flex items-center mt-2">
            <SpeakerWaveIcon className="h-4 w-4 mr-1 text-orange-500" />
            Presiona el micrófono para hablar de nuevo
          </p>
        )}
      </div>
    </div>
  );
}
