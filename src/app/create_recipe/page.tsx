//Aún falta el backend
'use client';

import React from 'react';
import Navbar from '../../components/navbar';

export default function CreateRecipePage() {
  return (
    <>
      <Navbar />

      <main className="max-w-[1200px] mx-auto mt-8 px-5">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Imagen */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="min-h-[350px] flex items-center justify-center">
              <button className="bg-[#FF8C42] text-white py-2 px-4 rounded font-bold cursor-pointer inline-flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors">
                + Subir imágenes
              </button>
            </div>
          </div>

          {/* Detalles de receta */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-800">Nombre de la receta</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded text-base outline-none focus:border-[#FF8C42] transition-colors" />
            </div>
            <div className="mb-5">
              <label className="block mb-2 font-semibold text-gray-800">Descripción de la receta</label>
              <textarea className="w-full p-2 border border-gray-300 rounded text-base resize-vertical min-h-[80px] outline-none focus:border-[#FF8C42] transition-colors"></textarea>
            </div>
            <div className="flex gap-4 flex-wrap mb-5">
              <div className="flex items-center gap-2 flex-1 min-w-[150px]">
                <span className="text-xl text-gray-600">⏱️</span>
                <input type="text" placeholder="Preparación" className="w-full p-2 border border-gray-300 rounded text-base outline-none focus:border-[#FF8C42] transition-colors" />
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-[150px]">
                <span className="text-xl text-gray-600">🔥</span>
                <input type="text" placeholder="Cocción" className="w-full p-2 border border-gray-300 rounded text-base outline-none focus:border-[#FF8C42] transition-colors" />
              </div>
            </div>
            <div className="flex gap-4 flex-wrap mb-5">
              <div className="flex items-center gap-2 flex-1 min-w-[150px]">
                <span className="text-xl text-gray-600">⚙️</span>
                <select className="w-full p-2 border border-gray-300 rounded text-base outline-none focus:border-[#FF8C42] transition-colors">
                  <option>Dificultad</option>
                  <option>Fácil</option>
                  <option>Media</option>
                  <option>Difícil</option>
                </select>
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-[150px]">
                <span className="text-xl text-gray-600">👥</span>
                <input type="number" placeholder="Porciones" className="w-full p-2 border border-gray-300 rounded text-base outline-none focus:border-[#FF8C42] transition-colors" />
              </div>
            </div>
          </div>

          {/* Ingredientes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Ingredientes</h2>
            <div className="flex items-center gap-2 mb-4">
              <input type="checkbox" className="w-5 h-5 cursor-pointer" />
              <input type="text" placeholder="Ingresar ingrediente..." className="w-full p-2 border border-gray-300 rounded text-base outline-none focus:border-[#FF8C42] transition-colors" />
            </div>
            <button className="bg-[#FF8C42] text-white py-2 px-3 rounded font-bold cursor-pointer inline-flex items-center justify-center gap-2 text-sm mt-4 hover:bg-orange-600 transition-colors">
              + Nuevo ingrediente
            </button>
          </div>

          {/* Instrucciones */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Instrucciones</h2>
            <div className="flex items-start gap-2 mb-4">
              <span className="text-lg font-bold text-gray-600 min-w-[25px] text-right pt-2">1</span>
              <textarea placeholder="Escribir instrucción..." className="w-full p-2 border border-gray-300 rounded text-base resize-vertical min-h-[80px] outline-none focus:border-[#FF8C42] transition-colors"></textarea>
            </div>
            <button className="bg-[#FF8C42] text-white py-2 px-3 rounded font-bold cursor-pointer inline-flex items-center justify-center gap-2 text-sm mt-4 hover:bg-orange-600 transition-colors">
              + Ingresar nueva instrucción
            </button>
          </div>
        </div>

        {/* Botón final */}
        <div className="flex justify-center mt-8">
          <button className="bg-[#FF8C42] text-white py-3 px-8 rounded font-bold cursor-pointer inline-flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors text-lg shadow">
            Subir receta
          </button>
        </div>
      </main>
    </>
  );
}
