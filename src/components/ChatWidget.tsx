"use client";
import { useState } from "react";
import Chatbot from "./chatbot";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón flotante */}
      <button
        style={{ backgroundColor: "var(--color-orange-500)" }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-white text-2xl shadow-lg hover:opacity-90 z-50 flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        💬
      </button>

      {/* Ventana del chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] max-h-[80vh] bg-white border border-gray-300 shadow-lg rounded-lg flex flex-col z-50 overflow-hidden">
          <div
            className="flex justify-between items-center text-white px-4 py-2 font-semibold text-lg"
            style={{ backgroundColor: "var(--color-orange-500)" }}
          >
            <span>Chatbot IA</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
              aria-label="Cerrar chat"
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
