// ChefVoiceAssistant.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { MicrophoneIcon, SpeakerWaveIcon } from "@heroicons/react/24/solid";

export default function ChefVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<
    { role: string; content: string }[]
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Procesar input del usuario
  const processUserInput = async (userMessage: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Verificar conexión antes de hacer fetch
      if (!navigator.onLine) {
        throw new Error("No hay conexión a internet");
      }

      const response = await fetch("http://localhost:5000/api/chef-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
        signal: AbortSignal.timeout(8000), // Timeout de 8 segundos
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (!data.response) {
        throw new Error("La respuesta del chef está vacía");
      }

      setConversation((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        { role: "chef", content: data.response },
      ]);
    } catch (err) {
      console.error("Error al procesar:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(`Oh là là! ${errorMessage}`);
      setConversation((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        { role: "chef", content: "Désolé, je ne peux pas répondre maintenant" },
      ]);
    } finally {
      setIsProcessing(false);
      setIsListening(false);
    }
  };

  // Resto del código de inicialización de voz...
  // (Mantén el mismo código de reconocimiento de voz que teníamos antes)

  return (
    <div className="flex flex-col items-center min-h-screen bg-orange-50 p-4">
      {/* Área de conversación */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 mb-4">
        {conversation.map((item, index) => (
          <div
            key={index}
            className={`mb-3 ${
              item.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                item.role === "user"
                  ? "bg-blue-100 text-blue-900"
                  : "bg-orange-100 text-orange-900"
              }`}
            >
              <p>{item.content}</p>
            </div>
          </div>
        ))}

        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-lg">
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-1 text-sm underline text-red-600"
            >
              Entendido
            </button>
          </div>
        )}
      </div>

      {/* Botón del micrófono */}
      <button
        onClick={toggleListening}
        disabled={isProcessing}
        className={`p-4 rounded-full ${
          isListening
            ? "bg-red-500 animate-pulse"
            : isProcessing
            ? "bg-gray-400"
            : "bg-orange-500 hover:bg-orange-600"
        } text-white transition-colors shadow-lg`}
      >
        <MicrophoneIcon className="h-8 w-8" />
      </button>

      {/* Estado actual */}
      <div className="mt-4 text-sm text-gray-600">
        {isListening && <p>Habla ahora...</p>}
        {isProcessing && <p>Chef está pensando...</p>}
      </div>
    </div>
  );
}
