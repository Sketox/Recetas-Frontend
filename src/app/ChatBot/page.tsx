// Intento de conectar el bakend

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon, PlusIcon, Cog6ToothIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { fetchFromBackend } from "@/services/index";
import { ChatMessage } from '@/types/types';

interface ChatApiResponse {
  success: boolean;
  recipes: any[];
}

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  
const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage: ChatMessage = { 
    id: Date.now().toString(), 
    text: input, 
    sender: 'user',
    timestamp: new Date()
  };
  setMessages(prev => [...prev, userMessage]);
  setInput('');

  try {
    const data = await fetchFromBackend('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message: input }),
    }) as ChatApiResponse;

    // Type guard for expected response shape
    if (data && typeof data === 'object' && data.success && data.recipes) {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: JSON.stringify(data.recipes, null, 2),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } else {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Error al obtener respuesta del asistente.',
        timestamp: new Date()
      }]);
    }

  } catch (error) {
    console.error('Chat error:', error);
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: 'Error al conectar con el servidor.',
      timestamp: new Date()
    }]);
  }

};


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  return (
    <div className="h-screen bg-white flex flex-col px-4 text-[#333]">
      {/* Contenedor de mensajes */}
      <div className="flex-1 overflow-y-auto pt-24 pb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`p-3 rounded-lg max-w-sm break-words shadow-md ${
              message.sender === 'user' ? 'bg-[#FF8C42] text-white' : 'bg-gray-200 text-black'
            }`}>
              <pre className="whitespace-pre-wrap text-sm">{message.text}</pre>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input y botones */}
      <div className="sticky bottom-0 bg-white pb-4 pt-2">
        <div className="border-2 border-[#FF8C42] bg-white w-full max-w-2xl mx-auto rounded-2xl p-4 flex items-center gap-3 shadow-lg">
          <PlusIcon className="h-5 w-5 text-[#FF8C42]" />
          <Cog6ToothIcon className="h-5 w-5 text-[#FF8C42]" />
          <input
            className="bg-transparent flex-1 text-black placeholder-gray-400 focus:outline-none"
            placeholder="Escribe ingredientes, ejemplo: arroz, pollo, tomate"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          {input.trim() ? (
            <button onClick={handleSend}>
              <PaperAirplaneIcon className="h-5 w-5 text-[#FF8C42] rotate-45" />
            </button>
          ) : (
            <MicrophoneIcon className="h-5 w-5 text-[#FF8C42]" />
          )}
        </div>
      </div>
    </div>
  );
}
