"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "../components/hero";
import EditorCarousel from "../components/Carousel";
import RecipeCard from "../components/recipeCard";
import CategoryCard from "../components/category";
import CTA from "../components/CTA";
import { fetchRecipesFromAI, getRecipes } from "../lib/api";
import Modal from '../components/modal';
import CreateRecipeForm from '../components/create_recipe_form';
import ChatWidget from "@/components/ChatWidget";

const categories = [
  { icon: "🥐", name: "Desayuno", count: 1 },
  { icon: "🍴", name: "Almuerzo", count: 13 },
  { icon: "🍝", name: "Cena", count: 0 },
  { icon: "🍰", name: "Postre", count: 5 },
  { icon: "🍪", name: "Snack", count: 1 },
];

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [input, setInput] = useState("");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseModal = () => setIsModalOpen(false);
  const router = useRouter(); 
  

  const handleRecipeUploaded = () => {
    setShowAlert(true);
    setIsModalOpen(false); // Cierra el modal

    setTimeout(() => setShowAlert(false), 3000); // Oculta la alerta
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSend = async () => {
    if (input.trim() === "") return;
    const res = await fetchRecipesFromAI(input);
    setRecipes(res);
    setInput("");
  };

  const handleViewRecipe = (index: number) => {
    const recipe = recipes[index];
    localStorage.setItem("selectedRecipe", JSON.stringify(recipe));
    router.push("/recipe_detail");
  };

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);


  return (
    <div>
      <div className="mt-10"></div>
      <Hero />

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-semibold mb-4">Selección del Editor</h2>
      </div>
      <EditorCarousel />

      {/* Recetas Destacadas dinámicas */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-6">Recetas Destacadas</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : recipes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {recipes.slice(0, 4).map((r, i) => (
            <RecipeCard
              key={i}
              title={r.title}
              description={r.description}
              imageUrl={r.imageUrl}
              time={(r.prepTime || 0) + (r.cookTime || 0)}
              difficulty={r.difficulty}
              rating={r.rating}
              onViewRecipe={() => {
                localStorage.setItem("selectedRecipe", JSON.stringify(r)); // ✅ Guardar receta
                router.push("/recipe_detail"); // ✅ Redirigir
              }}
            />
          ))}

          </div>
        ) : (
          <p>No hay recetas disponibles</p>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-6">Categorías</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((c, i) => (
            <CategoryCard
              key={i}
              {...c}
              isActive={selectedCategory === c.name}
              onClick={() => {
                setSelectedCategory(c.name); 
                router.push(`/recipes?category=${encodeURIComponent(c.name)}`);
              }}
            />
          ))}
        </div>
      </section>

      {/* Botón flotante del chat */}
      <div>
         <ChatWidget />
      </div>


      {/* Chat flotante */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] max-h-[500px] bg-white border border-gray-300 shadow-lg rounded-lg p-4 overflow-y-auto z-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Asistente de Recetas</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-gray-600 hover:text-black"
            >
              ✖
            </button>
          </div>

          <div className="mb-2">
            <input
              className="w-full border px-2 py-1 rounded mb-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="¿Qué quieres cocinar?"
            />
            <button
              className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
              onClick={handleSend}
            >
              Enviar
            </button>
          </div>

          {recipes.map((r, i) => (
            <div key={i} className="mb-4">
              <h4 className="font-semibold">{r.title}</h4>
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => handleViewRecipe(i)}
              >
                Ver receta →
              </button>
            </div>
          ))}
        </div>

      )}
    
    <CTA
      onOpenModal={() => setIsModalOpen(true)}
      onRequestAuth={() => setShowAuthPrompt(true)}
    />

        {showAuthPrompt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm relative">
                <button
                  onClick={() => setShowAuthPrompt(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold"
                >
                  ✖
                </button>
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Inicia sesión para compartir recetas
                </h3>
                <p className="text-gray-600 mb-6">
                  Debes estar registrado para poder subir tus recetas.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => router.push("/login")}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => router.push("/register")}
                    className="px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-100 transition"
                  >
                    Registrarse
                  </button>
                </div>
              </div>
            </div>
          )}


      {/* Función del botón de crear receta */}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <CreateRecipeForm onRecipeUploaded={handleRecipeUploaded} />
      </Modal>

    </div>

  );
}
