"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Hero from "../components/hero";
import Footer from "../components/Footer";
import EditorCarousel from "../components/Carousel";
import RecipeCard from "../components/recipeCard";
import CategoryCard from "../components/category";
import CTA from "../components/CTA";
import { fetchRecipesFromAI, getRecipes } from "../lib/api";

const categories = [
  { icon: "🥐", name: "Desayuno", count: 1 },
  { icon: "🍴", name: "Almuerzo", count: 13 },
  { icon: "🍝", name: "Cena", count: 0 },
  { icon: "🍰", name: "Postre", count: 5 },
  { icon: "🍪", name: "Snack", count: 1 },
];

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  return (
    <div>
      <Navbar />
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
              <RecipeCard key={i} {...r} />
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
            <CategoryCard key={i} {...c} />
          ))}
        </div>
      </section>
        <CTA />

      {/* Botón flotante del chat */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white text-2xl shadow-lg hover:bg-blue-700 z-50"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        💬
      </button>

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
      <Footer />
    </div>
  );
}
