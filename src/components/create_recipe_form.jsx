
'use client';
import React, { useState } from 'react';

export default function createRecipeForm({ onRecipeUploaded  }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [instructions, setInstructions] = useState([]);
  const [newInstruction, setNewInstruction] = useState('');
  const [showAlert, setShowAlert] = useState(false);

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

 
  const handleSubmitRecipe = () => {
    // 🔗 Aquí puedes conectar con el backend más adelante

    if (onRecipeUploaded) {
      onRecipeUploaded(); // Muestra alerta y cierra modal desde el componente principal
    }
  };



  const truncateInstruction = (text) => {
    return text.length > 60 ? text.slice(0, 40) + '...' : text;
  };

  return (
    <>
      {showAlert && (
        <div className="bg-green-100 text-green-800 p-2 rounded mb-4 text-center font-semibold">
          ✅ Receta cargada exitosamente

        </div>
      )}

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

            <div className="flex flex-wrap items-center gap-2 border border-gray-300 rounded p-2 min-h-[56px]">
              {ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="bg-[#FF8C42] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {ingredient}
                  <button
                    onClick={() => handleRemoveIngredient(index)}
                    className="text-white hover:text-gray-200 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Añadir ingrediente..."
                className="flex-1 min-w-[120px] p-1 outline-none text-sm"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIngredient();
                  }
                }}
              />
            </div>
          </div>


                <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Instrucciones</h2>
        {instructions.map((instruction, index) => (
          <div key={index} className="flex items-start gap-2 mb-2">
            <span className="text-lg font-bold text-gray-600 min-w-[25px] text-right pt-2">
              {index + 1}.
            </span>
            <span className="flex-1 text-gray-700 pt-2 line-clamp-1 break-words">
              {instruction}
            </span>
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


        
      <div className="text-center mt-6">
            
          <button
                  onClick={handleSubmitRecipe}
                  className="mt-4 bg-[#FF8C42] text-white px-4 py-2 rounded hover:bg-[#e67c36] transition"
                >
                  Subir receta
              </button>
        </div>
      </main>
      
    </>
  );
}
