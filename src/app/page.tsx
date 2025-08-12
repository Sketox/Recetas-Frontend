"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "../components/hero";
import EditorCarousel from "../components/Carousel";
import RecipeCard from "../components/recipeCard";
import CategoryCard from "../components/category";
import CTA from "../components/CTA";
import { getRecipes, getCategories } from "@/lib/api";
import Modal from "../components/modal";
import CreateRecipeForm from "../components/create_recipe_form";
import Chatbot from "@/components/chatbot"; // 👈 monta el nuevo chat
import useTokenValidation from "@/hooks/useTokenValidation";
import { Recipe } from "@/types/recipe";

type CategorySummary = { name: string; icon: string; count: number };

export default function HomePage() {
  useTokenValidation();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const router = useRouter();

  const handleCloseModal = () => setIsModalOpen(false);
  const handleRecipeUploaded = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesData, categoriesData] = await Promise.all([
          getRecipes(),
          getCategories(),
        ]);
        setRecipes(recipesData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
        setRecipes([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="mt-10" />
      <Hero />

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-semibold mb-4">Selección del Editor</h2>
      </div>
      <EditorCarousel />

      {/* Recetas Destacadas dinámicas */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Recetas Destacadas
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre las mejores recetas seleccionadas especialmente para ti
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500" />
              <div className="mt-4 text-center text-gray-600">
                Cargando recetas...
              </div>
            </div>
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {recipes.slice(0, 4).map((r, i) => (
              <div
                key={r._id || r.id || i}
                className="transform hover:scale-105 transition-all duration-300"
              >
                <RecipeCard
                  recipeId={r._id || r.id}
                  title={r.title}
                  description={r.description}
                  imageUrl={r.imageUrl}
                  time={(r.prepTime || 0) + (r.cookTime || 0)}
                  difficulty={r.difficulty}
                  rating={r.rating}
                  author={r.author}
                  onViewRecipe={() => {
                    localStorage.setItem("selectedRecipe", JSON.stringify(r));
                    router.push("/recipe_detail");
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🍽️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay recetas disponibles
            </h3>
            <p className="text-gray-500">
              Sé el primero en compartir una deliciosa receta
            </p>
          </div>
        )}
      </section>

      {/* Categorías */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explora por Categorías
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra exactamente lo que buscas navegando por nuestras
            categorías
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <div
              key={c.name}
              className="transform hover:scale-105 transition-all duration-300"
            >
              <CategoryCard
                icon={c.icon}
                name={c.name}
                count={c.count}
                isActive={selectedCategory === c.name}
                onClick={() => {
                  setSelectedCategory(c.name);
                  router.push(
                    `/recipes?category=${encodeURIComponent(c.name)}`
                  );
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 👇 monta el chat (usa portal, no rompe layout) */}
      <Chatbot />

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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <CreateRecipeForm onRecipeUploaded={handleRecipeUploaded} />
      </Modal>
    </div>
  );
}
