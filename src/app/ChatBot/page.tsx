'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [isRecognizing, setIsRecognizing] = useState(false);

  useEffect(() => {
    // Scroll automático al último mensaje
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  useEffect(() => {
    // Inicializamos SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta Speech Recognition');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES'; // ajusta idioma
    recognition.continuous = true; // escucha continua
    recognition.interimResults = false; // no resultados parciales

    recognition.onresult = async (event) => {
      const lastResultIndex = event.results.length - 1;
      const transcript = event.results[lastResultIndex][0].transcript.trim();
      if (transcript) {
        // Añadimos mensaje del usuario
        const userMessage = { id: Date.now(), text: transcript, role: 'user' };
        setMessages((prev) => [...prev, userMessage]);

        // Enviar al backend
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: transcript }),
          });
          const data = await response.json();

          let botText = 'No se pudo obtener respuesta del asistente.';
          if (data.success && data.recipes) {
            botText = JSON.stringify(data.recipes, null, 2);
          }

          const botMessage = {
            id: Date.now() + 1,
            text: botText,
            role: 'bot',
          };
          setMessages((prev) => [...prev, botMessage]);

          // Voz con SpeechSynthesis
          const utterance = new SpeechSynthesisUtterance(botText);
          utterance.lang = 'es-ES';
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          const errorMsg = {
            id: Date.now() + 1,
            text: 'Error al conectar con el servidor.',
            role: 'bot',
          };
          setMessages((prev) => [...prev, errorMsg]);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('SpeechRecognition error', event.error);
      // Reiniciamos en caso de error para mantener activo el micrófono
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        alert('Permiso de micrófono denegado.');
      } else {
        recognition.stop();
        recognition.start();
      }
    };

    recognition.onend = () => {
      // Reiniciar reconocimiento para que sea siempre activo
      recognition.start();
    };

    recognition.start();
    setIsRecognizing(true);
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      setIsRecognizing(false);
    };
  }, []);

  return (
    <div className="h-screen bg-white flex flex-col px-4 text-[#333]">
      {/* Contenedor de mensajes */}
      <div className="flex-1 overflow-y-auto pt-24 pb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-lg max-w-sm break-words shadow-md ${
                message.role === 'user' ? 'bg-[#FF8C42] text-white' : 'bg-gray-200 text-black'
              }`}
            >
              <pre className="whitespace-pre-wrap text-sm">{message.text}</pre>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Indicador micrófono */}
      <div className="sticky bottom-0 bg-white pb-4 pt-2 flex justify-center">
        <div
          className={`rounded-full w-12 h-12 flex items-center justify-center ${
            isRecognizing ? 'bg-green-400 animate-pulse' : 'bg-red-400'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 1v11m0 0a3 3 0 003 3v0a3 3 0 01-3-3zm0 0a3 3 0 01-3-3v0a3 3 0 003 3zm6 2v2a6 6 0 01-12 0v-2m6 7v3m-3 0h6"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
