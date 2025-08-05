"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Recipe } from "@/types/recipe";
import { fetchFromBackend } from "@/services/index";

export default function RecipeDetailPage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Obtener receta del localStorage
    const storedRecipe = localStorage.getItem("selectedRecipe");
    if (storedRecipe) {
      setRecipe(JSON.parse(storedRecipe));
    } else {
      router.push("/recipes");
    }

    // Obtener usuario actual
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const userData = await fetchFromBackend("/user/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchCurrentUser();
  }, [router]);

  useEffect(() => {
    // Verificar si el usuario actual es el dueño de la receta
    if (recipe && currentUser) {
      // Comparar tanto con _id como con id para mayor compatibilidad
      const recipeOwnerId = recipe.userId;
      const currentUserId = currentUser._id || currentUser.id;
      
      console.log("🔍 Verificando propietario:");
      console.log("Recipe userId:", recipeOwnerId);
      console.log("Current user ID:", currentUserId);
      
      setIsOwner(recipeOwnerId === currentUserId);
    }
  }, [recipe, currentUser]);

  const handleEditRecipe = () => {
    // Redirigir a una página de edición (crearemos esto)
    localStorage.setItem("editingRecipe", JSON.stringify(recipe));
    router.push("/edit-recipe");
  };

  const handleDeleteRecipe = async () => {
    if (!recipe) return;
    
    const confirmDelete = confirm("¿Estás seguro de que quieres eliminar esta receta? Esta acción no se puede deshacer.");
    
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para eliminar recetas");
      return;
    }

    try {
      const recipeId = recipe._id || recipe.id;
      await fetchFromBackend(`/recipes/${recipeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Receta eliminada exitosamente");
      router.push("/recipes"); // Redirigir a la lista de recetas
    } catch (error) {
      console.error("Error al eliminar receta:", error);
      alert("Error al eliminar la receta. Inténtalo de nuevo.");
    }
  };

  if (!recipe) return <p className="text-center mt-10">Cargando receta...</p>;

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Título y botones de editar/eliminar */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          <p className="text-gray-600">{recipe.description}</p>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={handleEditRecipe}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              ✏️ Editar
            </button>
            <button
              onClick={handleDeleteRecipe}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              🗑️ Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Imagen */}
      <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-md mb-6">
        {recipe.imageUrl && recipe.imageUrl.trim() !== "" ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex flex-col items-center justify-center text-white">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold">{recipe.title}</h2>
          </div>
        )}
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
