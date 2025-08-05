'use client';
import React, { useState } from 'react';
import { fetchFromBackend } from "@/services/index";


export default function CreateRecipeForm({ onRecipeUploaded }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [instructions, setInstructions] = useState([]);
  const [newInstruction, setNewInstruction] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [servings, setServings] = useState('');

  const [showAlert, setShowAlert] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadButtonClick = () => document.getElementById('imageUpload')?.click();

  const handleAdd = (value, setValue, list, setList) => {
    if (value.trim()) {
      setList([...list, value.trim()]);
      setValue('');
    }
  };

  const handleRemove = (index, list, setList) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmitRecipe = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión para subir una receta.");
    return;
  }

  // ✅ Validación de campos obligatorios
  if (
    !title.trim() ||
    !description.trim() ||
    ingredients.length === 0 ||
    instructions.length === 0 ||
    !prepTime ||
    !cookTime ||
    !servings ||
    !difficulty ||
    !category
  ) {
    alert("Por favor completa todos los campos obligatorios.");
    return;
  }

  // ✅ Validación de tipos
  const prep = parseInt(prepTime);
  const cook = parseInt(cookTime);
  const serve = parseInt(servings);

  if (isNaN(prep) || isNaN(cook) || isNaN(serve)) {
    alert("Tiempo de preparación, cocción y porciones deben ser números.");
    return;
  }

  // ✅ Construcción del objeto para el backend
  const recipeData = {
    title: title.trim(),
    description: description.trim(),
    ingredients: ingredients.map((ing) => ing.trim()),
    instructions: instructions.map((inst) => inst.trim()),
    prepTime: prep,
    cookTime: cook,
    servings: serve,
    difficulty,
    category,
    imageUrl: "", // 🚧 Temporalmente vacío hasta implementar correctamente
    rating: 0,
  };

  console.log("🍳 Datos de la receta a enviar:", recipeData);
  console.log("🔑 Token disponible:", !!token);

  try {
    const newRecipe = await fetchFromBackend("/recipes", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(recipeData),
    });

    console.log("✅ Receta creada:", newRecipe);
    setShowAlert(true);
    
    // Limpiar el formulario después de crear la receta
    setTitle('');
    setDescription('');
    setIngredients([]);
    setInstructions([]);
    setPrepTime('');
    setCookTime('');
    setServings('');
    setDifficulty('');
    setCategory('');
    // setSelectedImage(null); // 🚧 Comentado temporalmente
    
    if (onRecipeUploaded) onRecipeUploaded();
  } catch (error) {
    console.error("❌ Error al crear receta:", error);
    alert("Error al crear la receta. Por favor, intenta de nuevo.");
  }
};



  return (
    <>
      {showAlert && (
        <div className="bg-green-100 text-green-800 p-2 rounded mb-4 text-center font-semibold">
          ✅ Receta cargada exitosamente
        </div>
      )}

      <main className="max-w-[1200px] mx-auto mt-8 px-5 grid gap-8 md:grid-cols-2">
        {/* Imagen */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center relative min-h-[350px]">
          {/* 🚧 TEMPORALMENTE DESHABILITADO - COMING SOON */}
          <div className="text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Carga de imágenes</h3>
            <p className="text-gray-500">No disponible por ahora... coming soon</p>
          </div>
          
          {/* 
          TODO: Reactivar cuando se implemente correctamente el manejo de imágenes
          {selectedImage ? (
            <>
              <img src={selectedImage} alt="Vista previa" className="max-h-full max-w-full object-cover rounded-lg" />
              <button onClick={handleUploadButtonClick} className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-70 text-white py-1 px-3 rounded text-sm hover:bg-opacity-90">
                Cambiar imagen
              </button>
            </>
          ) : (
            <button onClick={handleUploadButtonClick} className="bg-[#FF8C42] text-white py-2 px-4 rounded font-bold hover:bg-orange-600">
              + Subir imágenes
            </button>
          )}
          <input type="file" id="imageUpload" className="hidden" accept="image/*" onChange={handleImageChange} />
          */}
        </div>

        {/* Datos básicos */}
        <div className="bg-white rounded-lg shadow p-6 space-y-5">
          <Input label="Nombre de la receta" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea label="Descripción de la receta" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input icon="⏱️" placeholder="Preparación (min)" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
          <Input icon="🔥" placeholder="Cocción (min)" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
          <Select icon="⚙️" options={['Fácil', 'Intermedio', 'Difícil']} value={difficulty} onChange={(e) => setDifficulty(e.target.value)} placeholder="Dificultad" />
          <Select icon="🍽️" options={['Desayuno', 'Almuerzo', 'Cena', 'Postre', 'Snack']} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Categoría" />
          <Input icon="👥" type="number" placeholder="Porciones" value={servings} onChange={(e) => setServings(e.target.value)} />
        </div>

        {/* Ingredientes */}
        <Section title="Ingredientes">
          <div className="flex flex-wrap items-center gap-2 border border-gray-300 rounded p-2 min-h-[56px]">
            {ingredients.map((ing, i) => (
              <Tag key={i} text={ing} onRemove={() => handleRemove(i, ingredients, setIngredients)} />
            ))}
            <input
              type="text"
              placeholder="Añadir ingrediente..."
              className="flex-1 min-w-[120px] p-1 outline-none text-sm"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd(newIngredient, setNewIngredient, ingredients, setIngredients)}
            />
          </div>
        </Section>

        {/* Instrucciones */}
        <Section title="Instrucciones">
          {instructions.map((inst, i) => (
              <div key={i} className="flex items-start gap-2 mb-2">
                <span className="text-lg font-bold text-gray-600 pt-2">{i + 1}.</span>
                <span className="flex-1 text-gray-700 pt-2 truncate max-w-full whitespace-nowrap overflow-hidden">
                  {inst}
                </span>
                <button onClick={() => handleRemove(i, instructions, setInstructions)} className="ml-2 text-red-500 hover:text-red-700 font-bold text-sm">
                  Eliminar
                </button>
              </div>
            ))}

          <div className="flex items-center gap-2 mt-4">
            <textarea
              placeholder="Escribir nueva instrucción..."
              className="w-full p-2 border border-gray-300 rounded text-base resize-vertical min-h-[50px] outline-none focus:border-[#FF8C42]"
              value={newInstruction}
              onChange={(e) => setNewInstruction(e.target.value)}
            />
            <button onClick={() => handleAdd(newInstruction, setNewInstruction, instructions, setInstructions)} className="bg-[#FF8C42] text-white py-2 px-3 rounded font-bold hover:bg-orange-600 text-sm">
              +
            </button>
          </div>
        </Section>

        {/* Botón final */}
        <div className="md:col-span-2 text-center mt-6">
          <button onClick={handleSubmitRecipe} className="bg-[#FF8C42] text-white px-4 py-2 rounded hover:bg-[#e67c36] transition">
            Subir receta
          </button>
        </div>
      </main>
    </>
  );
}

// Componentes reutilizables
const Input = ({ label, icon, ...props }) => (
  <div className="flex items-center gap-2 flex-1 min-w-[150px]">
    {label && <label className="block mb-2 font-semibold text-gray-800">{label}</label>}
    {icon && <span className="text-xl text-gray-600">{icon}</span>}
    <input className="w-full p-2 border border-gray-300 rounded text-base outline-none focus:border-[#FF8C42]" {...props} />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block mb-2 font-semibold text-gray-800">{label}</label>
    <textarea className="w-full p-2 border border-gray-300 rounded text-base resize-vertical min-h-[80px] outline-none focus:border-[#FF8C42]" {...props} />
  </div>
);

const Select = ({ icon, options, value, onChange, placeholder = "Seleccionar..." }) => (
  <div className="flex items-center gap-2 flex-1 min-w-[150px]">
    {icon && <span className="text-xl text-gray-600">{icon}</span>}
    <select 
      className="w-full p-2 border border-gray-300 rounded text-base outline-none focus:border-[#FF8C42]"
      value={value}
      onChange={onChange}
    >
      <option value="">{placeholder}</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
    {children}
  </div>
);

const Tag = ({ text, onRemove }) => (
  <span className="bg-[#FF8C42] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
    {text}
    <button onClick={onRemove} className="text-white hover:text-gray-200 font-bold">×</button>
  </span>
);
