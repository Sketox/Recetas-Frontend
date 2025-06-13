// src/components/ChatWidget.tsx
"use client";
import { useState } from "react";
import Chatbot from "./chatbot";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón flotante */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white text-2xl shadow-lg hover:bg-blue-700 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      {/* Chatbot flotante */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] max-h-[500px] bg-white border border-gray-300 shadow-lg rounded-lg p-4 overflow-y-auto z-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Asistente de Recetas</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-black"
            >
              ✖
            </button>
          </div>
          <Chatbot />
        </div>
      )}
    </>
  );
}
