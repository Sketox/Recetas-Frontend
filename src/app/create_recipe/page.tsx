'use client';

import React, { useState } from 'react';
import Navbar from '../../components/navbar';

export default function CreateRecipePage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [instructions, setInstructions] = useState([]);
  const [newInstruction, setNewInstruction] = useState('');

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleUploadButtonClick = () => {
    document.getElementById('imageUpload').click();
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim() !== '') {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  const handleAddInstruction = () => {
    if (newInstruction.trim() !== '') {
      setInstructions([...instructions, newInstruction.trim()]);
      setNewInstruction('');
    }
  };

  const handleRemoveInstruction = (index) => {
    const updatedInstructions = instructions.filter((_, i) => i !== index);
    setInstructions(updatedInstructions);
  };

  return (
    <>
      <Navbar />

      <main className="max-w-[1200px] mx-auto mt-8 px-5">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="min-h-[350px] flex items-center justify-center relative overflow-hidden">
              {selectedImage ? (
                <img src={selectedImage} alt="Vista previa de la receta" className="max-h-full max-w-full object-cover rounded-lg" />
              ) : (
                <button
                  onClick={handleUploadButtonClick}
                  className="bg-[#FF8C42] text-white py-2 px-4 rounded font-bold cursor-pointer inline-flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                >
                  + Subir imágenes
                </button>
              )}
              <input
                type="file"
                id="imageUpload"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              {selectedImage && (
                <button
                  onClick={handleUploadButtonClick}
                  className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-70 text-white py-1 px-3 rounded text-sm hover:bg-opacity-90 transition-opacity"
                >
                  Cambiar imagen
                </button>
              )}
            </div>
          </div>

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

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Ingredientes</h2>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input type="checkbox" className="w-5 h-5 cursor-pointer" />
                <span className="flex-1 text-gray-700">{ingredient}</span>
                <button
                  onClick={() => handleRemoveIngredient(index)}
                  className="ml-2 text-red-500 hover:text-red-700 font-bold text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-4">
              <input
                type="text"
                placeholder="Ingresar nuevo ingrediente..."
                className="w-full p-2 border border-gray-300 rounded text-base outline-none focus:border-[#FF8C42] transition-colors"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddIngredient();
                  }
                }}
              />
              <button
                onClick={handleAddIngredient}
                className="bg-[#FF8C42] text-white py-2 px-3 rounded font-bold cursor-pointer inline-flex items-center justify-center gap-2 text-sm hover:bg-orange-600 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Instrucciones</h2>
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-2 mb-2">
                <span className="text-lg font-bold text-gray-600 min-w-[25px] text-right pt-2">{index + 1}.</span>
                <span className="flex-1 text-gray-700 pt-2">{instruction}</span>
                <button
                  onClick={() => handleRemoveInstruction(index)}
                  className="ml-2 text-red-500 hover:text-red-700 font-bold self-start text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-4">
              <textarea
                placeholder="Escribir nueva instrucción..."
                className="w-full p-2 border border-gray-300 rounded text-base resize-vertical min-h-[50px] outline-none focus:border-[#FF8C42] transition-colors"
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
              ></textarea>
              <button
                onClick={handleAddInstruction}
                className="bg-[#FF8C42] text-white py-2 px-3 rounded font-bold cursor-pointer inline-flex items-center justify-center gap-2 text-sm hover:bg-orange-600 transition-colors self-end"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button className="bg-[#FF8C42] text-white py-3 px-8 rounded font-bold cursor-pointer inline-flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors text-lg shadow">
            Subir receta
          </button>
        </div>
      </main>
    </>
  );
}