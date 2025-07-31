"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Recipe } from "@/types/recipe";

export default function RecipeDetailPage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedRecipe = localStorage.getItem("selectedRecipe");
    if (storedRecipe) {
      setRecipe(JSON.parse(storedRecipe));
    } else {
      router.push("/recipes"); // Si no hay receta, redirige a listado
    }
  }, [router]);

  if (!recipe) return <p className="text-center mt-10">Cargando receta...</p>;

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Título */}
      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
      <p className="text-gray-600 mb-4">{recipe.description}</p>

      {/* Imagen */}
      <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-md mb-6">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Info principal */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6 text-center">
        <div className="bg-gray-50 rounded-lg p-3 shadow">
          <p className="text-blue-500 text-lg">⏱</p>
          <p className="text-sm text-gray-500">Preparación</p>
          <p className="font-semibold">{recipe.prepTime} min</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 shadow">
          <p className="text-orange-500 text-lg">🔥</p>
          <p className="text-sm text-gray-500">Cocción</p>
          <p className="font-semibold">{recipe.cookTime} min</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 shadow">
          <p className="text-green-500 text-lg">👥</p>
          <p className="text-sm text-gray-500">Porciones</p>
          <p className="font-semibold">{recipe.servings}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 shadow">
          <p className="text-pink-500 text-lg">📈</p>
          <p className="text-sm text-gray-500">Dificultad</p>
          <p className="font-semibold">{recipe.difficulty}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 shadow">
          <p className="text-yellow-500 text-lg">⭐</p>
          <p className="text-sm text-gray-500">Valoración</p>
          <p className="font-semibold">{recipe.rating}</p>
        </div>
      </div>

      {/* Etiquetas */}
      <div className="flex items-center gap-2 mb-6">
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
          {recipe.category}
        </span>
        <p className="text-gray-400 text-sm">
          Creado: {new Date(recipe.createdAt).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Ingredientes e instrucciones */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Ingredientes */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Ingredientes</h3>
          <ul className="space-y-2 text-gray-700">
            {recipe.ingredients.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                ✅ {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Instrucciones */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">Instrucciones</h3>
          <ol className="space-y-3 text-gray-700 list-decimal list-inside">
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
