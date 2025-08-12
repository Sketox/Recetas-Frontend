"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Recipe } from "@/types/recipe";
import { User } from "@/types/types";
import { fetchFromBackend } from "@/services/index";
import Modal from "@/components/modal";
import EditRecipeForm from "@/components/edit_recipe_form";

export default function RecipeDetailPage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);
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
        }) as User;
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
      const currentUserId = currentUser._id;
      
      console.log("🔍 Verificando propietario:");
      console.log("Recipe userId:", recipeOwnerId);
      console.log("Current user ID:", currentUserId);
      
      setIsOwner(recipeOwnerId === currentUserId);
    }
  }, [recipe, currentUser]);

  const handleEditRecipe = () => {
    setRecipeToEdit(recipe);
    setEditModalOpen(true);
  };

  const handleRecipeUpdated = async (updatedRecipe: Recipe) => {
    console.log("🔄 Actualizando receta:", updatedRecipe);
    
    // Actualizar la receta actual
    setRecipe(updatedRecipe);
    localStorage.setItem("selectedRecipe", JSON.stringify(updatedRecipe));
    
    // Cerrar el modal
    setEditModalOpen(false);
    setRecipeToEdit(null);
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header con título y botones de acción */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {recipe.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">{recipe.description}</p>
              
              {/* Información del autor */}
              {recipe.author ? (
                <div className="flex items-center mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="w-8 h-8 mr-3 text-orange-500 flex items-center justify-center">
                    👨‍🍳
                  </div>
                  <span className="font-medium text-gray-700">Receta creada por {recipe.author.name}</span>
                </div>
              ) : (
                <div className="flex items-center mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 mr-3 text-gray-500 flex items-center justify-center">🏠</div>
                  <span className="font-medium text-gray-700">Receta de Cooksy</span>
                </div>
              )}
            </div>
            
            {isOwner && (
              <div className="flex gap-3">
                <button
                  onClick={handleEditRecipe}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="text-lg">✏️</span>
                  <span className="font-semibold">Editar</span>
                </button>
                <button
                  onClick={handleDeleteRecipe}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="text-lg">🗑️</span>
                  <span className="font-semibold">Eliminar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Imagen principal modernizada */}
        <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl mb-8">
          {recipe.imageUrl && recipe.imageUrl.trim() !== "" ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 flex flex-col items-center justify-center text-white">
              <div className="text-8xl mb-6">🍽️</div>
              <h2 className="text-3xl font-bold text-center px-4">{recipe.title}</h2>
            </div>
          )}
          
          {/* Overlay con información rápida */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {recipe.category}
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  ⭐ {recipe.rating}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Tiempo total</div>
                <div className="text-lg font-bold">{totalTime} min</div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas modernizadas */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⏱</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Preparación</p>
            <p className="text-xl font-bold text-gray-900">{recipe.prepTime} min</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-200">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔥</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Cocción</p>
            <p className="text-xl font-bold text-gray-900">{recipe.cookTime} min</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-200">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Porciones</p>
            <p className="text-xl font-bold text-gray-900">{recipe.servings}</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-200">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Dificultad</p>
            <p className="text-xl font-bold text-gray-900">{recipe.difficulty}</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-200">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Valoración</p>
            <p className="text-xl font-bold text-gray-900">{recipe.rating}</p>
          </div>
        </div>

        {/* Información adicional modernizada */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            {recipe.category}
          </span>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-lg">📅</span>
            <span className="text-sm font-medium">
              Creado el {new Date(recipe.createdAt).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Ingredientes e instrucciones modernizadas */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Ingredientes */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🛒</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Ingredientes</h3>
            </div>
            
            <div className="space-y-3">
              {recipe.ingredients.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👨‍🍳</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Instrucciones</h3>
            </div>
            
            <div className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para editar receta */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <EditRecipeForm 
          recipe={recipeToEdit}
          onRecipeUpdated={handleRecipeUpdated}
          onClose={() => setEditModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
